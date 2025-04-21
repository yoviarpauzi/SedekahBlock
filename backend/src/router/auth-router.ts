import express from "express";
import authController from "../controller/auth-controller";

const router = express.Router();

router.post("/api/auth", authController.authenticate);
router.get("/api/generate-payload", authController.generatePayload);

export default router;
