import {
    createSpecial,
    getSpecials,
    getActiveSpecials,
    updateSpecial,
    deleteSpecial
} from "../controllers/specialController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import authorizeRoles from "../middleware/roleMiddleware.js";
import express from "express";

const router = express.Router();

//Public Routes

router.get("/", getsecials);
router.get("/active", getActiveSpecials);

//Admin Routes

router.post("/", authMiddleware, authorizeRoles("admin"), createSpecial);
router.put("/:id", authMiddleware, authorizeRoles("admin"), updateSpecial);
router.delete("/:id", authMiddleware, authorizeRoles("admin"), deleteSpecial);

export default router;