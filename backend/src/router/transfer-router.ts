import express from "express";
import adminMiddleware from "../middleware/admin-auth";
import transferController from "../controller/transfer-controller";

const router = express.Router();

router.post(
  "/api/campaigns/id/:id/transfer",
  adminMiddleware,
  transferController.create
);

router.get("/api/campaigns/id/:id/transfers", transferController.getTransfers);

// router.get(
//   "/api/campaigns/id/transfer/:transferId",
//   transferController.getTransferItem
// );

export default router;
