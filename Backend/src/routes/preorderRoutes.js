import express from 'express';
import { createPreorder, getPreorderById, getPreorders, updatePreorderStatus } from "../controllers/preorderController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import authorizeRoles from "../middleware/roleMiddleware.js";

const router = express.Router();

//Public Routes
router.post("/", createPreorder);

//Protected Routes
router.get("/", authMiddleware, authorizeRoles("admin", "staff"), getPreorders);
router.get("/:id", authMiddleware, authorizeRoles("admin", "staff"), getPreorderById);
router.put("/:id/status", authMiddleware, authorizeRoles("admin", "staff"), updatePreorderStatus);

export default router;