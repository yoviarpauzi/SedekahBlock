import express from "express";
import campaignController from "../controller/campaign-controller";
import adminMiddleware from "../middleware/admin-auth";

const router = express.Router();

router.post("/api/campaigns", adminMiddleware, campaignController.create);
router.put("/api/campaigns", adminMiddleware, campaignController.update);
router.get("/api/campaigns/check", campaignController.isTitleExist);
router.get("/api/campaigns/:id", campaignController.getCampaign);
router.get("/api/campaigns", campaignController.getAllCampaign);

export default router;
