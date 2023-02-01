let findOneGetMockHashAndSalt = "Password hash and salt.";
let findOneGetAccountConfirmation: undefined | object = undefined;

const findOneGetMock = jest.fn((path: string) => {
  if (path === "password_hash_and_salt") return findOneGetMockHashAndSalt;
  if (path === "account_confirmation") return findOneGetAccountConfirmation;
  return "";
});
jest.mock("./userService.ts", () => ({
  findOne: jest.fn().mockResolvedValue({ get: findOneGetMock }),
}));

const expressSessionMock = jest
  .fn()
  .mockReturnValue("Express session return value.");
jest.mock("express-session", () => ({
  __esModule: true,
  default: expressSessionMock,
}));

const redisStoreMock = jest.fn(() => ({ mockClassProperty: "value" }));
const connectRedisMock = jest.fn().mockReturnValue(redisStoreMock);
jest.mock("connect-redis", () => ({
  __esModule: true,
  default: connectRedisMock,
}));

import { Express } from "express";
import argon2 from "argon2";
import expressSession from "express-session";
import connectRedis from "connect-redis";

import { findOne } from "./userService";
import { registerSession, verifyCredentials } from "./authorizationService";
import { client as redisClient } from "../setup/handleRedisConnection";

jest.mock("argon2", () => ({
  verify: jest.fn().mockResolvedValue(true),
}));

const oldEnv = process.env;
beforeEach(() => {
  jest.clearAllMocks();
  findOneGetMockHashAndSalt = "Password hash and salt.";
  findOneGetAccountConfirmation = undefined;
  process.env = { ...oldEnv };
});

afterAll(() => {
  process.env = oldEnv;
});

describe("registerSession()':", () => {
  it("Should register with proper options.", () => {
    process.env.REDIS_SESSION_SECRET = "123Secret";
    const appUseMock = jest.fn();
    const appMock = { use: appUseMock } as unknown as Express;
    registerSession(appMock);

    expect(connectRedisMock).toHaveBeenCalledTimes(1);
    expect(connectRedisMock).toHaveBeenCalledWith(expressSessionMock);
    expect(redisStoreMock).toHaveBeenCalledTimes(1);
    expect(redisStoreMock).toHaveBeenCalledWith({ client: redisClient });

    expect(expressSession).toHaveBeenCalledTimes(1);
    expect(expressSession).toHaveBeenCalledWith({
      store: { mockClassProperty: "value" },
      saveUninitialized: false,
      resave: false,
      secret: "123Secret",
      cookie: {
        // 7 days in milliseconds
        maxAge: 7 * 24 * 60 * 60 * 1000,
      },
    });

    expect(appUseMock).toHaveBeenCalledTimes(1);
    expect(appUseMock).toHaveBeenCalledWith("Express session return value.");
  });
});

describe.only("'verifyCredentials()':", () => {
  it("Should return the user document if correct.", async () => {
    const result = await verifyCredentials("john@doe.com", "123");
    expect(result).toStrictEqual({ get: findOneGetMock });
  });
  it("Should call 'findOne()' with provided email address.", async () => {
    await verifyCredentials("john@doe.com", "123");
    expect(findOne).toHaveBeenCalledTimes(1);
    expect(findOne).toHaveBeenCalledWith("emailAddress", "john@doe.com");
  });
  it("Should reject when user does not exist.", async () => {
    (findOne as jest.MockedFunction<typeof findOne>).mockResolvedValueOnce(
      null
    );
    await expect(verifyCredentials("john@doe.com", "123")).rejects.toThrow(
      "User with email 'john@doe.com' does not exist."
    );
  });
  it("Should return 'null' when password is incorrect.", async () => {
    (
      argon2.verify as jest.MockedFunction<typeof argon2.verify>
    ).mockResolvedValueOnce(false);
    const result = await verifyCredentials("john@doe.com", "123");

    expect(findOneGetMock).toHaveBeenCalledWith("password_hash_and_salt");
    expect(argon2.verify).toHaveBeenCalledTimes(1);
    expect(argon2.verify).toHaveBeenCalledWith(
      "Password hash and salt.",
      "123"
    );

    expect(result).toBe(null);
  });
  it("Should reject when user is not verified.", async () => {
    findOneGetAccountConfirmation = {
      someProperty: "",
    };
    await expect(verifyCredentials("john@doe.com", "123")).rejects.toThrow(
      "The registration of user 'john@doe.com' is not yet verified."
    );
  });
  describe("Handle rejects:", () => {
    it("Should reject when DB rejects.", async () => {
      (findOne as jest.MockedFunction<typeof findOne>).mockRejectedValueOnce(
        new Error("findOne rejected.")
      );

      await expect(verifyCredentials("john@doe.com", "123")).rejects.toThrow(
        "findOne rejected."
      );
    });
    it("Should reject when password verify rejects.", async () => {
      (
        argon2.verify as jest.MockedFunction<typeof argon2.verify>
      ).mockRejectedValueOnce(new Error("argon2.verify rejected."));

      await expect(verifyCredentials("john@doe.com", "123")).rejects.toThrow(
        "argon2.verify rejected."
      );
    });
  });
});

// describe("'login()':", () => {
//   describe("User is not logged in:", () => {
//     // maxAge, etc.
//     it.todo("Should set session cookie.");
//     // add timeout of 7 days
//     it.todo("Should add session key.");
//   });
//   describe("Wrong credentials:", () => {
//     it.todo("Should log 'warn' with user id.");
//   });
//   describe("User already logged in:", () => {
//     it.todo("Should call 'checkLogin()'.");
//   });
// });
// describe("'configure()':", () => {
//   it.todo("Should set public and secure routes.");
// });
// describe("'checkLogin()':", () => {
//   describe("Login is valid`:", () => {
//     it.todo("Should reset key timeout.");
//   });
//   describe("Login is invalid:", () => {});
// });
// describe("'logout()':", () => {
//   it.todo("Should delete session key.");
//   it.todo("Should remove session cookie.");
// });
