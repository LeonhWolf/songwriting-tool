import cron from "node-cron";

import { findAll, deleteMany } from "./userService";
import { logger } from "../utils/logger";

async function deleteExpiredUsers(): Promise<void> {
  const users = await findAll("isAccountConfirmationExpired");
  if (users.length === 0) return;
  await deleteMany(users.map((user) => user._id));
}
export default function init() {
  cron.schedule("* * */1 * * *", () => {
    deleteExpiredUsers()
      .then(() => {})
      .catch((error) => {
        logger.log(
          "error",
          `Expired account confirmations could not be checked: ${error}`
        );
      });
  });
}
