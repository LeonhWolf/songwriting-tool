import {
  Express,
  Request as ExpressRequest,
  Response as ExpressResponse,
} from "express";
import expressSession from "express-session";
import connectRedis from "connect-redis";
import argon2 from "argon2";

import { findOne, UserDocument } from "./userService";
import { client as redisClient } from "../setup/handleRedisConnection";

export const registerSession = (app: Express): void => {
  const RedisStore = connectRedis(expressSession);
  const sevenDaysInMilliseconds = 7 * 24 * 60 * 60 * 1000;

  app.use(
    expressSession({
      store: new RedisStore({ client: redisClient }),
      saveUninitialized: false,
      resave: false,
      secret: process.env.REDIS_SESSION_SECRET ?? "",
      cookie: {
        maxAge: sevenDaysInMilliseconds,
      },
    })
  );
};

export const verifyCredentials = async (
  emailAddress: string,
  plainPassword: string
): Promise<UserDocument | null> => {
  const user = await findOne("emailAddress", emailAddress);
  if (!user)
    throw new Error(`User with email '${emailAddress}' does not exist.`);

  const isUserVerified = !!!user?.get("account_confirmation");
  if (!isUserVerified)
    throw new Error(
      `The registration of user '${emailAddress}' is not yet verified.`
    );

  const passwordHashAndSalt = user?.get("password_hash_and_salt");
  const isPasswordCorrect = await argon2.verify(
    passwordHashAndSalt,
    plainPassword
  );
  if (!isPasswordCorrect) return null;

  return user;
};

export const loginUserAndRedirect = async (
  request: ExpressRequest,
  userId: any
): Promise<void> => {
  await new Promise<void>((resolve, reject) => {
    request.session.regenerate((error) => {
      if (error) return reject(error);

      request.session.user = { userId };

      request.session.save((error) => {
        if (error) return reject(error);

        const response = (<any>request).res as ExpressResponse;
        response.redirect("/");
        resolve();
      });
    });
  });
};
