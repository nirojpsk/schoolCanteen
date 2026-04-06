import Special from "../models/Special.js";
import MenuItem from "../models/MenuItem.js";
import asyncHandler from "../utils/asyncHandler.js";
import { sendSuccess, sendError } from "../utils/responseHelper.js";

//1. getSpecials

const getSpecials = asyncHandler(async (req, res) => {
    const specials = await Special.find({})
        .populate({
            path: "menuItem",
            select: "name price slug image category",
            populate: {
                path: "category",
                select: "name slug",
            },
        })
        .sort({ createdAt: -1 });

    sendSuccess(res, "Specials fetched successfully", 200, specials);
});

//2. getActiveSpecials

const getActiveSpecials = asyncHandler(async (req, res) => {
    const now = new Date();

    const activeSpecials = await Special.find({
        isActive: true,
        startDate: { $lte: now },
        endDate: { $gte: now },
    })
        .populate({
            path: "menuItem",
            select: "name price slug image category",
            populate: {
                path: "category",
                select: "name slug",
            },
        }).sort({ createdAt: -1 });

    sendSuccess(res, "Active specials fetched successfully", 200, activeSpecials);
});

//3. createSpecial

const createSpecial = asyncHandler(async (req, res) => {
    const {
        title,
        description,
        menuItem,
        specialPrice,
        startDate,
        endDate,
        bannerImage,
        isActive,
    } = req.body;

    if (!title || !description || !menuItem ||
        specialPrice === undefined || !startDate ||
        !endDate || !bannerImage
    ) {
        return sendError(res, "All fields are required", 400);
    }

    const existingMenuItem = await MenuItem.findById(menuItem);

    if (!existingMenuItem) {
        return sendError(res, "Related menu item not found", 404);
    }

    const special = await Special.create({
        title: title.trim(),
        description: description.trim(),
        menuItem,
        specialPrice,
        startDate,
        endDate,
        bannerImage: bannerImage.trim(),
        isActive: typeof isActive === "boolean" ? isActive : true,
    });

    const populatedSpecial = await Special.findById(special._id).populate({
        path: "menuItem",
        select: "name price slug image category",
        populate: {
            path: "category",
            select: "name slug",
        },
    });

    sendSuccess(res, "Special created successfully", populatedSpecial, 201);
});

//4. updateSpecial
const updateSpecial = asyncHandler(async (req, res) => {
    const {
        title,
        description,
        menuItem,
        specialPrice,
        startDate,
        endDate,
        bannerImage,
        isActive,
    } = req.body;

    if (
        !title ||
        !description ||
        !menuItem ||
        specialPrice === undefined ||
        !startDate ||
        !endDate ||
        !bannerImage
    ) {
        return sendError(res, "All fields are required", 400);
    }

    const special = await Special.findById(req.params.id);

    if (!special){
        return sendError(res, "Special not found", 404);
    }

    const existingMenuItem = await MenuItem.findById(menuItem);

    if (!existingMenuItem){
        return sendError(res, "Related menu item not found", 404);
    }

    special.title = title.trim();
    special.description = description.trim();
    special.menuItem = menuItem;
    special.specialPrice = specialPrice;
    special.startDate = startDate;
    special.endDate = endDate;
    special.bannerImage = bannerImage.trim();
    special.isActive = typeof isActive === "boolean" ? isActive : special.isActive;

    await special.save();

    const updatedSpecial = await Special.findById(special._id).populate({
        path: "menuItem",
        select: "name price slug image category",
        populate: {
            path: "category",
            select: "name slug",
        },
    });

    sendSuccess(res, "Special updated successfully", updatedSpecial, 200);
});

//5. deleteSpecial

const deleteSpecial = asyncHandler(async (req, res) => {
 const special = await Special.findById(req.params.id);

 if (!special){
    return sendError(res, "Special not found", 404);
 }
 await special.deleteOne();
    sendSuccess(res, "Special deleted successfully",null, 200);
});

export { getSpecials, getActiveSpecials, createSpecial, updateSpecial, deleteSpecial };