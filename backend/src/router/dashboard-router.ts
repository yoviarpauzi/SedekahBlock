import express from "express";
import adminMiddleware from "../middleware/admin-auth";
import dashboardController from "../controller/dashboard-controller";

const router = express.Router();

router.get("/api/dashboard", dashboardController.index);

export default router;
