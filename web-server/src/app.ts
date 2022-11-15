import express, { Router } from "express";
import swaggerUi from "swagger-ui-express";

import { RegisterRoutes } from "../tsoa-build/routes";

const app = express();
const router = Router();
const port = 5500;

app.use(router);

router.use("/api-docs", swaggerUi.serve, async (_req: any, res: any) => {
  return res.send(
    swaggerUi.generateHTML(await import("../tsoa-build/swagger.json"))
  );
});

RegisterRoutes(app);

app.listen(port, () => {
  console.log(`Listening on port: ${port}`);
});
