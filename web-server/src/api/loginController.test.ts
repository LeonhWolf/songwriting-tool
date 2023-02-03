const mockUserId = "mockUserId";
const userDocumentMock = {
  get: jest.fn().mockReturnValue(mockUserId),
};
jest.mock("../services/authorizationService.ts", () => ({
  verifyCredentials: jest.fn().mockResolvedValue(userDocumentMock),
  loginUserAndRedirect: jest.fn().mockResolvedValue(""),
}));

jest.mock("../utils/logger.ts", () => ({
  logger: { log: jest.fn() },
}));

import { LoginController } from "./loginController";
import { ILogin } from "../../../api-types/authentication.types";
import { logger } from "../utils/logger";
import {
  verifyCredentials,
  loginUserAndRedirect,
} from "../services/authorizationService";

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
  jest.clearAllMocks();
  requestMock.session.user = null;
});

const correctLoginData: ILogin = {
  email_address: "john@doe.com",
  password: "123",
};

describe("Success:", () => {
  it("Should send a message.", async () => {
    const loginController = new LoginController();

    const message = await loginController.logInUser(
      correctLoginData,
      //@ts-ignore
      requestMock
    );
    expect(message).toBe("User is logged in.");
  });
  it("Should call 'loginUserAndRedirect()'.", async () => {
    const loginController = new LoginController();
    //@ts-ignore
    await loginController.logInUser(correctLoginData, requestMock);

    expect(loginUserAndRedirect).toHaveBeenCalledTimes(1);
    expect(loginUserAndRedirect).toHaveBeenCalledWith(requestMock, mockUserId);
  });
  it("Should not log anything.", async () => {
    const loginController = new LoginController();
    //@ts-ignore
    await loginController.logInUser(correctLoginData, requestMock);

    expect(logger.log).toHaveBeenCalledTimes(0);
  });
});

describe("Server Failure:", () => {
  describe("'loginUserAndRedirect()' rejects:", () => {
    it("Should send '500' and message.", async () => {
      const loginController = new LoginController();
      jest.spyOn(loginController, "setStatus");
      (
        loginUserAndRedirect as jest.MockedFunction<typeof loginUserAndRedirect>
      ).mockRejectedValueOnce(new Error("'regenerate()' rejected."));

      const message = await loginController.logInUser(
        correctLoginData,
        //@ts-ignore
        requestMock
      );

      expect(loginController.setStatus).toHaveBeenCalledTimes(1);
      expect(loginController.setStatus).toHaveBeenCalledWith(500);
      expect(message).toBe("There was an internal server error.");
    });
    it("Should log 'error' with email address.", async () => {
      const loginController = new LoginController();
      jest.spyOn(loginController, "setStatus");
      (
        loginUserAndRedirect as jest.MockedFunction<typeof loginUserAndRedirect>
      ).mockRejectedValueOnce(new Error("'regenerate()' rejected."));

      const message = await loginController.logInUser(
        correctLoginData,
        //@ts-ignore
        requestMock
      );

      expect(logger.log).toHaveBeenCalledTimes(1);
      expect(logger.log).toHaveBeenCalledWith(
        "error",
        `User with email address: '${correctLoginData.email_address}' could not be logged in: Error: 'regenerate()' rejected.`
      );
    });
  });

  describe("'verifyCredentials()' rejects:", () => {
    it("Should send '500' and message.", async () => {
      const loginController = new LoginController();
      jest.spyOn(loginController, "setStatus");
      (
        verifyCredentials as jest.MockedFunction<typeof verifyCredentials>
      ).mockRejectedValueOnce(new Error("'verifyCredentials()' rejected."));

      const message = await loginController.logInUser(
        correctLoginData,
        //@ts-ignore
        requestMock
      );

      expect(loginController.setStatus).toHaveBeenCalledTimes(1);
      expect(loginController.setStatus).toHaveBeenCalledWith(500);
      expect(message).toBe("There was an internal server error.");
    });
    it("Should log 'error' with email address.", async () => {
      const loginController = new LoginController();
      (
        verifyCredentials as jest.MockedFunction<typeof verifyCredentials>
      ).mockRejectedValueOnce(new Error("'verifyCredentials()' rejected."));

      await loginController.logInUser(
        correctLoginData,
        //@ts-ignore
        requestMock
      );

      expect(logger.log).toHaveBeenCalledTimes(1);
      expect(logger.log).toHaveBeenCalledWith(
        "error",
        `User with email address: '${correctLoginData.email_address}' could not be logged in: Error: 'verifyCredentials()' rejected.`
      );
    });
  });
});

describe("Wrong Credentials:", () => {
  it("Should send a '400'.", async () => {
    const loginController = new LoginController();
    jest.spyOn(loginController, "setStatus");
    (
      verifyCredentials as jest.MockedFunction<typeof verifyCredentials>
    ).mockResolvedValueOnce(null);

    const message = await loginController.logInUser(
      correctLoginData,
      //@ts-ignore
      requestMock
    );

    expect(loginController.setStatus).toHaveBeenCalledTimes(1);
    expect(loginController.setStatus).toHaveBeenCalledWith(400);
    expect(message).toBe("The credentials provided don't match any user.");
  });
  it("Should log 'warn' with email address.", async () => {
    const loginController = new LoginController();
    (
      verifyCredentials as jest.MockedFunction<typeof verifyCredentials>
    ).mockResolvedValueOnce(null);

    await loginController.logInUser(
      correctLoginData,
      //@ts-ignore
      requestMock
    );

    expect(logger.log).toHaveBeenCalledTimes(1);
    expect(logger.log).toHaveBeenCalledWith(
      "warn",
      `User with email address: '${correctLoginData.email_address}' could not be logged in: Wrong credentials were used.`
    );
  });
});
