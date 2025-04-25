import express from "express";
import userController from "../controller/user-controller";
import authMiddleware from "../middleware/auth-middleware";

const router = express.Router();

router.get("/api/user/:id", authMiddleware, userController.getUser);
router.get(
  "/api/user/wallet/:wallet",
  authMiddleware,
  userController.getProfile
);

export default router;
