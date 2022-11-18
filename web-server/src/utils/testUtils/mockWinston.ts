export const logSpy = jest.fn();
export const createLoggerSpy = jest.fn(() => ({
  log: logSpy,
}));
export const winstonMock = {
  createLogger: createLoggerSpy,
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
