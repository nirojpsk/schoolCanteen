//1.LoginUser
import User from '../models/User.js';
import asyncHandler from '../utils/asyncHandler.js';
import generateToken from '../utils/generateToken.js';
import { sendSuccess, sendError } from '../utils/responseHelper.js';

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return sendError(res, "Email and password are required", 400);
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() }).select("+password");

    if (!user) {
        return sendError(res, "Invalid email or password", 401);
    }

    if (!isPasswordMatched) {
        return sendError(res, "Invalid email or password", 401);
    }

    if (!user.isActive) {
        return sendError(res, "Account is inactive. Please Contact admin", 403);
    }

    user.lastLogin = new Date();
    await user.save();

    generateToken(res, user._id);

    sendSuccess(
        res,
        "Login Successful",
        {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            phone: user.phone,
            profileImage: user.profileImage,
            classSection: user.classSection,
            isActive: user.isActive,
            lastLogin: user.lastLogin,
        },
        200
    );

});

//2.LogoutUser

const logoutUser = asyncHandler(async (req, res) => {
    res.cookie("jwt", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        expires: new Date(0),
    });
    sendSuccess(res, "Logged out successfully", null, 200);
});

//3.getUserProfile [logged-in user]
const getMe = asyncHandler(async (req, res) => {
    sendSuccess(res, "Current User Fetched Successfully", req.user, 200);
});

//4.RegisterStudent
const registerStudent = asyncHandler(async (req, res) => {

    const { name, email, password, phone, profileImage, classSection } = req.body;

    if (!name || !email || !password) {
        return sendError(res, "Name, Email and Password are required", 400);
    }

    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });

    if (existingUser) {
        return sendError(res, "User with this email already exists", 400);
    }

    const user = await User.create({
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password,
        phone: phone?.trim() || "",
        profileImage: profileImage?.trim() || "",
        classSection: classSection.trim() || "",
        role: "student",
    });
    user.lastLogin = new Date();
    await user.save();
    generateToken(res, user._id);
    sendSuccess(
        res,
        "Student registered successfully",
        {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            phone: user.phone,
            profileImage: user.profileImage,
            classSection: user.classSection,
            isActive: user.isActive,
            lastLogin: user.lastLogin,
        },
        201
    );
});

//5.ChangePassword [logged-in user]
const changePassword = asyncHandler(async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
        return sendError(res, "Please fill all the required fields", 400);
    }

    const user = await User.findById(req.user._id).select("+password");

    if (!user) {
        return sendError(res, "user not found", 404);
    }

    const isCurrentPasswordMatched = await user.matchPassword(currentPassword);

    if (!isCurrentPasswordMatched) {
        return sendError(res, "Current Password is incorrect!", 401);
    }

    const isSamepassword = await user.matchPassword(newPassword);

    if (isSamepassword) {
        return sendError(
            res,
            "New password must be different from current password",
            400
        );
    }
    user.password = newPassword;
    await user.save();
    sendSuccess(res, "Password changed successfully", null, 200);
});

//6.updateProfile [logged-in user]

const updateProfile = asyncHandler(async (req, res) => {
    const { name, phone, profileImage, classSection } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
        return sendError(res, "user not found!", 404);
    }

    if (name !== undefined) user.name = name.trim();
    if (phone !== undefined) user.phone = phone.trim();
    if (profileImage !== undefined) user.profileImage = profileImage.trim();
    if (classSection !== undefined) user.classSection = classSection.trim();

    const updatedUser = await user.save();

    sendSuccess(
        res,
        "Profile updated successfully",
        {
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
            phone: updatedUser.phone,
            profileImage: updatedUser.profileImage,
            classSection: updatedUser.classSection,
            isActive: updatedUser.isActive,
            lastLogin: updatedUser.lastLogin,
        },
        200
    );
});

//7.createStafforAdmin [admin]
const createStaffOrAdmin = asyncHandler(async (req, res) => {
    const { name, email, password, role, phone, profileImage, classSection } = req.body;

    if (!name || !email || !password || !role) {
        return sendError(res, "Name, email, password, and role are required", 400);
    }

    if (!["staff", "admin"].includes(role)) {
        return sendError(res, "Only staff or admin roles can be created here", 400);
    }

    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });

    if (existingUser) {
        return sendError(res, "User with this email already exists", 400);
    }

    const user = await User.create({
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password,
        role,
        phone: phone?.trim() || "",
        profileImage: profileImage?.trim() || "",
        classSection: classSection?.trim() || "",
    });

    sendSuccess(
        res,
        `${role} created successfully`,
        {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            phone: user.phone,
            profileImage: user.profileImage,
            classSection: user.classSection,
            isActive: user.isActive,
            lastLogin: user.lastLogin,
        },
        201
    );
});

//8.getAllUsers [admin]

const getAllUsers = asyncHandler(async (req, res) => {
    const { role, isActive } = req.query;
    const filter = {}; //to make it start with no restrictions
    if (role) {
        filter.role = role;
    }
    if (isActive !== undefined) {
        filter.isActive = isActive === "true";
    }
    const users = (await User.find(filter)).toSorted({ createdAt: -1 });
    sendSuccess(res, "Users fetched successfully", users, 200);
});

//9.getuserbyid [admin]

const getUserById = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        return sendError(res, "User not found", 404);
    }

    sendSuccess(res, "User fetched successfully", user, 200);
});

//10.updateUserStatus [admin]

const updateUserStatus = asyncHandler(async (req, res) => {

    const { isActive } = req.body;

    if (typeof isActive !== "boolean") {
        return sendError(res, "isActive must be a boolean value", 400);
    }
    const user = await User.findById(req.params.id);

    if (!user) {
        return sendError(res, "User not found", 404);
    }

    if (req.user._id.toString() === user._id.toString() && isActive === false) {
        return sendError(res, "You cannot deactivate your own account", 400);
    }
    user.isActive = isActive;
    const updatedUser = await user.save();

    sendSuccess(
        res,
        `User has been ${isActive ? "Activated" : "deactivated"} successfully`,
        {
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
            phone: updatedUser.phone,
            profileImage: updatedUser.profileImage,
            classSection: updatedUser.classSection,
            isActive: updatedUser.isActive,
            lastLogin: updatedUser.lastLogin,
        },
        200
    );
});

export { loginUser, logoutUser, getMe, registerStudent, createStaffOrAdmin, changePassword, updateProfile, getAllUsers, getUserById, updateUserStatus };