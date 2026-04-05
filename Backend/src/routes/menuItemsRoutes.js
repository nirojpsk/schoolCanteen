import express from "express";
import {
    getMenuItems,
    getMenuItemById,
    createMenuItem,
    updateMenuItem,
    deleteMenuItem,
} from "../controllers/menuItemController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import authorizeRoles from "../middleware/roleMiddleware.js";

const router = express.Router();

//Public Routes

router.get("/", getMenuItems);
router.get("/:id", getMenuItemById);

//Admin only Routes

router.post("/", authMiddleware, authorizeRoles("admin"), createMenuItem);
router.put("/:id", authMiddleware, authorizeRoles("admin"), updateMenuItem);
router.delete("/:id", authMiddleware, authorizeRoles("admin"), deleteMenuItem);

export default router;