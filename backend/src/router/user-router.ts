import express from "express";
import userController from "../controller/user-controller";
import authMiddleware from "../middleware/auth-middleware";
import adminMiddleware from "../middleware/admin-auth";

const router = express.Router();

router.get("/api/users/:id", authMiddleware, userController.getUser);
router.get(
  "/api/users/wallet/:wallet",
  authMiddleware,
  userController.getProfile
);
router.get("/api/users", adminMiddleware, userController.getUsers);

export default router;
