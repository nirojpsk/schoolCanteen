import mongoose from "mongoose";

const menuItemSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Item name is required"],
            trim: true,
            minlength: [2, "Item name must be at least 2 characters"],
            maxlength: [100, "Item name must not exceed 100 characters"],
        },
        slug: {
            type: String,
            required: [true, "Slug is required"],
            unique: true,
            trim: true,
            lowercase: true,
            match: [
                /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
                "Slug must contain only lowercase letters, numbers, and hyphens",
            ],
        },
        description: {
            type: String,
            required: [true, "Description is required"],
            trim: true,
            minlength: [5, "Description must be at least 5 characters"],
            maxlength: [500, "Description must not exceed 500 characters"],
        },
        price: {
            type: Number,
            required: [true, "Price is required"],
            min: [0, "Price cannot be negative"],
        },
        image: {
            type: String,
            required: [true, "Image URL is required"],
            trim: true,
        },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            required: [true, "Category is required"],
        },
        isAvailable: {
            type: Boolean,
            default: true,
        },
        isFeatured: {
            type: Boolean,
            default: false,
        },
        isVeg: {
            type: Boolean,
            default: true,
        },
        preparationTime: {
            type: Number,
            required: [true, "Preparation time is required"],
            min: [1, "Preparation time must be at least 1 minute"],
            max: [180, "Preparation time looks too high"],
            default: 10,
        },
    },
    {
        timestamps: true,
    }
);

menuItemSchema.index({ name: 1 });
menuItemSchema.index({ category: 1 });
menuItemSchema.index({ isAvailable: 1 });
menuItemSchema.index({ isFeatured: 1 });

const MenuItem = mongoose.model("MenuItem", menuItemSchema);

export default MenuItem;