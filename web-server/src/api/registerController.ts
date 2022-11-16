import { Body, Controller, Post, Route, SuccessResponse } from "tsoa";

import { send } from "../services/mailService";

interface IRequest {
  testId: number;
  message: string;
}

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
  public async createUser(@Body() requestBody: IRequest): Promise<void> {
    try {
      await send({
        toAddress: "leonhardwolf96@gmail.com",
        subject: "testMail",
        textContent: "Some test content",
        from: "test",
      });
    } catch (error) {
      console.error(error);
    }

    this.setStatus(200);
    console.log(requestBody.message);
    console.log(requestBody.testId);
    return;
  }
}
