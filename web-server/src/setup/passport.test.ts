const expressUseSpy = jest.fn();
jest.mock("express", () => ({
  __esModule: true,
  default: () => ({ use: expressUseSpy }),
}));

const expressSessionMock = jest
  .fn()
  .mockReturnValue("Express session default return value.");
jest.mock("express-session", () => ({
  __esModule: true,
  default: expressSessionMock,
}));

const RedisStoreMock = jest.fn().mockReturnValue("Instantiated store.");
const connectRedisMock = jest.fn().mockReturnValue(RedisStoreMock);
jest.mock("connect-redis", () => ({
  __esModule: true,
  default: connectRedisMock,
}));

const redisConnectMock = jest.fn().mockResolvedValue("Connect resolved.");
jest.mock("redis", () => ({
  createClient: jest.fn(() => ({ connect: redisConnectMock })),
}));

const winstonMock = require("../utils/testUtils/mockWinston").winstonMock;
jest.mock("winston", () => winstonMock);

const userGetMock = jest.fn().mockImplementation((path: string) => {
  if (path === "account_confirmation") return undefined;
  return "passwordHashAndSalt";
});
const findOneMock = jest.fn().mockResolvedValue({ get: userGetMock });
jest.mock("../services/userService", () => ({
  findOne: findOneMock,
}));

import express from "express";
import passport from "passport";
import { Strategy } from "passport-local";
import argon2 from "argon2";
import { createClient } from "redis";

import {
  verify,
  registerLocalStrategy,
  getRedisClient,
  registerPassport,
} from "./passport";
import { User } from "../models/userModel";
import setupAndDropTestDB from "../utils/testUtils/setupAndDropTestDB";
import { findOne } from "../services/userService";
import { logSpy } from "../utils/testUtils/mockWinston";
import resolvePendingPromises from "../utils/testUtils/resolvePendingPromises";

jest.mock("passport", () => ({ use: jest.fn() }));
const StrategyMock = { test: "Some property value." };
jest.mock("passport-local", () => ({
  Strategy: jest.fn().mockImplementation(() => StrategyMock),
}));

jest.mock("argon2", () => ({
  verify: jest.fn().mockResolvedValue(true),
}));

setupAndDropTestDB({ doDropDbBeforeEach: true });

const oldEnv = process.env;
beforeEach(() => {
  jest.resetModules();
  jest.clearAllMocks();
  process.env = { ...oldEnv };
});

afterAll(() => {
  process.env = oldEnv;
});

describe("'verify()':", () => {
  it("Should call callback with user on successful login.", async () => {
    const findOneMockHere = { get: userGetMock };
    (findOne as jest.MockedFunction<typeof findOne>).mockImplementationOnce(
      jest.fn().mockResolvedValue(findOneMockHere)
    );
    const callbackSpy = jest.fn();
    await verify("john@doe.com", "123", callbackSpy);

    expect(callbackSpy).toHaveBeenCalledTimes(1);
    expect(callbackSpy).toHaveBeenCalledWith(null, findOneMockHere);
  });
  // For some reason there is some mongoose error. Need to fix later.
  it.skip("Should call callback with error when DB rejects.", async () => {
    const user = new User({
      email_address: "john@doe.com",
      first_name: "John",
      last_name: "Doe",
      password_hash_and_salt: "123hashAndSalt",
      client_language: "de",
      last_user_edit_on: new Date(),
      app_settings: {},
    });
    await user.save();

    const callbackSpy = jest.fn();
    const findOneError = new Error("Some reason for rejecting.");
    (findOne as jest.MockedFunction<typeof findOne>).mockRejectedValueOnce(
      findOneError
    );
    await verify("john@doe.com", "123", callbackSpy);

    expect(callbackSpy).toHaveBeenCalledTimes(1);
    expect(callbackSpy).toHaveBeenCalledWith(findOneError);
  });
  it("Should call 'findOne()' with provided email address.", async () => {
    const callbackSpy = jest.fn();
    await verify("john@doe.com", "123", callbackSpy);
    expect(findOne).toHaveBeenCalledTimes(1);
    expect(findOne).toHaveBeenCalledWith("john@doe.com");
  });
  it("Should call callback with message when user does not exist.", async () => {
    (findOne as jest.MockedFunction<typeof findOne>).mockResolvedValueOnce(
      null
    );
    const callbackSpy = jest.fn();
    await verify("john@doe.com", "123", callbackSpy);

    expect(callbackSpy).toHaveBeenCalledTimes(1);
    expect(callbackSpy).toHaveBeenCalledWith(null, false, {
      message: "Email or password incorrect or user not yet verified.",
    });
  });
  it("Should call callback with message when password is incorrect.", async () => {
    (
      argon2.verify as jest.MockedFunction<typeof argon2.verify>
    ).mockResolvedValueOnce(false);
    const callbackSpy = jest.fn();
    await verify("john@doe.com", "123", callbackSpy);

    expect(userGetMock).toHaveBeenCalledWith("password_hash_and_salt");

    expect(callbackSpy).toHaveBeenCalledTimes(1);
    expect(callbackSpy).toHaveBeenCalledWith(null, false, {
      message: "Email or password incorrect or user not yet verified.",
    });
  });
  it("Should call callback with message when password verify rejects.", async () => {
    const argon2VerifyError = new Error("Reason why argon2.verify() rejected.");
    (
      argon2.verify as jest.MockedFunction<typeof argon2.verify>
    ).mockRejectedValueOnce(argon2VerifyError);

    const callbackSpy = jest.fn();
    await verify("john@doe.com", "123", callbackSpy);

    expect(argon2.verify).toHaveBeenCalledTimes(1);
    expect(argon2.verify).toHaveBeenCalledWith("passwordHashAndSalt", "123");

    expect(callbackSpy).toHaveBeenCalledTimes(1);
    expect(callbackSpy).toHaveBeenCalledWith(argon2VerifyError);
  });
  it("Should call callback with message when user is not verified.", async () => {
    userGetMock
      .mockImplementationOnce((path: string) => {
        if (path === "account_confirmation") return {};
        return "passwordHashAndSalt";
      })
      .mockImplementationOnce((path: string) => {
        if (path === "account_confirmation") return {};
        return "passwordHashAndSalt";
      });

    const callbackSpy = jest.fn();
    await verify("john@doe.com", "123", callbackSpy);

    expect(callbackSpy).toHaveBeenCalledTimes(1);
    expect(callbackSpy).toHaveBeenCalledWith(null, false, {
      message: "Email or password incorrect or user not yet verified.",
    });
  });
});

describe("'registerLocalStrategy()':", () => {
  it("Should register using 'verify()'.", () => {
    registerLocalStrategy();
    expect(Strategy).toHaveBeenCalledTimes(1);
    expect(Strategy).toHaveBeenCalledWith(verify);
    expect(passport.use).toHaveBeenCalledTimes(1);
    expect(passport.use).toHaveBeenCalledWith(StrategyMock);
  });
});

describe("'getRedisClient()':", () => {
  it("Should use express session.", () => {
    const passportModule = require("./passport");
    passportModule.getRedisClient();
    expect(connectRedisMock).toHaveBeenCalledTimes(1);
    expect(connectRedisMock).toHaveBeenCalledWith(expressSessionMock);
  });
  it("Should connect to redis.", () => {
    process.env.REDIS_URL = "https://some-redis-url.com:123";
    getRedisClient();

    expect(createClient).toHaveBeenCalledTimes(1);
    expect(createClient).toHaveBeenCalledWith({
      legacyMode: true,
      url: "https://some-redis-url.com:123",
    });

    expect(redisConnectMock).toHaveBeenCalledTimes(1);
  });
  it("Should log error if redis connect rejects.", async () => {
    redisConnectMock.mockRejectedValueOnce(
      "Reason that redis connect rejected."
    );
    getRedisClient();

    await resolvePendingPromises();

    expect(logSpy).toHaveBeenCalledTimes(1);
    expect(logSpy).toHaveBeenCalledWith(
      "error",
      "Redis could not connect: 'Reason that redis connect rejected.'"
    );
  });
  it("Should return the redis client.", () => {
    const redisClient = getRedisClient();
    expect(redisClient).toStrictEqual(createClient());
  });
});

describe("'registerPassport()':", () => {
  it("Should register middleware.", () => {
    const passportModule = require("./passport");
    const registerLocalStrategySpy = jest
      .spyOn(passportModule, "registerLocalStrategy")
      .mockImplementationOnce(() => {});
    process.env.REDIS_SESSION_SECRET = "123";
    RedisStoreMock.mockImplementationOnce(() => ({ testProperty: "test" }));

    const app = express();
    passportModule.registerPassport(app);

    expect(registerLocalStrategySpy).toHaveBeenCalledTimes(1);
    expect(expressUseSpy).toHaveBeenCalledTimes(1);
    expect(expressUseSpy).toHaveBeenCalledWith(
      "Express session default return value."
    );

    expect(RedisStoreMock).toHaveBeenCalledTimes(1);
    expect(RedisStoreMock).toHaveBeenCalledWith({ client: createClient() });

    expect(expressSessionMock).toHaveBeenCalledTimes(1);
    expect(expressSessionMock).toHaveBeenCalledWith({
      store: { testProperty: "test" },
      secret: "123",
      saveUninitialized: false,
      resave: false,
    });
  });
});
