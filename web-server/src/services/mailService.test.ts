const { winstonMock, logSpy } = require("../utils/testUtils/mockWinston");
import nodemailer, { SendMailOptions } from "nodemailer";
import resolvePendingPromises from "../utils/testUtils/resolvePendingPromises";

const verifyTransporterSpy = jest.fn();
const sendMailSpy = jest.fn();

jest.mock("nodemailer", () => {
  return {
    createTestAccount: () => {},
    createTransport: jest.fn(() => {
      return {
        verify: verifyTransporterSpy,
        sendMail: sendMailSpy,
      };
    }),
    getTestMessageUrl: () => {},
  };
});

jest.mock("winston", () => winstonMock);

const setEnvVariables = (): void => {
  process.env.MAIL_HOST = "test.server.com";
  process.env.MAIL_PORT = "123";
  process.env.MAIL_USER = "web123";
  process.env.MAIL_PASSWORD = "123456";
  process.env.MAIL_SENDER_ADDRESS = "mail@server.com";
};

const oldEnv = process.env;
beforeEach(() => {
  jest.resetModules();
  jest.clearAllMocks();
  process.env = { ...oldEnv };
  setEnvVariables();
});
afterAll(() => {
  process.env = oldEnv;
});

describe("Init:", () => {
  it.skip("Should 'createTransport' when imported.", async () => {
    verifyTransporterSpy.mockResolvedValue("resolved");
    const mailService = require("./mailService");

    await resolvePendingPromises();

    //@ts-ignore
    console.log(nodemailer.createTransport.mock.calls);
    expect(nodemailer.createTransport).toHaveBeenCalledWith({
      host: process.env.MAIL_HOST,
      port: parseInt(process.env.MAIL_PORT ?? ""),
      secure: true,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD,
      },
    });
  });
  it("Should verify the 'transporter'.", async () => {
    verifyTransporterSpy.mockResolvedValue("");
    const mailService = require("./mailService");

    expect(verifyTransporterSpy).toHaveBeenCalled();
  });
  it("Should log 'info' when 'transporter' is verified.", async () => {
    verifyTransporterSpy.mockResolvedValue("");
    const mailService = require("./mailService");

    await resolvePendingPromises();

    expect(logSpy).toHaveBeenCalledWith(
      "info",
      "The mail transporter has been verified."
    );
  });
  it("Should catch when 'verify' rejects.", async () => {
    verifyTransporterSpy.mockRejectedValueOnce("Some reason for rejecting.");
    const mailService = require("./mailService");

    expect(resolvePendingPromises).not.toThrow();
  });
  it("Should log 'error' when env variables are missing.", () => {
    process.env.MAIL_PASSWORD = undefined;
    const mailService = require("./mailService");

    expect(logSpy).toHaveBeenCalledWith(
      "error",
      "Email service could not be initialized. Not all environment variables for email config were set."
    );
  });
  it("Should log 'error' when 'verify' rejects.", async () => {
    verifyTransporterSpy.mockRejectedValueOnce("some reason here");
    const mailService = require("./mailService");

    await resolvePendingPromises();

    expect(logSpy).toHaveBeenCalledWith(
      "error",
      "Email service could not be verified. some reason here"
    );
  });
});

describe("Send mail:", () => {
  it("Should reject to send when 'transporter' is not verified.", async () => {
    verifyTransporterSpy.mockRejectedValueOnce("Some reason for rejecting.");
    const mailService = require("./mailService");

    await resolvePendingPromises();

    await expect(
      mailService.send({
        toAddress: "recipient@server.com",
        subject: "Some email subject",
        htmlContent: "<div>hello mail</div>",
        from: {
          name: "Sender",
          address: "sender@server.com",
        },
      })
    ).rejects.toThrowError("'transporter' is not verified.");
  });
  it("Should pass all arguments to 'sendMail', with textContent.", async () => {
    verifyTransporterSpy.mockResolvedValueOnce("");
    const mailService = require("./mailService");

    await resolvePendingPromises();

    await mailService.send({
      toAddress: "recipient@server.com",
      subject: "Some email subject",
      textContent: "Some email text content",
      from: {
        name: "Sender",
        address: "sender@server.com",
      },
    });
    const expectedArguments: SendMailOptions = {
      to: "recipient@server.com",
      subject: "Some email subject",
      text: "Some email text content",
      from: {
        name: "Sender",
        address: "sender@server.com",
      },
    };
    expect(nodemailer.createTransport().sendMail).toHaveBeenCalledWith(
      expectedArguments
    );
  });
  it("Should pass all arguments to 'sendMail', with htmlContent.", async () => {
    verifyTransporterSpy.mockResolvedValueOnce("");
    const mailService = require("./mailService");

    await resolvePendingPromises();

    await mailService.send({
      toAddress: "recipient@server.com",
      subject: "Some email subject",
      htmlContent: "<div>hello mail</div>",
      from: {
        name: "Sender",
        address: "sender@server.com",
      },
    });
    const expectedArguments: SendMailOptions = {
      to: "recipient@server.com",
      subject: "Some email subject",
      text: undefined,
      html: "<div>hello mail</div>",
      from: {
        name: "Sender",
        address: "sender@server.com",
      },
    };
    expect(nodemailer.createTransport().sendMail).toHaveBeenCalledWith(
      expectedArguments
    );
  });
  it("Should reject when sending mail rejects.", async () => {
    verifyTransporterSpy.mockResolvedValueOnce("");
    const mailService = require("./mailService");
    sendMailSpy.mockRejectedValueOnce("Some reason for rejecting");

    await resolvePendingPromises();

    await expect(
      mailService.send({
        toAddress: "recipient@server.com",
        subject: "Some email subject",
        htmlContent: "<div>hello mail</div>",
        from: "sender@server.com",
      })
    ).rejects.toThrowError(
      "Email could not be sent. Some reason for rejecting"
    );
  });
  it("Should log 'warn' when sending mail throws an error.", async () => {
    verifyTransporterSpy.mockResolvedValueOnce("");
    const mailService = require("./mailService");
    sendMailSpy.mockRejectedValueOnce("Some reason for rejecting");

    await resolvePendingPromises();

    try {
      await mailService.send({
        toAddress: "recipient@server.com",
        subject: "Some email subject",
        htmlContent: "<div>hello mail</div>",
        from: "sender@server.com",
      });
    } catch (error) {
      expect(logSpy).toHaveBeenCalledWith(
        "warn",
        "Email could not be sent. Some reason for rejecting"
      );
    }
  });
});
