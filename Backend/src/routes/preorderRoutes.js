import express from 'express';
import { createPreorder, getPreorderById, getPreorders, updatePreorderStatus } from "../controllers/preorderController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import authorizeRoles from "../middleware/roleMiddleware.js";
import validateMiddleware from '../middleware/validateMiddleware.js';
import {
createPreorderValidation,
updatePreorderStatusValidation,
} from "../validations/preorderValidation.js";


const router = express.Router();

//Public Routes
router.post("/", createPreorderValidation, validateMiddleware, createPreorder);

//Protected Routes
router.get("/", authMiddleware, authorizeRoles("admin", "staff"), getPreorders);
router.get("/:id", authMiddleware, authorizeRoles("admin", "staff"), getPreorderById);
router.put("/:id/status", authMiddleware, authorizeRoles("admin", "staff"), updatePreorderStatusValidation, validateMiddleware, updatePreorderStatus);

export default router;