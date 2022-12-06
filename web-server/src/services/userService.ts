import mongoose from "mongoose";
import argon2 from "argon2";

import { IUser, User } from "../models/userModel";
import { addDaysToDate } from "../utils/dateUtils";
import { INewUser } from "../../../api-types/authentication.types";

export function getEmailTakenErrorMessage(emailAddress: string): string {
  return `User with email '${emailAddress}' already exists.`;
}
export async function create(
  newUser: INewUser
): Promise<
  mongoose.Document<unknown, any, IUser> &
    IUser & { _id: mongoose.Types.ObjectId }
> {
  const usersWithEmail = await User.aggregate([
    { $match: { email_address: newUser.email_address } },
  ]);
  const isEmailAlreadyTaken = usersWithEmail.length > 0;
  if (isEmailAlreadyTaken)
    throw new Error(getEmailTakenErrorMessage(newUser.email_address));

  const hash_and_salt = await argon2.hash(newUser.plainPassword, {
    parallelism: 1,
    timeCost: 2,
  });
  const now = new Date();
  const accountConfirmationExpiresOn = addDaysToDate(now, 14);

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
  const createdUser = await user.save();
  return createdUser;
}

export async function findAll(
  query: "isAccountConfirmationExpired" | "id",
  ids?: mongoose.Types.ObjectId[]
): Promise<
  (mongoose.Document<unknown, any, IUser> &
    IUser & { _id: mongoose.Types.ObjectId })[]
> {
  if (query === "isAccountConfirmationExpired") {
    const now = new Date();
    const users = User.find({
      "account_confirmation.expires_on": { $lt: now },
    });
    return users;
  }

  const users = User.find({
    $or: ids?.map((id) => ({ _id: id })),
  });
  return users;
}

export async function deleteOne(
  userId: mongoose.Types.ObjectId
): Promise<void> {
  const response = await User.deleteOne({ _id: userId });
  if (response.deletedCount === 0)
    throw new Error(
      `User cannot be deleted because there is no user with id '${userId.toString()}'.`
    );
}

export async function deleteMany(
  userIds: mongoose.Types.ObjectId[]
): Promise<void> {
  const response = await User.deleteMany({
    $or: userIds?.map((userId) => ({ _id: userId })),
  });
}
