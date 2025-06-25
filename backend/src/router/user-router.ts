import express from "express";
import userController from "../controller/user-controller";
import authMiddleware from "../middleware/auth-middleware";
import adminMiddleware from "../middleware/admin-auth";
import createMulterUploader from "../utils/createMulterUploader";

const router = express.Router();

const uploadProfile = createMulterUploader("./../storage/users");

router.get("/api/users/:id", authMiddleware, userController.getUser);
router.get(
  "/api/users/wallet/:wallet",
  authMiddleware,
  userController.getProfile
);
router.get("/api/users", adminMiddleware, userController.getUsers);
router.put(
  "/api/users/:id",
  [authMiddleware, uploadProfile.single("profile_picture")],
  userController.update
);

export default router;
