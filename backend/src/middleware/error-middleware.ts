import { Request, Response, NextFunction } from "express";
import ResponseError from "../error/response-error";
import { ZodError } from "zod";

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
    res
      .status(err.status)
      .json({
        status: "error",
        message: err.message,
      })
      .end();
  } else if (err instanceof ZodError) {
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
    res.status(500).json({
      status: "error",
      message: "server internal error",
    });
  }
};

export default errorMiddleware;
