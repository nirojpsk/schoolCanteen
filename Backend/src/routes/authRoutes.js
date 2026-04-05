import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import authorizeRoles from '../middleware/roleMiddleware.js';
import {
    registerStudent,
    loginUser,
    logoutUser,
    getMe,
    createStaffOrAdmin,
    changePassword,
    updateProfile,
    getAllUsers,
    getUserById,
    updateUserStatus
} from '../controllers/authController.js';

const router = express.Router();


//For public Routes
router.post("/register-student", registerStudent);
router.post("/login", loginUser);
router.post("/logout", logoutUser);

//For protected Routes
router.get("/me", authMiddleware, getMe);
router.put("/update-profile", authMiddleware, updateProfile);
router.put("/change-password", authMiddleware, changePassword);

//For Admin
router.post("/create-user", authMiddleware, authorizeRoles("admin"), createStaffOrAdmin);
router.get("/users", authMiddleware, authorizeRoles("admin"), getAllUsers);
router.get("/users/:id", authMiddleware, authorizeRoles("admin"), getUserById);
router.patch("/users/:id/status", authMiddleware, authorizeRoles("admin"), updateUserStatus);


export default router;