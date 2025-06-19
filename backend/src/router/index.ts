import { app } from "../config/server";
import errorMiddleware from "../middleware/error-middleware";
import authRouter from "./auth-router";
import userRouter from "./user-router";
import categoryRouter from "./category-router";
import campaignRouter from "./campaign-router";
import homeRouter from "./home-router";
import dashboardRouter from "./dashboard-router";
import { Request, Response, NextFunction } from "express";
import ResponseError from "../error/response-error";

app.use(authRouter);
app.use(userRouter);
app.use(categoryRouter);
app.use(campaignRouter);
app.use(homeRouter);
app.use(dashboardRouter);
app.use((req: Request, res: Response, next: NextFunction) => {
  next(new ResponseError(404, "resource not found"));
});
app.use(errorMiddleware);

export default app;
