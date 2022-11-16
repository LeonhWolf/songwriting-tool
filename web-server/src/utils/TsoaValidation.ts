import { NextFunction, Request, Response } from "express";
import { ValidateError } from "tsoa";

export default function tsoaValidation(
  error: unknown,
  req: Request,
  res: Response,
  next: NextFunction
): Response | void {
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
