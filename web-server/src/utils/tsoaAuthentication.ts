import * as express from "express";
import session from "express-session";

import { app } from "../app";

declare module "express-session" {
  export interface SessionData {
    user: { [key: string]: any };
  }
}

export function expressAuthentication(
  request: express.Request,
  securityName: string,
  scopes?: string[]
): Promise<void> {
  if (request.session.user) return Promise.resolve();

  request.res?.redirect("/login");
  return Promise.reject({});
}
