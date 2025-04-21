import { Request, Response, NextFunction } from "express";
import ResponseError from "../error/response-error";
import { ZodError } from "zod";
import logger from "../config/logger";

const errorMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!err) {
    next();
    return;
  }

  if (err instanceof ResponseError) {
    logger.error(err.message);

    res
      .status(err.status)
      .json({
        status: "error",
        message: err.message,
      })
      .end();
  } else if (err instanceof ZodError) {
    logger.error(err.message);

    res
      .status(400)
      .json({
        status: "error",
        message: err.message,
        data: {
          ...err.issues,
        },
      })
      .end();
  } else {
    logger.error("server internal error");

    res.status(500).json({
      status: "error",
      message: "server internal error",
    });
  }
};

export default errorMiddleware;
