import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Category name is required'],
        unique: true,
        trim: true,
        minlength: [3, 'Category name must be at least 3 characters long'],
        maxlength: [50, 'Category name must be less than 50 characters long']
    },
    slug: {
        type: String,
        required: [true, 'Slug is required'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "slug must contain only lowercase letters, numbers, and hyphens, and cannot start or end with a hyphen"]
    },
    description: {
        type: String,
        trim: true,
        maxlength: [300, 'Description must be less than 300 characters long'],
        default: '',
    },
    isActive: {
        type: Boolean,
        default: true
    },
}, { timestamps: true });

const Category = mongoose.model('Category', categorySchema);

export default Category;
