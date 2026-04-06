import mongoose from 'mongoose';

const preorderItemSchema = new mongoose.Schema({
    menuItem: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "MenuItem",
        required: [true, "Menu item is required"]
    },
    name: {
        type: String,
        required: [true, "Item Name is required"],
        trim: true,
    },
    quantity: {
        type: Number,
        required: [true, "Quantity is required"],
        min: [1, "Quantity must be at least 1"],
    },
    priceAtOrderTime: {
        type: Number,
        required: [true, "Price at order time is required"],
        min: [0, "Price at order time cannot be negative"],
    },
}, { _id: false });

const preorderSchema = new mongoose.Schema({
    studentName: {
        type: String,
        required: [true, "Student name is required"],
        trim: true,
        minlength: [2, "Student name must be at least 2 characters long"],
        maxlength: [100, "Student name cannot exceed 100 characters"],
    },
    classSection: {
        type: String,
        required: [true, "Class/Section is required"],
        trim: true,
        maxlength: [50, "Class/Section cannot exceed 50 characters"],
    },
    phone: {
        type: String,
        required: [true, "Phone number is required"],
        trim: true,
        match: [/^[0-9+\-\s]{7,20}$/, "Please enter a valid phone number"],
    },
    items: {
        type: [preorderItemSchema],
        validate: {
            validator: function (value) {
                return Array.isArray(value) && value.length > 0;
            },
            message: "At least one item must be included in the preorder"
        },
        required: [true, "Items are required"]
    },
    pickupTime: {
        type: String,
        required: [true, "Pickup time is required"],
        trim: true,
        match: [/^(0?[1-9]|1[0-2]):[0-5][0-9]\s?(AM|PM)$/i, "Please enter a valid pickup time in the format HH:MM AM/PM"]
    },
    note: {
        type: String,
        trim: true,
        maxlength: [500, "Note cannot exceed 500 characters"],
        default: "",
    },
    totalAmount: {
        type: Number,
        required: [true, "Total amount is required"],
        min: [0, "Total amount cannot be negative"],
    },
    status: {
        type: String,
        enum: ["pending", "preparing", "ready", "completed", "cancelled"],
        default: "pending",
    },
}, { timestamps: true });

preorderSchema.index({ status: 1, createdAt: -1 });

const Preorder = mongoose.model("Preorder", preorderSchema);

export default Preorder;
