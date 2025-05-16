import express from "express";
import categoryController from "../controller/category-controller";
import adminMiddleware from "../middleware/admin-auth";

const router = express.Router();

router.post("/api/categories", adminMiddleware, categoryController.create);
router.put("/api/categories", adminMiddleware, categoryController.update);
router.get(
  "/api/categories/check",
  adminMiddleware,
  categoryController.isNameExist
);
router.delete(
  "/api/categories/id/:id",
  adminMiddleware,
  categoryController.destroy
);
router.get("/api/categories", categoryController.getAllCategory);

export default router;
