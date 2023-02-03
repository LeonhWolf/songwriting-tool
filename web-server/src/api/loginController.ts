import {
  Body,
  Controller,
  Post,
  Route,
  SuccessResponse,
  Request,
  NoSecurity,
} from "tsoa";
import {
  Request as ExpressRequest,
  Response as ExpressResponse,
} from "express";

import { ILogin } from "../../../api-types/authentication.types";
import {
  verifyCredentials,
  loginUserAndRedirect,
} from "../services/authorizationService";
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
    try {
      const user = await verifyCredentials(
        requestBody.email_address,
        requestBody.password
      );
      if (user === null) {
        this.setStatus(400);
        logger.log(
          "warn",
          `User with email address: '${requestBody.email_address}' could not be logged in: Wrong credentials were used.`
        );
        return "The credentials provided don't match any user.";
      }
      const userId = user?.get("_id");

      await loginUserAndRedirect(request, userId);
    } catch (error) {
      this.setStatus(500);
      logger.log(
        "error",
        `User with email address: '${requestBody.email_address}' could not be logged in: ${error}`
      );
      return "There was an internal server error.";
    }

    return "User is logged in.";
  }
}
