let processPort: string | undefined = "5500";
const processOnSpy = jest.fn((event: string, listener: Function) => {
  listener("process error message");
});
jest.mock("process", () => ({
  on: processOnSpy,
  env: {
    PORT: processPort,
  },
}));

const expressListenSpy = jest.fn((port: number, callback: Function) => {
  callback();
});
const expressOnSpy = jest.fn((event: string, callback: Function) => {
  callback("some error message");
});
const expressUseSpy = jest.fn();
const expressDefaultSpy = {
  use: expressUseSpy,
  listen: expressListenSpy,
  on: expressOnSpy,
};
jest.mock("express", () => ({
  __esModule: true,
  default: () => expressDefaultSpy,
  urlencoded: jest.fn().mockReturnValue("urlencoded"),
  json: jest.fn().mockReturnValue("json"),
}));

jest.mock("swagger-ui-express", () => ({
  serve: jest.fn(),
}));

jest.mock("../tsoa-build/routes.ts", () => ({
  RegisterRoutes: jest.fn(),
}));

const tsoaValidationSpy = jest.fn();
jest.mock("./utils/tsoaValidation.ts", () => tsoaValidationSpy);

const {
  winstonMock,
  logSpy,
  createLoggerSpy,
} = require("./utils/testUtils/mockWinston");
jest.mock("winston", () => winstonMock);

const setEnvVariables = (): void => {
  process.env.PORT = "5500";
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

describe("Server start & error handling:", () => {
  it("Should log 'info' when server is started.", () => {
    const server = require("./app");
    expect(logSpy).toHaveBeenCalledWith(
      "info",
      "Server is listening on port: 5500."
    );
  });
  it("Should start server on port specified in env variable.", () => {
    const server = require("./app");
    expect(expressListenSpy.mock.calls[0][0]).toBe("5500");
  });
  it("Should start server on port '5000' if no env variable.", () => {
    processPort = undefined;
    const server = require("./app");
    processPort = "5500";
    expect(expressListenSpy.mock.calls[0][0]).toBe(5000);
  });
  it("Should log 'error' + stack trace if 'uncaughtException' occurs.", () => {
    const server = require("./app");
    expect(processOnSpy.mock.calls[0][0]).toBe("uncaughtException");
    expect(logSpy.mock.calls[0]).toEqual(["error", "process error message"]);
  });
});

describe("Register middleware:", () => {
  it("Should use 'urlencoded'.", () => {
    const server = require("./app");
    expect(expressUseSpy).toHaveBeenCalledWith("urlencoded");
  });
  it("Should use 'json'.", () => {
    const server = require("./app");
    expect(expressUseSpy).toHaveBeenCalledWith("json");
  });
  it("Should serve swaggerUi on '/api-docs'.", () => {
    const server = require("./app");
    expect(expressUseSpy).toHaveBeenCalledWith(
      "/api-docs",
      expect.any(Function),
      expect.any(Function)
    );
  });
  it("Should use 'RegisterRoutes'.", () => {
    const RegisterRoutes = require("../tsoa-build/routes").RegisterRoutes;
    const server = require("./app");
    expect(RegisterRoutes).toHaveBeenCalledWith(expressDefaultSpy);
  });
  it("Should use 'tsoaValidation'.", () => {
    const server = require("./app");
    expect(expressUseSpy).toHaveBeenCalledWith(tsoaValidationSpy);
  });
});

it("Should import the logger.", () => {
  const server = require("./app");
  expect(createLoggerSpy).toHaveBeenCalled();
});
