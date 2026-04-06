import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import authorizeRoles from '../middleware/roleMiddleware.js';
import validateMiddleware from '../middleware/validateMiddleware.js';
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
import {
loginValidation,
registerStudentValidation,
createStaffOrAdminValidation,
changePasswordValidation,
updateMyProfileValidation,
updateUserStatusValidation
} from "../validations/authValidation.js";

const router = express.Router();


//For public Routes
router.post("/register-student", registerStudentValidation, validateMiddleware, registerStudent);
router.post("/login", loginValidation, validateMiddleware, loginUser);
router.post("/logout", logoutUser);

//For protected Routes
router.get("/me", authMiddleware, getMe);
router.put("/update-profile", authMiddleware, updateMyProfileValidation, validateMiddleware, updateProfile);
router.put("/change-password", authMiddleware, changePasswordValidation, validateMiddleware, changePassword);

//For Admin
router.post("/create-user", authMiddleware, authorizeRoles("admin"), createStaffOrAdminValidation, validateMiddleware, createStaffOrAdmin);
router.get("/users", authMiddleware, authorizeRoles("admin"), getAllUsers);
router.get("/users/:id", authMiddleware, authorizeRoles("admin"), getUserById);
router.patch("/users/:id/status", authMiddleware, authorizeRoles("admin"), updateUserStatusValidation, validateMiddleware, updateUserStatus);


export default router;