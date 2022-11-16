import nodemailer, { SendMailOptions } from "nodemailer";

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

const nextTick = async (): Promise<void> => {
  await new Promise((resolve) => {
    process.nextTick(resolve);
  });
};

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
  it.skip("Should 'createTransport' when imported.", () => {
    verifyTransporterSpy.mockResolvedValue("resolved");
    const mailService = require("./mailService");
    const spy = jest.spyOn(nodemailer, "createTransport");

    //@ts-ignore
    console.log(nodemailer.createTransport.mock.calls);
    expect(spy).toHaveBeenCalledWith({
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
  it("Should catch when 'verify' rejects.", async () => {
    verifyTransporterSpy.mockRejectedValueOnce("Some reason for rejecting.");
    const mailService = require("./mailService");

    expect(nextTick).not.toThrow();
  });
  it.todo("Should log when env variables are missing.");
  it.todo("Should log when 'verify' rejects.");
});

describe("Send mail:", () => {
  it("Should reject to send when 'transporter' is not verified.", async () => {
    verifyTransporterSpy.mockRejectedValueOnce("Some reason for rejecting.");
    const mailService = require("./mailService");

    await nextTick();

    await expect(
      mailService.send({
        toAddress: "recipient@server.com",
        subject: "Some email subject",
        htmlContent: "<div>hello mail</div>",
        from: "sender@server.com",
      })
    ).rejects.toThrowError("'transporter' is not verified.");
  });
  it("Should pass all arguments to 'sendMail', with textContent.", async () => {
    verifyTransporterSpy.mockResolvedValueOnce("");
    const mailService = require("./mailService");

    await nextTick();

    await mailService.send({
      toAddress: "recipient@server.com",
      subject: "Some email subject",
      textContent: "Some email text content",
      from: "sender@server.com",
    });
    const expectedArguments: SendMailOptions = {
      to: "recipient@server.com",
      subject: "Some email subject",
      text: "Some email text content",
      from: "sender@server.com",
    };
    expect(nodemailer.createTransport().sendMail).toHaveBeenCalledWith(
      expectedArguments
    );
  });
  it("Should pass all arguments to 'sendMail', with htmlContent.", async () => {
    verifyTransporterSpy.mockResolvedValueOnce("");
    const mailService = require("./mailService");

    await nextTick();

    await mailService.send({
      toAddress: "recipient@server.com",
      subject: "Some email subject",
      htmlContent: "<div>hello mail</div>",
      from: "sender@server.com",
    });
    const expectedArguments: SendMailOptions = {
      to: "recipient@server.com",
      subject: "Some email subject",
      text: undefined,
      html: "<div>hello mail</div>",
      from: "sender@server.com",
    };
    expect(nodemailer.createTransport().sendMail).toHaveBeenCalledWith(
      expectedArguments
    );
  });
  it("Should reject when sending mail rejects.", async () => {
    verifyTransporterSpy.mockResolvedValueOnce("");
    const mailService = require("./mailService");
    sendMailSpy.mockRejectedValueOnce("Some reason for rejecting");

    await nextTick();

    expect(
      mailService.send({
        toAddress: "recipient@server.com",
        subject: "Some email subject",
        htmlContent: "<div>hello mail</div>",
        from: "sender@server.com",
      })
    ).rejects.toEqual("Some reason for rejecting");
  });
  it.todo("Should log when sending mail throws an error.");
});
