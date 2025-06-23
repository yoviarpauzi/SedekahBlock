import express from "express";
import withdrawController from "../controller/withdraw-controller";
import createMulterUploader from "../utils/createMulterUploader";
import adminMiddleware from "../middleware/admin-auth";

const router = express.Router();

const uploadWithdrawContent = createMulterUploader(
  "./../temp/campaigns/withdraw/content"
);

router.post(
  "/api/campaigns/withdraw/upload-content",
  [adminMiddleware, uploadWithdrawContent.single("content")],
  withdrawController.uploadWithdrawImage
);

router.post(
  "/api/campaigns/id/:id/withdraw",
  adminMiddleware,
  withdrawController.create
);

router.put(
  "/api/campaigns/withdraw/id/:withdrawId",
  adminMiddleware,
  withdrawController.update
);

router.delete(
  "/api/campaigns/withdraw/id/:withdrawId",
  adminMiddleware,
  withdrawController.destroy
);

router.get("/api/campaigns/id/:id/withdraws", withdrawController.getWithdraws);

router.get(
  "/api/campaigns/withdraw/id/:withdrawId",
  withdrawController.getWithdrawItem
);

export default router;
