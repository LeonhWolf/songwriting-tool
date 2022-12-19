import { IUser } from "../web-server/src/models/userModel";

export interface INewUser
  extends Pick<IUser, "email_address" | "first_name" | "last_name"> {
  plainPassword: string;
  client_language: IUser["app_settings"]["app_language"];
}
export interface IConfirmRegistration {
  confirmation_id: string;
}
