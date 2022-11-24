const winstonMock = require("../utils/testUtils/mockWinston").winstonMock;

const nodeCronScheduleMock = jest.fn(
  (cronExpression: string, callback: () => {}) => {
    callback();
  }
);
jest.mock("node-cron", () => ({
  schedule: nodeCronScheduleMock,
}));

const userServiceDeleteManyMock = jest.fn();
const userServiceFindAllMock = jest.fn();
jest.mock("./userService.ts", () => ({
  deleteMany: userServiceDeleteManyMock,
  findAll: userServiceFindAllMock,
}));

jest.mock("winston", () => winstonMock);

import fakeTimers from "@sinonjs/fake-timers";
import mongoose from "mongoose";

import tasksSchedulerService from "./tasksSchedulerService";
import resolvePendingPromises from "../utils/testUtils/resolvePendingPromises";
import { logSpy } from "../utils/testUtils/mockWinston";

let clock: fakeTimers.InstalledClock;

beforeAll(() => {
  clock = fakeTimers.install();
});
beforeEach(() => {
  jest.clearAllMocks();
  jest.resetModules();
  clock.setSystemTime(new Date("1970-01-01T00:00:00.000Z"));
});

afterAll(() => {
  clock.uninstall();
});

describe("Account Confirmations:", () => {
  it("Should schedule task hourly.", () => {
    tasksSchedulerService();
    expect(nodeCronScheduleMock).toHaveBeenCalledWith(
      "* * */1 * * *",
      expect.any(Function)
    );
  });
  describe("Task:", () => {
    it("Should search expired users.", async () => {
      tasksSchedulerService();
      await resolvePendingPromises();
      expect(userServiceFindAllMock).toHaveBeenCalled();
    });
    it("Should log 'error' if search rejects.", async () => {
      userServiceFindAllMock.mockRejectedValueOnce(
        "Some reason for rejecting 'findAll'."
      );
      tasksSchedulerService();
      await resolvePendingPromises();

      expect(logSpy).toHaveBeenCalledWith(
        "error",
        "Expired account confirmations could not be checked: Some reason for rejecting 'findAll'."
      );
    });
    it("Should delete expired users.", async () => {
      const user1 = { _id: new mongoose.Types.ObjectId(445566) };
      const user2 = { _id: new mongoose.Types.ObjectId(112233) };
      userServiceFindAllMock.mockResolvedValueOnce([user1, user2]);

      tasksSchedulerService();
      await resolvePendingPromises();

      expect(userServiceDeleteManyMock).toHaveBeenCalledWith([
        user1._id,
        user2._id,
      ]);
    });
    it("Should not delete if no expires users exist.", async () => {
      userServiceFindAllMock.mockResolvedValueOnce([]);

      tasksSchedulerService();
      await resolvePendingPromises();

      expect(userServiceDeleteManyMock).not.toHaveBeenCalled();
    });
    it("Should log 'error' if deleting rejects.", async () => {
      const user1 = { _id: new mongoose.Types.ObjectId(445566) };
      const user2 = { _id: new mongoose.Types.ObjectId(112233) };
      userServiceFindAllMock.mockResolvedValueOnce([user1, user2]);
      userServiceDeleteManyMock.mockRejectedValueOnce(
        "Some DB error, 'deleteMany'"
      );

      tasksSchedulerService();
      await resolvePendingPromises();

      expect(logSpy).toHaveBeenCalledWith(
        "error",
        "Expired account confirmations could not be checked: Some DB error, 'deleteMany'"
      );
    });
  });
});
