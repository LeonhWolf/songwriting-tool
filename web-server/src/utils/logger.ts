import winston from "winston";

export const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({ format: winston.format.colorize() }),
    new winston.transports.File({
      filename: "warnsAndErrors.log",
      level: "warn",
    }),
  ],
});
