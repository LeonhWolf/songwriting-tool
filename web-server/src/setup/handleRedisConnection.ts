import { createClient } from "redis";

import { logger } from "../utils/logger";

const client = createClient({
  url: "redis://redis-url.com:123",
});

client.on("error", (error) => {
  logger.log("error", `Redis client error: '${error}'`);
});

client
  .connect()
  .then(() => {
    logger.log("info", "Redis connected.");
  })
  .catch((error) => {
    logger.log("error", `Redis could not connect: '${error}'`);
  });
