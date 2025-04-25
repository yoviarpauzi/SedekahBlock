import { app } from "../config/server";
import errorMiddleware from "../middleware/error-middleware";
import authRouter from "./auth-router";
import userRouter from "./user-router";
import { Request, Response, NextFunction } from "express";
import ResponseError from "../error/response-error";

app.use(authRouter);
app.use(userRouter);
app.use((req: Request, res: Response, next: NextFunction) => {
  throw new ResponseError(404, "resource not found");
});

app.use(errorMiddleware);

export default app;
