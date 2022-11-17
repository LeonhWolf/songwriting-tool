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
jest.mock("express", () => ({
  __esModule: true,
  default: () => {
    return {
      use: jest.fn(),
      listen: expressListenSpy,
      on: expressOnSpy,
    };
  },
  urlencoded: jest.fn(),
  json: jest.fn(),
}));

jest.mock("swagger-ui-express", () => ({
  serve: jest.fn(),
}));

jest.mock("../tsoa-build/routes.ts");

const logSpy = jest.fn();
jest.mock("winston", () => {
  return {
    createLogger: () => {
      return {
        log: logSpy,
      };
    },
    format: {
      combine: () => {},
      timestamp: () => {},
      errors: () => {},
      splat: () => {},
      json: () => {},
      colorize: () => {},
    },
    transports: {
      Console: jest.fn(),
      File: jest.fn(),
    },
  };
});

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

describe("Server:", () => {
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
  it.todo("Should use 'urlencoded'.");
  it.todo("Should use 'json'.");
  it.todo("Should serve swaggerUi on '/api-docs'.");
  it.todo("Should use 'RegisterRoutes'.");
  it.todo("Should use 'tsoaValidation'.");
});

it.todo("Should import the logger.");
