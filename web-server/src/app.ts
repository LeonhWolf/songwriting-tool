import express, {
  json,
  urlencoded,
  NextFunction,
  Request,
  Response,
} from "express";
import swaggerUi from "swagger-ui-express";
import { ValidateError } from "tsoa";

import { RegisterRoutes } from "../tsoa-build/routes";

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

app.use(
  (
    error: unknown,
    req: Request,
    res: Response,
    next: NextFunction
  ): Response | void => {
    if (error instanceof ValidateError) {
      console.warn(`Caught ValidationError for ${req.path}:`, error.fields);

      return res.status(422).json({
        message: "Validation failed",
        details: error?.fields,
      });
    }

    if (error instanceof Error) {
      return res.status(500).json({
        message: "Internal Server Error",
      });
    }
  }
);

app.listen(port, () => {
  console.log(`Listening on port: ${port}`);
});
