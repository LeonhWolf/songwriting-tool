import { createClient } from "redis";

import { logger } from "../utils/logger";

let isReconnectScheduled = false;

export const client = createClient({
  url: process.env.REDIS_URL,
  legacyMode: true,
});

const connectRedis = (): void => {
  client
    .connect()
    .then(() => {
      logger.log("info", "Redis connected.");
    })
    .catch((error) => {
      logger.log("error", `Redis could not connect: '${error}'`);
    });
  isReconnectScheduled = false;
};

client.on("error", (error) => {
  logger.log("error", `Redis client error: '${error}'`);
  if (!isReconnectScheduled) {
    setTimeout(connectRedis, 5000);
    isReconnectScheduled = true;
  }
});

export default connectRedis;
