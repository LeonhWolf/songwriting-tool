import express, { json, urlencoded } from "express";
import cors from "cors";
import process from "process";
import * as dotenv from "dotenv";
dotenv.config();
import swaggerUi from "swagger-ui-express";

import { RegisterRoutes } from "../tsoa-build/routes";
import tsoaValidation from "./utils/tsoaValidation";
import handleMongoDBConnection from "./setup/handleMongoDBConnection";
import connectRedis from "./setup/handleRedisConnection";
import { logger } from "./utils/logger";
import tasksSchedulerService from "./services/tasksSchedulerService";
import { registerPassport } from "./setup/passport";

export const app = express();
const port = process.env.PORT || 5000;

app.use(urlencoded({ extended: true }));
app.use(json());

const origin =
  process.env.NODE_ENV === "production"
    ? process.env.BASE_URL
    : "http://localhost:3000";
app.use(
  cors({
    origin: [`${origin}`],
  })
);

handleMongoDBConnection();
connectRedis();

registerPassport(app);

app.use("/api-docs", swaggerUi.serve, async (_req: any, res: any) => {
  return res.send(
    swaggerUi.generateHTML(await import("../tsoa-build/swagger.json"))
  );
});

RegisterRoutes(app);
app.use(tsoaValidation);

tasksSchedulerService();

process.on("uncaughtException", (error) => {
  logger.log("error", error);
});
if (process.env.NODE_ENV !== "test") {
  app.listen(port, () => {
    logger.log("info", `Server is listening on port: ${port}.`);
  });
}
