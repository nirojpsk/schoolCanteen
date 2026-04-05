import mongoose from "mongoose";

const specialSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Special title is required"],
            trim: true,
            minlength: [2, "Title must be at least 2 characters"],
            maxlength: [100, "Title must not exceed 100 characters"],
        },
        description: {
            type: String,
            required: [true, "Description is required"],
            trim: true,
            minlength: [5, "Description must be at least 5 characters"],
            maxlength: [500, "Description must not exceed 500 characters"],
        },
        menuItem: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "MenuItem",
            required: [true, "Related menu item is required"],
        },
        specialPrice: {
            type: Number,
            required: [true, "Special price is required"],
            min: [0, "Special price cannot be negative"],
        },
        startDate: {
            type: Date,
            required: [true, "Start date is required"],
        },
        endDate: {
            type: Date,
            required: [true, "End date is required"],
            validate: {
                validator: function (value) {
                    return !this.startDate || value >= this.startDate;
                },
                message: "End date must be after or equal to start date",
            },
        },
        bannerImage: {
            type: String,
            required: [true, "Banner image is required"],
            trim: true,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

specialSchema.index({ isActive: 1, startDate: 1, endDate: 1 });

const Special = mongoose.model("Special", specialSchema);

export default Special;