import mongoose from "mongoose";

import { logger } from "./logger";

export default function init(): void {
  if (!process.env.MONGODB_URI) {
    logger.log(
      "error",
      "MongoDB cannot connect because the environment variable 'MONGODB_URI' is 'undefined'."
    );
    return;
  }

  mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => {
      logger.log("info", "MongoDB connected.");

      mongoose.connection.on("error", (error) => {
        logger.log("error", error);
      });
      mongoose.connection.on("disconnected", (error) => {
        logger.log("error", error);
        setTimeout(init, 5000);
      });
    })
    .catch((error) => {
      logger.log("error", `MongoDB could not be connected to. ${error}`);
    });
}
