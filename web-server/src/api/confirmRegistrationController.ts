import { Body, Controller, Post, Route, SuccessResponse } from "tsoa";
import mongoose from "mongoose";

import { IConfirmRegistration } from "../../../api-types/authentication.types";
import { tryConfirmation } from "../services/userService";
import { logger } from "../utils/logger";

@Route("confirm-registration")
export class ConfirmRegisterController extends Controller {
  /**
   * Attempts to confirm the registration of a user.
   */
  @SuccessResponse("200", "User registration has been successfully confirmed.")
  @Post()
  public async confirmRegistration(
    @Body() requestBody: IConfirmRegistration
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
