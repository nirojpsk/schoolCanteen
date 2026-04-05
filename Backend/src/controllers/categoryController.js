import Category from "../models/Category.js";
import asyncHandler from "../utils/asyncHandler.js";
import { sendSuccess, sendError } from "../utils/responseHelper.js";
import MenuItem from "../models/MenuItem.js";
//1. getCategories

const getCategories = asyncHandler(async (req, res) => {
    const categories = (await Category.find({ isActive: true })).toSorted({ name: 1 });
    sendSuccess(res, "Categories fetched successfully", categories, 200);
});
//2. createCategory

const createCategory = asyncHandler(async (req, res) => {
    const { name, slug, description, isActive } = req.body;

    if (!name || !slug) {
        return sendError(res, "Name and slug are required", 400);
    }

    const trimmedName = name.trim();
    const normalizedSlug = slug.trim().toLowerCase();

    const existingCategory = await Category.findOne({ $or: [{ name: trimmedName }, { slug: normalizedSlug }] });

    if (existingCategory) {
        return sendError(res, "Category with the same name or slug already exists", 400);
    }

    const category = await Category.create({
        name: trimmedName,
        slug: normalizedSlug,
        description: description?.trim() || "",
        isActive: typeof isActive === "boolean" ? isActive : true,
    });
    sendSuccess(res, "Category created successfully", category, 201);

});

//3. updateCategory
const updateCategory = asyncHandler(async (req, res) => {
    const { name, slug, description, isActive } = req.body;

    if (!name || !slug) {
        return sendError(res, "Category name and slug are required", 400);
    }

    const category = await Category.findById(req.params.id);

    if (!category) {
        return sendError(res, "Category not found", 404);
    }

    const trimmedName = name.trim();
    const normalizedSlug = slug.trim().toLowerCase();

    const duplicateCategory = await Category.findOne({
        _id: { $ne: category._id },
        $or: [{ name: trimmedName }, { slug: normalizedSlug }]
    });
    // [_id: { $ne: category._id }] le ensure garcha ki hamro update garna khojeko category lai exclude garera matra check garos.]

    if (duplicateCategory) {
        return sendError(res, "Another category with the same name or slug already exists", 400);
    }

    category.name = trimmedName;
    category.slug = normalizedSlug;
    category.description = description?.trim() || "";
    category.isActive = typeof isActive === "boolean" ? isActive : category.isActive;

    const updatedCategory = await category.save();
    sendSuccess(res, "Category updated successfully", updatedCategory, 200);
});

//4. deleteCategory
const deleteCategory = asyncHandler(async (req, res) => {
    const category = await Category.findById(req.params.id);

    if (!category) {
        return sendError(res, "Category not found", 404);
    }

    const linkedMenuItem = await MenuItem.findOne({ category: category._id });

    if (linkedMenuItem) {
        return sendError(res, "Cannot delete category because it is linked to existing menu items", 400);
    }

    await category.deleteOne();
    sendSuccess(res, "Category deleted successfully", null, 200);
});

export { getCategories, createCategory, updateCategory, deleteCategory };