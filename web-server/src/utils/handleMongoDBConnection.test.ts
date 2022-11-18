const { winstonMock, logSpy } = require("./testUtils/mockWinston");
const mongooseConnectSpy = jest.fn().mockResolvedValue("");
const mongooseConnectionOnSpy = jest.fn();

import handleMongoDb from "./handleMongoDBConnection";
import resolvePendingPromises from "./testUtils/resolvePendingPromises";

jest.mock("mongoose", () => ({
  connect: mongooseConnectSpy,
  connection: { on: mongooseConnectionOnSpy },
}));

jest.mock("winston", () => winstonMock);

const setEnvVariables = (): void => {
  process.env.MONGODB_URI = "test MongoDB uri";
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

describe("Connect:", () => {
  it("Should connect on the URI from env variable.", () => {
    handleMongoDb();
    expect(mongooseConnectSpy).toHaveBeenCalledWith("test MongoDB uri");
  });
  it("Should log 'error' when no env variable for URI.", () => {
    process.env.MONGODB_URI = undefined;
    handleMongoDb();
    expect(logSpy).toHaveBeenCalledWith(
      "error",
      "MongoDB cannot connect because the environment variable 'MONGODB_URI' is 'undefined'."
    );
  });
  it("Should log 'info' when connected.", async () => {
    mongooseConnectSpy.mockResolvedValueOnce("resolved");
    handleMongoDb();
    expect(logSpy).not.toHaveBeenCalled();

    await resolvePendingPromises();
    expect(logSpy).toHaveBeenCalledWith("info", "MongoDB connected.");
  });
  it("Should log 'error' on initial connection error and NOT restart.", async () => {
    const rejectMessage = "Some reason for rejecting connection";
    mongooseConnectSpy.mockRejectedValueOnce(rejectMessage);
    handleMongoDb();
    expect(mongooseConnectSpy).toHaveBeenCalledTimes(1);
    expect(logSpy).not.toHaveBeenCalled();

    await resolvePendingPromises();
    expect(mongooseConnectSpy).toHaveBeenCalledTimes(1);
  });
});

describe("Errors:", () => {
  it("Should log 'error' on MongoDB event 'error'.", async () => {
    handleMongoDb();
    await resolvePendingPromises();

    const mongooseConnectionOnSpyCall =
      mongooseConnectionOnSpy.mock.calls.filter((call) => {
        if (call.includes("error")) return true;
        return false;
      })[0];

    mongooseConnectionOnSpyCall[1]("Generic error message.");

    expect(mongooseConnectionOnSpy).toHaveBeenCalledWith(
      "error",
      expect.any(Function)
    );
    expect(logSpy).toHaveBeenCalledWith("error", "Generic error message.");
  });
  describe("Handle 'disconnected':", () => {
    it("Should log 'error'.", async () => {
      handleMongoDb();
      await resolvePendingPromises();

      expect(mongooseConnectionOnSpy).toHaveBeenCalledWith(
        "disconnected",
        expect.any(Function)
      );

      const mongooseConnectionOnSpyCall =
        mongooseConnectionOnSpy.mock.calls.filter((call) => {
          if (call.includes("disconnected")) return true;
          return false;
        })[0];

      mongooseConnectionOnSpyCall[1]("Disconnect error message.");
      expect(logSpy).toHaveBeenCalledWith("error", "Disconnect error message.");
    });
    it("Should attempt restart every 5 secs.", async () => {
      //@ts-ignore
      jest.spyOn(global, "setTimeout").mockImplementation(() => {});

      handleMongoDb();
      await resolvePendingPromises();

      const mongooseConnectionOnSpyCall =
        mongooseConnectionOnSpy.mock.calls.filter((call) => {
          if (call.includes("disconnected")) return true;
          return false;
        })[0];

      mongooseConnectionOnSpyCall[1]("Disconnect error message.");

      expect(
        (setTimeout as jest.MockedFunction<typeof setTimeout>).mock.calls[0]
      ).toContain(5000);

      expect(mongooseConnectSpy).toHaveBeenCalledTimes(1);

      const timeoutCallback = (
        setTimeout as jest.MockedFunction<typeof setTimeout>
      ).mock.calls[0][0];
      timeoutCallback();

      expect(mongooseConnectSpy).toHaveBeenCalledTimes(2);
    });
  });
});
