import MenuItem from "../models/MenuItem.js";
import Category from "../models/Category.js";
import Special from "../models/Special.js";
import asyncHandler from "../utils/asyncHandler.js";
import { sendSuccess, sendError } from "../utils/responseHelper.js";

//1. Get all menu items

const getMenuItems = asyncHandler(async (req, res) => {
    const { category, search, available, featured } = req.query;

    const filter = {}; // yesle filter object banauxa jasma query parameters ko basis ma filtering criteria set garne

    if (typeof category === "string" && category.trim()) {
        const foundCategory = await Category.findOne({ slug: category.trim().toLowerCase() });

        if (!foundCategory) {
            return sendSuccess(res, "Menu items Fetched successfully", [], 200);
        }
        filter.category = foundCategory._id; // yesle filter object ma category field set garne
    }

    if (typeof search === "string" && search.trim()) {
        filter.name = { $regex: search.trim(), $options: "i" }; // yesle filter object ma name field set garne jasma regex use garera search term match garne
        // $options: "i" le case-insensitive search garne
        //regex le search term lai pattern ma convert garne jasma "i" option le case-insensitive search garne
    }

    if (available !== undefined) {
        filter.isAvailable = available === "true"; // yesle filter object ma isAvailable field set garne jasma query parameter ko value true ya false ma convert garne
    }

    if (featured !== undefined) {
        filter.isFeatured = featured === "true"; // yesle filter object ma isFeatured field set garne jasma query parameter ko value true ya false ma convert garne
    }

    const menuItems = await MenuItem.find(filter)
        .populate("category", "name slug") // yesle menu items ko category field lai populate garne jasma category ko name ra slug matra include garne
        .sort({ createdAt: -1 }); // yesle menu items lai createdAt field ko basis ma descending order ma sort garne
    sendSuccess(res, "Menu items fetched successfully", menuItems, 200);

});

//2. Get menu item by ID
const getMenuItemById = asyncHandler(async (req, res) => {
    const menuItem = await MenuItem.findById(req.params.id).populate("category", "name slug");;

    if (!menuItem) {
        return sendError(res, "Menu item not found", 404);
    }
    sendSuccess(res, "Menu item fetched successfully", menuItem, 200);
});

//3. Create a new menu item
const createMenuItem = asyncHandler(async (req, res) => {
    const {
        name,
        slug,
        description,
        price,
        image,
        category,
        isAvailable,
        isFeatured,
        isVeg,
        preparationTime,
    } = req.body;

    const trimmedName = name.trim();
    const normalizedSlug = slug.trim().toLowerCase();
    const trimmedDescription = description.trim();
    const trimmedImage = image.trim();

    const existingMenuItem = await MenuItem.findOne({ slug: normalizedSlug });

    if (existingMenuItem) {
        return sendError(res, "Menu item with this slug already exists", 400);
    }

    const existingCategory = await Category.findById(category);

    if (!existingCategory) {
        return sendError(res, "Selected Category does not exist", 400);
    }

    const menuItem = await MenuItem.create({
        name: trimmedName,
        slug: normalizedSlug,
        description: trimmedDescription,
        price,
        image: trimmedImage,
        category,
        isAvailable: typeof isAvailable === "boolean" ? isAvailable : true,
        isFeatured: typeof isFeatured === "boolean" ? isFeatured : false,
        isVeg: typeof isVeg === "boolean" ? isVeg : true,
        preparationTime,
    });
    const populatedMenuItem = await MenuItem.findById(menuItem._id).populate("category", "name slug");
    sendSuccess(res, "Menu item created successfully", populatedMenuItem, 201);

});

//4. Update a menu item
const updateMenuItem = asyncHandler(async (req, res) => {
    const {
        name,
        slug,
        description,
        price,
        image,
        category,
        isAvailable,
        isFeatured,
        isVeg,
        preparationTime,
    } = req.body;

    const menuItem = await MenuItem.findById(req.params.id);

    if (!menuItem) {
        return sendError(res, "Menu item not found", 404);
    }

    const trimmedName = name.trim();
    const normalizedSlug = slug.trim().toLowerCase();
    const trimmedDescription = description.trim();
    const trimmedImage = image.trim();

    const duplicateMenuItem = await MenuItem.findOne({
        _id: { $ne: req.params.id },
        slug: normalizedSlug,
    });

    if (duplicateMenuItem) {
        return sendError(res, "Another menu item with this slug already exists", 400);
    }

    const existingCategory = await Category.findById(category);

    if (!existingCategory) {
        return sendError(res, "Selected category does not exist", 400);
    }
    menuItem.name = trimmedName;
    menuItem.slug = normalizedSlug;
    menuItem.description = trimmedDescription;
    menuItem.price = price;
    menuItem.image = trimmedImage;
    menuItem.category = category;
    menuItem.isAvailable = typeof isAvailable === "boolean" ? isAvailable : menuItem.isAvailable;
    menuItem.isFeatured = typeof isFeatured === "boolean" ? isFeatured : menuItem.isFeatured;
    menuItem.isVeg = typeof isVeg === "boolean" ? isVeg : menuItem.isVeg;
    menuItem.preparationTime = preparationTime;

    await menuItem.save();

    const updatedMenuItem = await MenuItem.findById(menuItem._id).populate("category", "name slug");
    sendSuccess(res, "Menu item updated successfully", updatedMenuItem, 200);
});

//5. Delete a menu item
const deleteMenuItem = asyncHandler(async (req, res) => {
    const menuItem = await MenuItem.findById(req.params.id);

    if (!menuItem) {
        return sendError(res, "Menu item not found", 404);
    }

    const linkedSpecial = await Special.findOne({ menuItem: menuItem._id });

    if (linkedSpecial) {
        return sendError(res, "Cannot delete menu item linked to an existing special", 400);
    }

    await menuItem.deleteOne();
    sendSuccess(res, "Menu item deleted successfully", null, 200);
});

export { getMenuItems, getMenuItemById, createMenuItem, updateMenuItem, deleteMenuItem };
