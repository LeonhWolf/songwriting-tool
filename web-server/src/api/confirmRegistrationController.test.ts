const winstonMock = require("../utils/testUtils/mockWinston").winstonMock;
jest.mock("winston", () => winstonMock);

const mockUserId = "a3a02e27bea012d8cad1583a";
jest.mock("../services/userService", () => ({
  tryConfirmation: jest.fn().mockResolvedValue({
    _id: new mongoose.Types.ObjectId(mockUserId),
  }),
}));

import mongoose from "mongoose";

import { tryConfirmation } from "../services/userService";
import { IConfirmRegistration } from "../../../api-types/authentication.types";
import { ConfirmRegistrationController } from "./confirmRegistrationController";
import { loginUserAndRedirect } from "../services/authorizationService";
import { logSpy } from "../utils/testUtils/mockWinston";

jest.mock("../services/authorizationService", () => ({
  loginUserAndRedirect: jest.fn().mockResolvedValue(""),
}));

beforeEach(() => {
  jest.clearAllMocks();
});

const requestBody: IConfirmRegistration = {
  confirmation_id: "63a02e27bea012d8cad1583f",
};
const mockRequest = {
  res: {
    redirect: jest.fn(),
  },
};

describe("Success:", () => {
  it("Should try to confirm registration id.", async () => {
    const confirmRegistrationController = new ConfirmRegistrationController();
    await confirmRegistrationController.confirmRegistration(
      requestBody,
      //@ts-ignore
      mockRequest
    );

    expect(tryConfirmation).toHaveBeenCalledTimes(1);
    expect(tryConfirmation).toHaveBeenCalledWith(
      new mongoose.Types.ObjectId("63a02e27bea012d8cad1583f")
    );
  });
  it("Should send a '200' & message on success.", async () => {
    const confirmRegistrationController = new ConfirmRegistrationController();
    const setStatusSpy = jest.spyOn(confirmRegistrationController, "setStatus");
    const message = await confirmRegistrationController.confirmRegistration(
      requestBody,
      //@ts-ignore
      mockRequest
    );

    expect(setStatusSpy).toHaveBeenCalledTimes(0);
    expect(message).toBe("User registration has been successfully confirmed.");
  });
  it("Should log 'info' if account confirmed.", async () => {
    const confirmRegistrationController = new ConfirmRegistrationController();
    //@ts-ignore
    await confirmRegistrationController.confirmRegistration(
      requestBody,
      //@ts-ignore
      mockRequest
    );
    expect(logSpy).toHaveBeenCalledWith(
      "info",
      "Registration for account with id 'a3a02e27bea012d8cad1583a' has been confirmed."
    );
  });
});

describe("Automatically log in when confirmed:", () => {
  it("Should log in when confirmed.", async () => {
    const confirmRegistrationController = new ConfirmRegistrationController();
    await confirmRegistrationController.confirmRegistration(
      requestBody,
      //@ts-ignore
      mockRequest
    );

    expect(loginUserAndRedirect).toHaveBeenCalledTimes(1);
    expect(loginUserAndRedirect).toHaveBeenCalledWith(mockRequest, mockUserId);
  });
  it("Should redirect to '/login' if login rejects.", async () => {
    const confirmRegistrationController = new ConfirmRegistrationController();

    (
      loginUserAndRedirect as jest.MockedFunction<typeof loginUserAndRedirect>
    ).mockRejectedValueOnce("'loginUserAndRedirect()' rejected.");

    await confirmRegistrationController.confirmRegistration(
      requestBody,
      //@ts-ignore
      mockRequest
    );

    expect(mockRequest.res.redirect).toHaveBeenCalledTimes(1);
    expect(mockRequest.res.redirect).toHaveBeenCalledWith("/login");
  });
  it("Should log 'warn' if login rejects.", async () => {
    const confirmRegistrationController = new ConfirmRegistrationController();

    (
      loginUserAndRedirect as jest.MockedFunction<typeof loginUserAndRedirect>
    ).mockRejectedValueOnce("'loginUserAndRedirect()' rejected.");

    await confirmRegistrationController.confirmRegistration(
      requestBody,
      //@ts-ignore
      mockRequest
    );

    expect(logSpy).toHaveBeenCalledWith(
      "info",
      "User with id 'a3a02e27bea012d8cad1583a' was not logged in, instead redirected to login: 'loginUserAndRedirect()' rejected."
    );
  });
});

describe("Failure: invalid id:", () => {
  it("Should send a '400' & message on invalid id.", async () => {
    (
      tryConfirmation as jest.MockedFunction<typeof tryConfirmation>
    ).mockRejectedValueOnce(
      new Error("tryConfirmation rejected for some reason.")
    );
    const confirmRegistrationController = new ConfirmRegistrationController();
    const setStatusSpy = jest.spyOn(confirmRegistrationController, "setStatus");
    const message = await confirmRegistrationController.confirmRegistration(
      requestBody,
      //@ts-ignore
      mockRequest
    );

    expect(setStatusSpy).toHaveBeenCalledTimes(1);
    expect(setStatusSpy).toHaveBeenCalledWith(400);
    expect(message).toBe("The confirmation id is invalid.");
  });
  it("Should log 'warn' if invalid confirmation id.", async () => {
    (
      tryConfirmation as jest.MockedFunction<typeof tryConfirmation>
    ).mockRejectedValueOnce(
      new Error("tryConfirmation rejected for some reason.")
    );
    const confirmRegistrationController = new ConfirmRegistrationController();
    await confirmRegistrationController.confirmRegistration(
      requestBody,
      //@ts-ignore
      mockRequest
    );
    expect(logSpy).toHaveBeenCalledWith(
      "warn",
      "Attempted registration confirmation with invalid id '63a02e27bea012d8cad1583f'."
    );
  });
});
