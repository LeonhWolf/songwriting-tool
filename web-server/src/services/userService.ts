import mongoose from "mongoose";
import argon2 from "argon2";

import { IUser, User } from "../models/userModel";
import { addDaysToDate } from "../utils/dateUtils";
import { INewUser } from "../../../api-types/authentication.types";

export type UserDocument = mongoose.Document<unknown, any, IUser> &
  IUser & { _id: mongoose.Types.ObjectId };

export function getEmailTakenErrorMessage(emailAddress: string): string {
  return `User with email '${emailAddress}' already exists.`;
}
export async function create(newUser: INewUser): Promise<UserDocument> {
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

interface IFindOneParameters {
  id: mongoose.Types.ObjectId;
  emailAddress: string;
}

export async function findOne<
  QueryType extends keyof IFindOneParameters,
  Query extends IFindOneParameters[QueryType]
>(queryType: QueryType, query: Query): Promise<UserDocument | null> {
  if (queryType === "emailAddress") {
    const users = await User.find({ email_address: query });
    if (users.length > 1)
      throw new Error(
        `User with email address '${query}' exists multiple times.`
      );
    if (users.length === 0) return null;

    const user = users[0];
    return user;
  }

  if (queryType === "id") {
    const users = await User.find({ _id: query });

    if (users.length === 0) return null;

    const user = users[0];
    return user;
  }

  return null;
}

export async function findAll(
  query: "isAccountConfirmationExpired" | "id",
  ids?: mongoose.Types.ObjectId[]
): Promise<UserDocument[]> {
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
  await User.deleteMany({
    $or: userIds?.map((userId) => ({ _id: userId })),
  });
}

export async function tryConfirmation(
  confirmationId: mongoose.Types.ObjectId
): Promise<UserDocument> {
  const oldUser = await User.findOne({
    "account_confirmation._id": confirmationId,
  });
  if (oldUser === null)
    throw Error("User with confirmation id does not exist.");
  const userId = oldUser.get("_id") as mongoose.Types.ObjectId | undefined;

  const response = await User.updateOne(
    { "account_confirmation._id": confirmationId },
    { $unset: { account_confirmation: "" } }
  );
  const updatedUser = await User.findOne({ _id: userId });

  if (response.matchedCount === 0 || updatedUser === null)
    throw new Error("User with confirmation id does not exist.");

  return updatedUser;
}
