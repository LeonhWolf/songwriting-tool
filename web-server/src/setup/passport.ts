import { Express, Request, Response } from "express";
import mongoose from "mongoose";
import passport from "passport";
import { Strategy as LocalStrategy, VerifyFunction } from "passport-local";
import argon2 from "argon2";
import expressSession from "express-session";
import { createClient } from "redis";
import connectRedis from "connect-redis";

import { findOne } from "../services/userService";
import { logger } from "../utils/logger";

// Declaration Merging - 'passport.serialize()' uses type 'Express.User'
declare global {
  namespace Express {
    interface User {
      _id: mongoose.Types.ObjectId;
    }
  }
}

const genericErrorMessage =
  "Email or password incorrect or user not yet verified.";

const RedisStore = connectRedis(expressSession);

export const verify: VerifyFunction = async (
  emailAddress: string,
  plainPassword: string,
  callback: Parameters<VerifyFunction>[2]
): Promise<void> => {
  try {
    const user = await findOne("emailAddress", emailAddress);
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
  passport.use(new LocalStrategy({ usernameField: "email_address" }, verify));
};

export const registerSerializeAndDeserialize = () => {
  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser((id, done) => {
    if (typeof id !== "string") return;
    findOne("id", new mongoose.Types.ObjectId(id)).then((userDocument) => {
      done(null, userDocument);
    });
  });
};

export const getRedisClient = (): ReturnType<typeof createClient> => {
  const redisClient = createClient({
    legacyMode: true,
    url: process.env.REDIS_URL,
  });
  redisClient
    .connect()
    .then(() => {
      logger.log("info", "Redis successfully connected.");
    })
    .catch((error) => {
      logger.log("error", `Redis could not connect: '${error}'`);
    });

  return redisClient;
};

const configureExpressSession = (app: Express): void => {
  const redisClient = getRedisClient();
  app.use(
    expressSession({
      store: new RedisStore({ client: redisClient }),
      saveUninitialized: false,
      resave: false,
      secret: process.env.REDIS_SESSION_SECRET ?? "",
      cookie: {
        maxAge: 7 * 24 * 60 * 60 * 1000,
      },
    })
  );
};

const registerAuthenticateMiddleware = (app: Express): void => {
  app.post(
    "/api/login",
    passport.authenticate("local", { failureRedirect: "/register" }),
    (req: Request, res: Response) => {
      res.redirect("/");
    }
  );
};

const setupPassport = (app: Express): void => {
  registerLocalStrategy();
  registerSerializeAndDeserialize();
  passport.initialize();
  passport.session();
  registerAuthenticateMiddleware(app);
};

export const registerPassport = (app: Express): void => {
  configureExpressSession(app);
  setupPassport(app);
};
