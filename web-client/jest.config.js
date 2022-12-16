module.exports = {
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
  },
  testEnvironment: "jsdom",
  moduleNameMapper: {
    "^.+\\.(css|scss)$": "<rootDir>/src/utils/testStyleMock.ts",
  },
};
