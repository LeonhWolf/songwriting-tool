import { Body, Controller, Post, Route, SuccessResponse } from "tsoa";

import { INewUser, create } from "../services/userService";
import { sendMail } from "../services/mailService";
import { getInterpolatedEmailString } from "../services/emailTemplateService";

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
    const createdUser = await create(requestBody);
    const confirmationExpiresOn = createdUser.get("expires_on") as Date;

    const interpolatedEmailString = await getInterpolatedEmailString(
      "registerConfirmation",
      {
        name: `${requestBody.first_name} ${requestBody.last_name}`,
        confirmationLink: `${process.env.BASE_URL}/accountConfirmation?id=123`,
        expiresOnDate: confirmationExpiresOn.toISOString(),
      }
    );
    sendMail({
      toAddress: requestBody.email_address,
      subject: "Registration confirmation: Smart Grocery List",
      from: {
        name: "Smart Grocery List",
        address: "leonhardwolf@lw-webdev.de",
      },
      htmlContent: interpolatedEmailString,
    });

    // try {
    //   await send({
    //     toAddress: "leonhardwolf96@gmail.com",
    //     subject: "testMail",
    //     textContent: "Some test content",
    //     from: {
    //       name: "Smart Grocery List",
    //       address: "leonhardwolf@lw-webdev.de",
    //     },
    //   });
    // } catch (error) {
    //   console.error(error);
    // }

    this.setStatus(200);
  }
}
