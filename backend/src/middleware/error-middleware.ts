import { Request, Response, NextFunction } from "express";
import ResponseError from "../error/response-error";
import { ZodError } from "zod";
import logger from "../config/logger";
import multer from "multer";

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
        message: err.message,
      })
      .end();
  } else if (err instanceof ZodError) {
    logger.error(err.message);

    res
      .status(400)
      .json({
        message: err.message,
        error: err,
      })
      .end();
  } else if (err instanceof multer.MulterError) {
    logger.error(err.message);

    res.status(400).json({
      message: err.message,
      error: err,
    });
  } else {
    logger.error("server internal error");

    res.status(500).json({
      message: err.message,
    });
  }
};

export default errorMiddleware;
