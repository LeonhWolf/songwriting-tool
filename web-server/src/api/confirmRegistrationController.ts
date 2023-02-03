import {
  Request as ExpressRequest,
  Response as ExpressResponse,
} from "express";
import { Body, Controller, Post, Route, SuccessResponse, Request } from "tsoa";
import mongoose from "mongoose";

import { IConfirmRegistration } from "../../../api-types/authentication.types";
import { tryConfirmation } from "../services/userService";
import { loginUserAndRedirect } from "../services/authorizationService";
import { logger } from "../utils/logger";

@Route("confirm-registration")
export class ConfirmRegistrationController extends Controller {
  /**
   * Attempts to confirm the registration of a user.
   */
  @SuccessResponse("200", "User registration has been successfully confirmed.")
  @Post()
  public async confirmRegistration(
    @Body() requestBody: IConfirmRegistration,
    @Request() request: ExpressRequest
  ): Promise<string> {
    try {
      const confirmedUser = await tryConfirmation(
        new mongoose.Types.ObjectId(requestBody.confirmation_id)
      );
      const confirmedUserId = confirmedUser._id;
      logger.log(
        "info",
        `Registration for account with id '${confirmedUserId}' has been confirmed.`
      );

      await loginUserAndRedirectWrapper(request, confirmedUserId);
      return "User registration has been successfully confirmed.";
    } catch (error) {
      logger.log(
        "warn",
        `Attempted registration confirmation with invalid id '${requestBody.confirmation_id}'.`
      );
      this.setStatus(400);
      return "The confirmation id is invalid.";
    }
  }
}

const loginUserAndRedirectWrapper = async (
  request: ExpressRequest,
  userId: mongoose.Types.ObjectId
): Promise<void> => {
  try {
    await loginUserAndRedirect(request, userId.toString());
  } catch (error) {
    logger.log(
      "info",
      `User with id '${userId.toString()}' was not logged in, instead redirected to login: ${error}`
    );
    const response = (<any>request).res as ExpressResponse;
    response.redirect("/login");
  }
};
