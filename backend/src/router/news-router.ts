import express from "express";
import createMulterUploader from "../utils/createMulterUploader";
import adminMiddleware from "../middleware/admin-auth";
import newsController from "../controller/news-controller";

const router = express.Router();

const uploadNewsContent = createMulterUploader(
  "./../temp/campaigns/news/content"
);

router.post("/api/campaigns/news/upload-content", [
  adminMiddleware,
  uploadNewsContent.single("content"),
  newsController.uploadNewsImage,
]);

router.get("/api/campaigns/id/:id/news", newsController.getNews);
router.get(
  "/api/campaigns/news/id/:id",
  adminMiddleware,
  newsController.getNewsItem
);

router.post("/api/campaigns/news/upload-content", [
  adminMiddleware,
  uploadNewsContent.single("content"),
  newsController.uploadNewsImage,
]);

router.post(
  "/api/campaigns/id/:id/news",
  adminMiddleware,
  newsController.create
);

router.put(
  "/api/campaigns/news/id/:newsId",
  adminMiddleware,
  newsController.update
);

router.delete(
  "/api/campaigns/news/id/:id",
  adminMiddleware,
  newsController.destroy
);

export default router;
