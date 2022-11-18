import express, { json, urlencoded } from "express";
import process from "process";
import * as dotenv from "dotenv";
dotenv.config();
import swaggerUi from "swagger-ui-express";

import { RegisterRoutes } from "../tsoa-build/routes";
import tsoaValidation from "./utils/tsoaValidation";
import handleMongoDBConnection from "./utils/handleMongoDBConnection";
import { logger } from "./utils/logger";

const app = express();
const port = process.env.PORT || 5000;

app.use(urlencoded({ extended: true }));
app.use(json());

handleMongoDBConnection();

app.use("/api-docs", swaggerUi.serve, async (_req: any, res: any) => {
  return res.send(
    swaggerUi.generateHTML(await import("../tsoa-build/swagger.json"))
  );
});

RegisterRoutes(app);
app.use(tsoaValidation);

process.on("uncaughtException", (error) => {
  logger.log("error", error);
});

app.listen(port, () => {
  logger.log("info", `Server is listening on port: ${port}.`);
});
