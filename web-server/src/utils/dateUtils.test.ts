import fakeTimers from "@sinonjs/fake-timers";

import { addDaysToDate } from "./dateUtils";

let clock: fakeTimers.InstalledClock;
beforeAll(() => {
  clock = fakeTimers.install();
});
beforeEach(() => {
  jest.clearAllMocks();
});

afterAll(() => {
  clock.uninstall();
});

it("Should return '1970-01-11T00:00:00.000Z' for '10' days.", () => {
  const now = new Date();
  expect(now.toISOString()).toBe("1970-01-01T00:00:00.000Z");

  const expectedResult = new Date("1970-01-11T00:00:00.000Z");
  const result = addDaysToDate(now, 10);
  expect(result).toStrictEqual(expectedResult);
});
it("Should return '1969-12-31T00:00:00.000Z' for '-1' days.", () => {
  const now = new Date();
  expect(now.toISOString()).toBe("1970-01-01T00:00:00.000Z");

  const expectedResult = new Date("1969-12-31T00:00:00.000Z");
  const result = addDaysToDate(now, -1);
  expect(result).toStrictEqual(expectedResult);
});
