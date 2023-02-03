const redisConnectMock = jest.fn().mockResolvedValue("Redis connect resolved.");
const redisOnMock = jest.fn();
const redisCreateClientMock = jest.fn(() => ({
  connect: redisConnectMock,
  on: redisOnMock,
}));
jest.mock("redis", () => ({
  createClient: redisCreateClientMock,
}));

const { winstonMock, logSpy } = require("../utils/testUtils/mockWinston");
jest.mock("winston", () => winstonMock);

import connectRedis from "./handleRedisConnection";
import resolvePendingPromises from "../utils/testUtils/resolvePendingPromises";

//@ts-ignore
jest.spyOn(global, "setTimeout").mockImplementation(() => {});

const oldEnv = process.env;
beforeEach(() => {
  jest.resetModules();
  jest.clearAllMocks();
  process.env = { ...oldEnv };
});
afterAll(() => {
  process.env = oldEnv;
});

describe("Connect:", () => {
  it("Should connect on the URL from env variable + legacyMode.", () => {
    process.env.REDIS_URL = "redis://redis-url.com:123";
    require("./handleRedisConnection");
    connectRedis();

    expect(redisCreateClientMock).toHaveBeenCalledTimes(1);
    expect(redisCreateClientMock).toHaveBeenCalledWith({
      url: "redis://redis-url.com:123",
      legacyMode: true,
    });
  });
  it("Should log 'info' when connected.", async () => {
    connectRedis();
    expect(redisConnectMock).toHaveBeenCalledTimes(1);
    expect(logSpy).toHaveBeenCalledTimes(0);

    await resolvePendingPromises();
    expect(logSpy).toHaveBeenCalledTimes(1);
    expect(logSpy).toHaveBeenCalledWith("info", "Redis connected.");
  });
  it("Should log 'error' on initial connection error and NOT restart.", async () => {
    redisConnectMock.mockRejectedValueOnce(
      "Some reason why 'redis.connect()' rejected."
    );
    connectRedis();

    expect(logSpy).toHaveBeenCalledTimes(0);
    await resolvePendingPromises();
    expect(logSpy).toHaveBeenCalledTimes(1);
    expect(logSpy).toHaveBeenCalledWith(
      "error",
      "Redis could not connect: 'Some reason why 'redis.connect()' rejected.'"
    );
  });
});

describe("Redis event 'error':", () => {
  it("Should log 'error'.", () => {
    require("./handleRedisConnection");

    expect(redisOnMock).toHaveBeenCalledTimes(1);
    expect(redisOnMock).toHaveBeenCalledWith("error", expect.any(Function));
    const errorCallback = redisOnMock.mock.calls[0][1];

    expect(logSpy).toHaveBeenCalledTimes(0);
    errorCallback("Some Redis error.");

    expect(logSpy).toHaveBeenCalledTimes(1);
    expect(logSpy).toHaveBeenCalledWith(
      "error",
      "Redis client error: 'Some Redis error.'"
    );
  });
  it("Should attempt restart every 5 secs.", async () => {
    require("./handleRedisConnection");
    expect(redisOnMock).toHaveBeenCalledWith("error", expect.any(Function));
    const errorCallback = redisOnMock.mock.calls[0][1];

    expect(setTimeout).toHaveBeenCalledTimes(0);
    expect(redisConnectMock).toHaveBeenCalledTimes(0);
    errorCallback("Some Redis error.");

    expect(setTimeout).toHaveBeenCalledTimes(1);
    expect(setTimeout).toHaveBeenCalledWith(expect.any(Function), 5000);

    const timeoutCallback = (
      setTimeout as jest.MockedFunction<typeof setTimeout>
    ).mock.calls[0][0];
    timeoutCallback();
    expect(redisConnectMock).toHaveBeenCalledTimes(1);
  });
  it("Should only restart every 5 secs even if more errors occur.", async () => {
    require("./handleRedisConnection");
    expect(redisOnMock).toHaveBeenCalledWith("error", expect.any(Function));
    const errorCallback = redisOnMock.mock.calls[0][1];

    expect(setTimeout).toHaveBeenCalledTimes(0);
    errorCallback("Some Redis error.");
    expect(setTimeout).toHaveBeenCalledTimes(1);

    errorCallback("Some other Redis error.");
    expect(setTimeout).toHaveBeenCalledTimes(1);

    const timeoutCallback = (
      setTimeout as jest.MockedFunction<typeof setTimeout>
    ).mock.calls[0][0];
    timeoutCallback();

    errorCallback("Some other Redis error.");
    expect(setTimeout).toHaveBeenCalledTimes(2);
  });
});
