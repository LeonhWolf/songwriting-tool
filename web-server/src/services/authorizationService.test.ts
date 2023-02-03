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

import { findOne } from "./userService";
import {
  registerSession,
  verifyCredentials,
  loginUserAndRedirect,
} from "./authorizationService";
import { client as redisClient } from "../setup/handleRedisConnection";
import resolvePendingPromises from "../utils/testUtils/resolvePendingPromises";

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

describe("'verifyCredentials()':", () => {
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

describe("'loginUserAndRedirect()'", () => {
  const requestMock = {
    session: {
      regenerate: jest.fn((callback) => {
        callback();
      }),
      save: jest.fn((callback) => {
        callback();
      }),
      user: null,
    },
    res: {
      redirect: jest.fn(),
    },
  };

  beforeEach(() => {
    requestMock.session.user = null;
  });
  describe("Success:", () => {
    it("Should call 'session.regenerate()'.", async () => {
      //@ts-ignore
      await loginUserAndRedirect(requestMock, "123");
      expect(requestMock.session.regenerate).toHaveBeenCalledTimes(1);
      expect(requestMock.session.regenerate).toHaveBeenCalledWith(
        expect.any(Function)
      );
    });
    it("Should set 'user' and call 'session.save()'.", async () => {
      //@ts-ignore
      await loginUserAndRedirect(requestMock, "123");
      expect(requestMock.session.user).toStrictEqual({ userId: "123" });
      expect(requestMock.session.save).toHaveBeenCalledTimes(1);
      expect(requestMock.session.save).toHaveBeenCalledWith(
        expect.any(Function)
      );
    });
    it("Should redirect to '/'.", async () => {
      //@ts-ignore
      await loginUserAndRedirect(requestMock, "123");
      expect(requestMock.res.redirect).toHaveBeenCalledTimes(1);
      expect(requestMock.res.redirect).toHaveBeenCalledWith("/");
    });
    it("Should not resolve when 'session.save()' callback is not called.", async () => {
      requestMock.session.save.mockImplementationOnce(() => {});
      let hasPromiseResolved = false;
      //@ts-ignore
      loginUserAndRedirect(requestMock, "123").then(() => {
        hasPromiseResolved = true;
      });

      await resolvePendingPromises();
      expect(hasPromiseResolved).toBe(false);

      const sessionSaveCallback = requestMock.session.save.mock.calls[0][0];
      sessionSaveCallback();
      expect(hasPromiseResolved).toBe(false);
    });
  });
  describe("Failure:", () => {
    describe("'session.regenerate()' errors:", () => {
      it("Should throw.", async () => {
        requestMock.session.regenerate.mockImplementationOnce((callback) => {
          callback(new Error("'regenerate()' rejected."));
        });
        //@ts-ignore
        await expect(loginUserAndRedirect(requestMock, "123")).rejects.toThrow(
          "'regenerate()' rejected."
        );
      });
      it("Should not set user.", async () => {
        requestMock.session.regenerate.mockImplementationOnce((callback) => {
          callback(new Error("'regenerate()' rejected."));
        });
        //@ts-ignore
        await expect(loginUserAndRedirect(requestMock, "123")).rejects.toThrow(
          "'regenerate()' rejected."
        );
        expect(requestMock.session.user).toBeNull();
      });
      it("Should not call 'session.save()'.", async () => {
        requestMock.session.regenerate.mockImplementationOnce((callback) => {
          callback(new Error("'regenerate()' rejected."));
        });
        //@ts-ignore
        await expect(loginUserAndRedirect(requestMock, "123")).rejects.toThrow(
          "'regenerate()' rejected."
        );
        expect(requestMock.session.save).toHaveBeenCalledTimes(0);
      });
    });
    describe("'session.save()' errors:", () => {
      it("Should throw.", async () => {
        requestMock.session.save.mockImplementationOnce((callback) => {
          callback(new Error("'save()' rejected."));
        });
        //@ts-ignore
        await expect(loginUserAndRedirect(requestMock, "123")).rejects.toThrow(
          "'save()' rejected."
        );
      });
      it("Should not redirect.", async () => {
        requestMock.session.save.mockImplementationOnce((callback) => {
          callback(new Error("'save()' rejected."));
        });
        //@ts-ignore
        await expect(loginUserAndRedirect(requestMock, "123")).rejects.toThrow(
          "'save()' rejected."
        );
        expect(requestMock.res.redirect).toHaveBeenCalledTimes(0);
      });
    });
  });
});
