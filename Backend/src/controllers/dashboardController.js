import Category from "../models/Category.js";
import MenuItem from "../models/MenuItem.js";
import Special from "../models/Special.js";
import Preorder from "../models/Preorder.js";
import asyncHandler from "../utils/asyncHandler.js";
import { sendSuccess } from "../utils/responseHelper.js";

//1. Get dashboard stats

const getDashboardStats = asyncHandler(async (req, res) => {
    const now = new Date();

    const [
        totalCategories,
        totalMenuItems,
        totalSpecials,
        totalPreorders,
        pendingPreorders,
        preparingPreorders,
        readyPreorders,
        completedPreorders,
        cancelledPreorders
    ] = await Promise.all([
        Category.countDocuments({ isActive: true }),
        MenuItem.countDocuments({ isAvailable: true }),
        Special.countDocuments({
            isActive: true,
            startDate: { $lte: now },
            endDate: { $gte: now },
        }),
        Preorder.countDocuments(),
        Preorder.countDocuments({ status: 'pending' }),
        Preorder.countDocuments({ status: 'preparing' }),
        Preorder.countDocuments({ status: 'ready' }),
        Preorder.countDocuments({ status: 'completed' }),
        Preorder.countDocuments({ status: 'cancelled' })
    ]);

    sendSuccess(res, "Dashboard stats fetched successfully", {
        totalCategories,
        totalMenuItems,
        totalSpecials,
        totalPreorders,
        pendingPreorders,
        preparingPreorders,
        readyPreorders,
        completedPreorders,
        cancelledPreorders,
    }, 200);
});

//2. Get recent preorders

const getRecentPreorders = asyncHandler(async (req, res) => {
    const recentPreorders = await Preorder.find({})
        .sort({ createdAt: -1 })
        .limit(5)
        .populate('items.menuItem', 'name slug image price');

    sendSuccess(res, "Recent preorders fetched successfully", recentPreorders, 200);
});

export {getDashboardStats, getRecentPreorders};
