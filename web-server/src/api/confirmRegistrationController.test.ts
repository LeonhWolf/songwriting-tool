const winstonMock = require("../utils/testUtils/mockWinston").winstonMock;
jest.mock("winston", () => winstonMock);

import request from "supertest";
import mongoose from "mongoose";

import { app } from "../app";
import { tryConfirmation } from "../services/userService";
import { IConfirmRegistration } from "../../../api-types/authentication.types";
import { logSpy } from "../utils/testUtils/mockWinston";

jest.mock("../setup/handleMongoDBConnection", () => ({
  __esModule: true,
  default: () => jest.fn(),
}));

jest.mock("../services/mailService.ts", () => ({
  __esModule: true,
  default: () => jest.fn(),
}));

jest.mock("../services/userService", () => ({
  tryConfirmation: jest.fn().mockResolvedValue({
    _id: new mongoose.Types.ObjectId("a3a02e27bea012d8cad1583a"),
  }),
}));

const getPostResponse = async (): Promise<request.Response> => {
  const body: IConfirmRegistration = {
    confirmation_id: "63a02e27bea012d8cad1583f",
  };
  const response = await request(app)
    .post("/api/confirm-registration")
    .send(body)
    .set("Accept", "application/json");
  return response;
};

beforeEach(() => {
  jest.clearAllMocks();
});

it.todo("Should automatically log in when confirmed.");
it("Should try to confirm registration id.", async () => {
  await getPostResponse();

  expect(tryConfirmation).toHaveBeenCalledTimes(1);
  expect(tryConfirmation).toHaveBeenCalledWith(
    new mongoose.Types.ObjectId("63a02e27bea012d8cad1583f")
  );
});
it("Should send a '200' & message on success.", async () => {
  const response = await getPostResponse();
  expect(response.status).toBe(200);
  expect(response.body).toBe(
    "User registration has been successfully confirmed."
  );
});
it("Should send a '400' & message on invalid id.", async () => {
  (
    tryConfirmation as jest.MockedFunction<typeof tryConfirmation>
  ).mockRejectedValueOnce(
    new Error("tryConfirmation rejected for some reason.")
  );
  const response = await getPostResponse();
  expect(response.status).toBe(400);
  expect(response.body).toBe("The confirmation id is invalid.");
});
it("Should log 'info' if account confirmed.", async () => {
  await getPostResponse();
  expect(logSpy).toHaveBeenCalledWith(
    "info",
    "Registration for account with id 'a3a02e27bea012d8cad1583a' has been confirmed."
  );
});
it("Should log 'warn' if invalid confirmation id.", async () => {
  (
    tryConfirmation as jest.MockedFunction<typeof tryConfirmation>
  ).mockRejectedValueOnce(
    new Error("tryConfirmation rejected for some reason.")
  );
  await getPostResponse();
  expect(logSpy).toHaveBeenCalledWith(
    "warn",
    "Attempted registration confirmation with invalid id '63a02e27bea012d8cad1583f'."
  );
});
