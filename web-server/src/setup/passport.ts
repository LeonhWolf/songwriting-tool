import { Express } from "express";
import passport from "passport";
import { Strategy as LocalStrategy, VerifyFunction } from "passport-local";
import argon2 from "argon2";
import expressSession from "express-session";
import { createClient } from "redis";
import connectRedis from "connect-redis";

import { findOne } from "../services/userService";
import { logger } from "../utils/logger";

const genericErrorMessage =
  "Email or password incorrect or user not yet verified.";

const RedisStore = connectRedis(expressSession);

export const verify: VerifyFunction = async (
  emailAddress: string,
  plainPassword: string,
  callback: Parameters<VerifyFunction>[2]
): Promise<void> => {
  try {
    const user = await findOne(emailAddress);
    if (user === null) {
      callback(null, false, { message: genericErrorMessage });
      return;
    }

    const passwordHashAndSalt = user.get("password_hash_and_salt");
    const isUserVerified = !!!user.get("account_confirmation");
    const isProperPassword = await argon2.verify(
      passwordHashAndSalt,
      plainPassword
    );

    if (!isProperPassword || !isUserVerified) {
      callback(null, false, {
        message: genericErrorMessage,
      });
      return;
    }

    callback(null, user);
  } catch (error) {
    callback(error);
  }
};

export const registerLocalStrategy = (): void => {
  passport.use(new LocalStrategy(verify));
};

export const getRedisClient = (): ReturnType<typeof createClient> => {
  const redisClient = createClient({
    legacyMode: true,
    url: process.env.REDIS_URL,
  });
  redisClient.connect().catch((error) => {
    logger.log("error", `Redis could not connect: '${error}'`);
  });

  return redisClient;
};

export const registerPassport = (app: Express): void => {
  registerLocalStrategy();
  const redisClient = getRedisClient();

  app.use(
    expressSession({
      store: new RedisStore({ client: redisClient }),
      saveUninitialized: false,
      resave: false,
      secret: process.env.REDIS_SESSION_SECRET ?? "",
    })
  );
};
