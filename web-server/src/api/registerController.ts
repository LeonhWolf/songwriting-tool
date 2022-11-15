import { Body, Controller, Post, Route, SuccessResponse } from "tsoa";

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
  public async createUser(@Body() requestBody: any): Promise<void> {
    this.setStatus(200);
    return;
  }
}
