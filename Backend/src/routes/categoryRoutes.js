import express from "express";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import authorizeRoles from "../middleware/roleMiddleware.js";
import validateMiddleware from "../middleware/validateMiddleware.js";
import {
  createCategoryValidation,
  updateCategoryValidation,
} from "../validations/categoryValidation.js";

const router = express.Router();

//Public Routes
router.get("/", getCategories);

//Admin Routes
router.post(
  "/",
  authMiddleware,
  authorizeRoles("admin"),
  createCategoryValidation,
  validateMiddleware,
  createCategory
);

router.put(
  "/:id",
  authMiddleware,
  authorizeRoles("admin"),
  updateCategoryValidation,
  validateMiddleware,
  updateCategory
);

router.delete("/:id", authMiddleware, authorizeRoles("admin"), deleteCategory);

export default router;