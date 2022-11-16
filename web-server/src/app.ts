import express, { json, urlencoded } from "express";
import * as dotenv from "dotenv";
dotenv.config();
import swaggerUi from "swagger-ui-express";

import { RegisterRoutes } from "../tsoa-build/routes";
import tsoaValidation from "./utils/TsoaValidation";

const app = express();
const port = 5500;

app.use(urlencoded({ extended: true }));
app.use(json());

app.use("/api-docs", swaggerUi.serve, async (_req: any, res: any) => {
  return res.send(
    swaggerUi.generateHTML(await import("../tsoa-build/swagger.json"))
  );
});

RegisterRoutes(app);

app.use(tsoaValidation);

app.listen(port, () => {
  console.log(`Listening on port: ${port}`);
});
