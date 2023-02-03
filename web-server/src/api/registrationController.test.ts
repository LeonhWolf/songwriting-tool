const mongooseObjectIdToStringMock = jest.fn(() => "someObjectId");
const userServiceCreateGetMock = jest.fn((path: string) => {
  if (path === "account_confirmation.expires_on")
    return new Date("1970-01-15T00:00:00.000Z");
  if (path === "account_confirmation._id")
    return { toString: mongooseObjectIdToStringMock };
  return;
});
const userServiceCreateMock = jest.fn().mockResolvedValue({
  get: userServiceCreateGetMock,
});
const mailServiceSendMock = jest.fn().mockResolvedValue("");
const emailInterpolationMock = jest
  .fn()
  .mockResolvedValue("Interpolated email mock");
const getEmailTakenErrorMessageMock = jest.fn(() => "Email taken error msg.");
const winstonMock = require("../utils/testUtils/mockWinston").winstonMock;

jest.mock("../services/userService.ts", () => ({
  __esModule: true,
  default: () => jest.fn(),
  getEmailTakenErrorMessage: getEmailTakenErrorMessageMock,
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

jest.mock("winston", () => winstonMock);

import fakeTimers from "@sinonjs/fake-timers";

import { INewUser } from "../../../api-types/authentication.types";
import { ISendParameters } from "../services/mailService.types";
import { logSpy } from "../utils/testUtils/mockWinston";
import { RegistrationController } from "./registrationController";

const oldEnv = process.env;
let clock: fakeTimers.InstalledClock;
beforeAll(() => {
  process.env = { ...oldEnv };
  clock = fakeTimers.install();
});
beforeEach(() => {
  process.env.BASE_URL = "https://base-url.com";
  jest.clearAllMocks();
});

afterAll(() => {
  process.env = oldEnv;
  clock.uninstall();
});

const newUser: INewUser = {
  email_address: "john@doe.com",
  first_name: "John",
  last_name: "Doe",
  plainPassword: "123456",
  client_language: "en",
};
describe("Success:", () => {
  it("Should create user.", async () => {
    const registrationController = new RegistrationController();
    await registrationController.createUser(newUser);
    expect(userServiceCreateMock).toHaveBeenCalledWith(newUser);
  });
  it("Should call 'getInterpolatedEmailString()' with proper arguments.", async () => {
    const registrationController = new RegistrationController();
    await registrationController.createUser(newUser);
    const expectedInterpolationDataArgument = {
      name: "John Doe",
      confirmationLink:
        "https://base-url.com/confirm-registration?id=someObjectId",
      expiresOnDate: "1970-01-15T00:00:00.000Z",
    };

    expect(mongooseObjectIdToStringMock).toHaveBeenCalledTimes(1);
    expect(emailInterpolationMock).toHaveBeenCalledTimes(1);
    expect(emailInterpolationMock).toHaveBeenCalledWith(
      "registerConfirmation",
      expectedInterpolationDataArgument
    );
  });
  it("Should send confirmation mail.", async () => {
    const registrationController = new RegistrationController();
    await registrationController.createUser(newUser);
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
    const registrationController = new RegistrationController();
    jest.spyOn(registrationController, "setStatus");
    await registrationController.createUser(newUser);
    expect(registrationController.setStatus).toHaveBeenCalledTimes(1);
    expect(registrationController.setStatus).toHaveBeenCalledWith(200);
  });
});
describe("Failure:", () => {
  describe("Duplicate email:", () => {
    it("Should send '200'.", async () => {
      userServiceCreateMock.mockRejectedValueOnce(
        new Error("Email taken error msg.")
      );
      const registrationController = new RegistrationController();
      jest.spyOn(registrationController, "setStatus");
      await registrationController.createUser(newUser);
      expect(registrationController.setStatus).toHaveBeenCalledTimes(1);
      expect(registrationController.setStatus).toHaveBeenCalledWith(200);
    });
    it("Should not send mail.", async () => {
      userServiceCreateMock.mockRejectedValueOnce("Email taken error msg.");
      const registrationController = new RegistrationController();
      await registrationController.createUser(newUser);
      expect(mailServiceSendMock).not.toHaveBeenCalled();
    });
  });
  describe("Env variable 'BASE_URL' is not set", () => {
    it("Should send '500'.", async () => {
      process.env.BASE_URL = undefined;
      const registrationController = new RegistrationController();
      jest.spyOn(registrationController, "setStatus");
      await registrationController.createUser(newUser);
      expect(registrationController.setStatus).toHaveBeenCalledTimes(1);
      expect(registrationController.setStatus).toHaveBeenCalledWith(500);
    });
    it("Should not create user.", async () => {
      process.env.BASE_URL = undefined;
      const registrationController = new RegistrationController();
      await registrationController.createUser(newUser);
      expect(userServiceCreateMock).not.toHaveBeenCalled();
    });
    it("Should not send mail.", async () => {
      process.env.BASE_URL = undefined;
      const registrationController = new RegistrationController();
      await registrationController.createUser(newUser);
      expect(mailServiceSendMock).not.toHaveBeenCalled();
    });
    it("Should log 'error' with error.", async () => {
      process.env.BASE_URL = undefined;
      const registrationController = new RegistrationController();
      jest.spyOn(registrationController, "setStatus");
      await registrationController.createUser(newUser);
      expect(logSpy).toHaveBeenCalledWith(
        "error",
        "User not registered: Environment variable 'BASE_URL' is 'undefined'."
      );
    });
  });
  describe("'create()' fails:", () => {
    it("Should send '500'.", async () => {
      userServiceCreateMock.mockRejectedValueOnce("Some DB error.");
      const registrationController = new RegistrationController();
      jest.spyOn(registrationController, "setStatus");
      await registrationController.createUser(newUser);
      expect(registrationController.setStatus).toHaveBeenCalledTimes(1);
      expect(registrationController.setStatus).toHaveBeenCalledWith(500);
    });
    it("Should log 'error' with error.", async () => {
      userServiceCreateMock.mockRejectedValueOnce("Some DB error.");
      const registrationController = new RegistrationController();
      await registrationController.createUser(newUser);
      expect(logSpy).toHaveBeenCalledWith(
        "error",
        "User not registered: Some DB error."
      );
    });
  });
  describe("'sendMail()' fails:", () => {
    it("Should send '500'.", async () => {
      mailServiceSendMock.mockRejectedValueOnce("Some mail error.");
      const registrationController = new RegistrationController();
      jest.spyOn(registrationController, "setStatus");
      await registrationController.createUser(newUser);
      expect(registrationController.setStatus).toHaveBeenCalledTimes(1);
      expect(registrationController.setStatus).toHaveBeenCalledWith(500);
    });
    it("Should log 'error' with error.", async () => {
      mailServiceSendMock.mockRejectedValueOnce("Some mail error.");
      const registrationController = new RegistrationController();
      await registrationController.createUser(newUser);
      expect(logSpy).toHaveBeenCalledWith(
        "error",
        "User not registered: Some mail error."
      );
    });
  });
});
