import { app } from "../config/server";
import errorMiddleware from "../middleware/error-middleware";
import authRouter from "./auth-router";
import userRouter from "./user-router";

app.use(authRouter);
app.use(userRouter);
app.use(errorMiddleware);

export default app;
