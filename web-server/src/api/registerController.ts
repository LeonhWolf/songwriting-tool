import { Body, Controller, Post, Route, SuccessResponse } from "tsoa";
import mongoose from "mongoose";

import {
  INewUser,
  create,
  getEmailTakenErrorMessage,
} from "../services/userService";
import { sendMail } from "../services/mailService";
import { getInterpolatedEmailString } from "../services/emailTemplateService";
import { logger } from "../utils/logger";

@Route("register")
export class RegisterController extends Controller {
  /**
   * Attempts to register a new user.
   */
  @SuccessResponse(
    "200",
    "User was created if email address was not already in use."
  )
  @Post()
  public async createUser(@Body() requestBody: INewUser): Promise<void> {
    if (!process.env.BASE_URL) {
      logger.log(
        "error",
        "User not registered: Environment variable 'BASE_URL' is 'undefined'."
      );
      this.setStatus(500);
      return;
    }

    try {
      const createdUser = await create(requestBody);
      const confirmationExpiresOn = createdUser.get(
        "account_confirmation.expires_on"
      ) as Date;
      const accountConfirmationId = (
        createdUser.get("account_confirmation._id") as mongoose.Types.ObjectId
      ).toString();

      const interpolatedEmailString = await getInterpolatedEmailString(
        "registerConfirmation",
        {
          name: `${requestBody.first_name} ${requestBody.last_name}`,
          confirmationLink: `${process.env.BASE_URL}/accountConfirmation?id=${accountConfirmationId}`,
          expiresOnDate: confirmationExpiresOn.toISOString(),
        }
      );
      await sendMail({
        toAddress: requestBody.email_address,
        subject: "Registration confirmation: Smart Grocery List",
        from: {
          name: "Smart Grocery List",
          address: "leonhardwolf@lw-webdev.de",
        },
        htmlContent: interpolatedEmailString,
      });

      this.setStatus(200);
    } catch (error) {
      if (error === getEmailTakenErrorMessage(requestBody.email_address)) {
        this.setStatus(200);
        return;
      }
      logger.log("error", `User not registered: ${error}`);
      this.setStatus(500);
    }
  }
}
