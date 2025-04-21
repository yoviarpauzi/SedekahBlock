import { PrismaClient } from "../../generated/prisma";
import logger from "./logger";

const prisma = new PrismaClient({
  log: [
    {
      emit: "event",
      level: "warn",
    },
    {
      emit: "event",
      level: "error",
    },
  ],
});

prisma.$on("warn", (e) => {
  logger.warn(e);
});

prisma.$on("error", (e) => {
  logger.error(e);
});

export default prisma;
