import express from "express";
import campaignController from "../controller/campaign-controller";
import adminMiddleware from "../middleware/admin-auth";
import multer from "multer";
import path from "path";
import ResponseError from "../error/response-error";

function createMulterUploader(destinationFolder: string) {
  return multer({
    storage: multer.diskStorage({
      destination(req, file, callback) {
        callback(null, path.resolve(__dirname, destinationFolder));
      },
      filename(req, file, callback) {
        const uniqueSuffix =
          Date.now() +
          "-" +
          Math.round(Math.random() * 1e9) +
          path.extname(file.originalname);
        callback(null, uniqueSuffix);
      },
    }),
    fileFilter(req, file, callback) {
      const allowTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp",
        "image/avif",
      ];
      if (allowTypes.includes(file.mimetype)) {
        callback(null, true);
      } else {
        callback(new ResponseError(415, "unsupported media type"));
      }
    },
    limits: {
      fileSize: 10 * 1024 * 1024,
    },
  });
}

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
  "/api/campaigns",
  [adminMiddleware, uploadCampaignThumbnail.single("thumbnail")],
  campaignController.update
);
router.get("/api/campaigns/check", campaignController.isTitleExist);
router.get("/api/campaigns/id/:id", campaignController.getCampaign);
router.get("/api/campaigns", campaignController.getAllCampaign);

export default router;
