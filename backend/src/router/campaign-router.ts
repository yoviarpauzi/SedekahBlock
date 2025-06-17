import express from "express";
import campaignController from "../controller/campaign-controller";
import adminMiddleware from "../middleware/admin-auth";
import authMiddleware from "../middleware/auth-middleware";
import createMulterUploader from "../utils/createMulterUploader";

const uploadCampaignThumbnail = createMulterUploader(
  "./../storage/campaigns/thumbnail"
);
const uploadCampaignContent = createMulterUploader(
  "./../temp/campaigns/content"
);
const router = express.Router();

router.post(
  "/api/campaigns",
  [adminMiddleware, uploadCampaignThumbnail.single("thumbnail")],
  campaignController.create
);
router.post(
  "/api/campaigns/upload-content",
  [adminMiddleware, uploadCampaignContent.single("content")],
  campaignController.uploadCampaignImage
);
router.put(
  "/api/campaigns/id/:id",
  [uploadCampaignThumbnail.single("thumbnail")],
  campaignController.update
);
router.delete(
  "/api/campaigns/id/:id",
  adminMiddleware,
  campaignController.destroy
);
router.get(
  "/api/campaigns/check",
  adminMiddleware,
  campaignController.isTitleExist
);
router.patch(
  "/api/campaigns/updateBalanceAndCollected/:id",
  authMiddleware,
  campaignController.updateBalanceAndCollected
);
router.get("/api/campaigns/id/:id", campaignController.getCampaign);
router.get("/api/campaigns", campaignController.getCampaigns);
router.get("/api/campaigns/id/:id/news", campaignController.getNews);
router.get(
  "/api/campaigns/id/:id/fundDisbursement",
  campaignController.getFundDisbursement
);
router.get("/api/campaigns/id/:id/histories", campaignController.getHistories);
router.patch("/api/campaigns/id/:id/status", campaignController.toggleStatus);

export default router;
