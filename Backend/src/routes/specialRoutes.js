import {
    createSpecial,
    getSpecials,
    getActiveSpecials,
    updateSpecial,
    deleteSpecial
} from "../controllers/specialController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import authorizeRoles from "../middleware/roleMiddleware.js";
import validateMiddleware from "../middleware/validateMiddleware.js";
import {
createSpecialValidation,
updateSpecialValidation,
} from "../validations/specialValidation.js";
import express from "express";

const router = express.Router();

//Public Routes

router.get("/", getSpecials);
router.get("/active", getActiveSpecials);

//Admin Routes

router.post("/", authMiddleware, authorizeRoles("admin"), createSpecialValidation, validateMiddleware, createSpecial);
router.put("/:id", authMiddleware, authorizeRoles("admin"), updateSpecialValidation, validateMiddleware, updateSpecial);
router.delete("/:id", authMiddleware, authorizeRoles("admin"), deleteSpecial);

export default router;
