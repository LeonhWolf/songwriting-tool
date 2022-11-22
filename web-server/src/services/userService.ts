import argon2 from "argon2";

import { IUser, User } from "../models/userModel";

export interface INewUser
  extends Pick<IUser, "email_address" | "first_name" | "last_name"> {
  plainPassword: string;
  client_language: IUser["app_settings"]["app_language"];
}

function addDaysToDate(date: Date, numberOfDays: number): void {
  date.setDate(date.getDate() + numberOfDays);
}

export async function create(newUser: INewUser) {
  const usersWithEmail = await User.aggregate([
    { $match: { email_address: newUser.email_address } },
  ]);
  const isEmailAlreadyTaken = usersWithEmail.length > 0;
  if (isEmailAlreadyTaken)
    throw new Error(
      `User with email '${newUser.email_address}' already exists.`
    );

  const hash_and_salt = await argon2.hash(newUser.plainPassword, {
    parallelism: 1,
    timeCost: 2,
  });
  const now = new Date();
  const accountConfirmationExpiresOn = new Date(now);
  addDaysToDate(accountConfirmationExpiresOn, 14);

  const user = new User<IUser>({
    email_address: newUser.email_address,
    first_name: newUser.first_name,
    last_name: newUser.last_name,
    password_hash_and_salt: hash_and_salt,
    app_settings: {
      app_language: newUser.client_language,
    },
    account_confirmation: {
      expires_on: accountConfirmationExpiresOn,
    },
    last_user_edit_on: now,
  });
  await user.save();
}
