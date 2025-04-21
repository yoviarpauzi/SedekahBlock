import winston from "winston";
import winstonDailyRotateFile from "winston-daily-rotate-file";

const logger: winston.Logger = winston.createLogger({
  level: "warning",
  format: winston.format.json(),
  transports: [
    new winston.transports.Console(),
    new winstonDailyRotateFile({
      level: "info",
      filename: "application-%DATE%.log",
      dirname: "./logs",
      datePattern: "YYYY-MM-DD-HH",
      zippedArchive: true,
      maxSize: "20m",
      maxFiles: "14d",
    }),
  ],
});

export default logger;
