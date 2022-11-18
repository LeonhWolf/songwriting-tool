import mongoose, { Schema } from "mongoose";

interface IPassword {
  hash: string;
  salt: string;
}
const passwordSchema = new Schema<IPassword>({
  hash: String,
  salt: String,
});

interface IAppSettings {
  app_language: string;
  ui_theme: string;
}
const appSettingsSchema = new Schema<IAppSettings>({
  app_language: String,
  ui_theme: String,
});

interface ILocalSession {
  expires_on: Date;
}
const localSessionSchema = new Schema<ILocalSession>({
  expires_on: Date,
});

interface IAccountConfirmation {
  expires_on: Date;
}
const accountConfirmationSchema = new Schema<IAccountConfirmation>({
  expires_on: Date,
});

interface IResetPassword {
  expires_on: Date;
}
const resetPasswordSchema = new Schema<IResetPassword>({
  expires_on: Date,
});

interface IOldEmail {
  old_email_address: string;
  expires_on: Date;
}
const oldEmailSchema = new Schema<IOldEmail>({
  old_email_address: String,
  expires_on: Date,
});

interface IAccountDeleted {
  hard_delete_on: Date;
}
const accountDeletedSchema = new Schema<IAccountDeleted>({
  hard_delete_on: Date,
});

export interface IUser {
  email_address: string;
  first_name: string;
  last_name: string;
  password: IPassword;
  app_settings: IAppSettings;
  local_sessions?: ILocalSession[];
  account_confirmation?: IAccountConfirmation;
  reset_password?: IResetPassword;
  old_email?: IOldEmail;
  account_deleted?: IAccountDeleted;
  last_user_edit_on: Date;
}
const userSchema = new Schema<IUser>({
  email_address: {
    type: String,
    required: true,
  },
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
  },
  password: {
    type: passwordSchema,
    required: true,
  },
  app_settings: {
    type: appSettingsSchema,
    required: true,
  },
  local_sessions: [localSessionSchema],
  account_confirmation: accountConfirmationSchema,
  reset_password: resetPasswordSchema,
  old_email: oldEmailSchema,
  account_deleted: accountDeletedSchema,
  last_user_edit_on: {
    type: Date,
    required: true,
  },
});

export const User = mongoose.model<IUser>("User", userSchema);
