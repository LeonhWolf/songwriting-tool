const userServiceCreateMock = jest.fn(() => ({
  get: () => {
    return new Date("1970-01-15T00:00:00.000Z");
  },
}));
const mailServiceSendMock = jest.fn();
const emailInterpolationMock = jest
  .fn()
  .mockResolvedValue("Interpolated email mock");

import request from "supertest";
import fakeTimers from "@sinonjs/fake-timers";

import { app } from "../app";
import { INewUser } from "../services/userService";
import { ISendParameters } from "../services/mailService.types";
import { logSpy } from "../utils/testUtils/mockWinston";

jest.mock("../utils/handleMongoDBConnection", () => ({
  __esModule: true,
  default: () => jest.fn(),
}));

jest.mock("../services/userService.ts", () => ({
  __esModule: true,
  default: () => jest.fn(),
  create: userServiceCreateMock,
}));

jest.mock("../services/mailService.ts", () => ({
  __esModule: true,
  default: () => jest.fn(),
  sendMail: mailServiceSendMock,
}));

jest.mock("../services/emailTemplateService.ts", () => ({
  getInterpolatedEmailString: emailInterpolationMock,
}));

const oldEnv = process.env;
let clock: fakeTimers.InstalledClock;
beforeAll(() => {
  process.env = { ...oldEnv };
  process.env.BASE_URL = "https://base-url.com";
  clock = fakeTimers.install();
});
beforeEach(() => {
  jest.clearAllMocks();
});

afterAll(() => {
  process.env = oldEnv;
  clock.uninstall();
});

describe("Success:", () => {
  const newUser: INewUser = {
    email_address: "john@doe.com",
    first_name: "John",
    last_name: "Doe",
    plainPassword: "123456",
    client_language: "en",
  };
  const getPostResponse = async (): Promise<request.Response> => {
    const response = await request(app)
      .post("/api/register")
      .send(newUser)
      .set("Accept", "application/json");
    return response;
  };
  it("Should create user.", async () => {
    await getPostResponse();
    expect(userServiceCreateMock).toHaveBeenCalledWith(newUser);
  });
  it("Should call 'getInterpolatedEmailString()' with proper arguments.", async () => {
    await getPostResponse();
    const expectedInterpolationDataArgument = {
      name: "John Doe",
      confirmationLink: "https://base-url.com/accountConfirmation?id=123",
      expiresOnDate: "1970-01-15T00:00:00.000Z",
    };

    expect(emailInterpolationMock).toHaveBeenCalledTimes(1);
    expect(emailInterpolationMock).toHaveBeenCalledWith(
      "registerConfirmation",
      expectedInterpolationDataArgument
    );
  });
  it("Should send confirmation mail.", async () => {
    await getPostResponse();
    const expectedMailSendParameters: ISendParameters = {
      toAddress: "john@doe.com",
      subject: "Registration confirmation: Smart Grocery List",
      from: {
        name: "Smart Grocery List",
        address: "leonhardwolf@lw-webdev.de",
      },
      htmlContent: "Interpolated email mock",
    };
    expect(mailServiceSendMock).toHaveBeenCalledWith(
      expectedMailSendParameters
    );
  });
  it("Should return a '200'.", async () => {
    const response = await getPostResponse();
    expect(response.statusCode).toBe(200);
  });
});
describe("Failure:", () => {
  describe("Duplicate email:", () => {
    it.todo("Should send '200'.");
    it.todo("Should not create user.");
    it.todo("Should not send mail.");
  });
  describe("Env variable 'BASE_URL' is not set", () => {
    it.todo("Should send '500'.");
    it.todo("Should not create user.");
    it.todo("Should not send mail.");
    it.todo("Should log 'error' with error.");
  });
  describe("'create()' fails:", () => {
    it.todo("Should log 'error' with error.");
    it.todo("Should send '500'.");
  });
  describe("'sendMail()' fails:", () => {
    it.todo("Should log 'error' with error.");
    it.todo("Should send '500'.");
  });
});
