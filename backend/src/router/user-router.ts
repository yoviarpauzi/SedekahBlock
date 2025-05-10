import express from "express";
import userController from "../controller/user-controller";
import authMiddleware from "../middleware/auth-middleware";

const router = express.Router();

router.get("/api/users/:id", authMiddleware, userController.getUser);
router.get(
  "/api/users/wallet/:wallet",
  authMiddleware,
  userController.getProfile
);
router.get("/api/users", authMiddleware, userController.getUsers);

export default router;
