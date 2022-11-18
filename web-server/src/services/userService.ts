import { IUser, User } from "../models/userModel";

interface INewUser
  extends Pick<IUser, "email_address" | "first_name" | "last_name"> {
  plainPassword: string;
  client_language: IUser["app_settings"]["app_language"];
}

export async function create(newUser: INewUser) {
  const user = new User<IUser>({
    email_address: "john@doe.com",
    first_name: "John",
    last_name: "Doe",
    password: {
      hash: "hash",
      salt: "salt",
    },
    app_settings: {
      app_language: "en",
      ui_theme: "light",
    },
    last_user_edit_on: new Date(),
  });
  await user.save();
}
