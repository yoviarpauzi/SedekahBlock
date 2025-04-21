import express from "express";
import userController from "../controller/user-controller";
import authMiddleware from "../middleware/auth-middleware";

const router = express.Router();

router.use(authMiddleware);
router.get("/api/user/:id", userController.getUser);
router.get("/api/user/wallet/:wallet", userController.getProfile);

export default router;
