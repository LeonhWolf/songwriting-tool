import resolvePendingPromises from "../utils/testUtils/resolvePendingPromises";

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
  it("Should connect on the URL from env variable.", () => {
    process.env.REDIS_URL = "redis://redis-url.com:123";
    require("./handleRedisConnection");

    expect(redisCreateClientMock).toHaveBeenCalledTimes(1);
    expect(redisCreateClientMock).toHaveBeenCalledWith({
      url: "redis://redis-url.com:123",
    });
  });
  it("Should log 'info' when connected.", async () => {
    require("./handleRedisConnection");
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
    require("./handleRedisConnection");

    expect(logSpy).toHaveBeenCalledTimes(0);
    await resolvePendingPromises();
    expect(logSpy).toHaveBeenCalledTimes(1);
    expect(logSpy).toHaveBeenCalledWith(
      "error",
      "Redis could not connect: 'Some reason why 'redis.connect()' rejected.'"
    );
  });
});

describe("Errors:", () => {
  it("Should log 'error' on Redis event 'error'.", () => {
    require("./handleRedisConnection");

    expect(redisOnMock).toHaveBeenCalledTimes(1);
    expect(redisOnMock).toHaveBeenCalledWith("error", expect.any(Function));
    const callback = redisOnMock.mock.calls[0][1];

    expect(logSpy).toHaveBeenCalledTimes(0);
    callback("Some Redis error.");

    expect(logSpy).toHaveBeenCalledTimes(1);
    expect(logSpy).toHaveBeenCalledWith(
      "error",
      "Redis client error: 'Some Redis error.'"
    );
  });
  it.todo("Should attempt restart every 5 secs.");
});
