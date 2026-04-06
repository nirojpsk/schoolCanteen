import express from "express";
import {
    getDashboardStats,
    getRecentPreorders,
} from "../controllers/dashboardController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import authorizeRoles from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get("/stats", authMiddleware, authorizeRoles("admin"), getDashboardStats);
router.get(
    "/recent-orders",
    authMiddleware,
    authorizeRoles("admin"),
    getRecentPreorders
);

export default router;
