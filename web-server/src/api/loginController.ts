import {
  Body,
  Controller,
  Post,
  Route,
  SuccessResponse,
  Request,
  NoSecurity,
} from "tsoa";
import mongoose from "mongoose";
import {
  Request as ExpressRequest,
  Response as ExpressResponse,
} from "express";

import { ILogin } from "../../../api-types/authentication.types";
import { verifyCredentials } from "../services/authorizationService";
import { tryConfirmation } from "../services/userService";
import { logger } from "../utils/logger";

@Route("login")
export class LoginController extends Controller {
  /**
   * Attempts to login a user.
   */
  @NoSecurity()
  @SuccessResponse("201", "User is logged in.")
  @Post()
  public async logInUser(
    @Body() requestBody: ILogin,
    @Request() request: ExpressRequest
  ): Promise<string> {
    const user = await verifyCredentials(
      requestBody.email_address,
      requestBody.password
    );
    const userId = user?.get("_id");

    request.session.regenerate((error) => {
      request.session.user = { userId };

      request.session.save((error) => {
        const response = (<any>request).res as ExpressResponse;
        response.redirect("/");
      });
    });

    return "";
  }
}
