import { body } from "express-validator";

const menuItemBaseValidation = () => [
  body("name")
    .isString()
    .withMessage("Item name must be a string value")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("Item name is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("Item name must be between 2 and 100 characters"),

  body("slug")
    .isString()
    .withMessage("Slug must be a string value")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("Slug is required")
    .customSanitizer((value) => value.toLowerCase())
    .matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .withMessage("Slug must contain only lowercase letters, numbers, and hyphens"),

  body("description")
    .isString()
    .withMessage("Description must be a string value")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("Description is required")
    .isLength({ min: 5, max: 500 })
    .withMessage("Description must be between 5 and 500 characters"),

  body("price")
    .exists()
    .withMessage("Price is required")
    .bail()
    .isFloat({ min: 0 })
    .withMessage("Price must be a number greater than or equal to 0"),

  body("image")
    .isString()
    .withMessage("Image URL must be a string value")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("Image URL is required"),

  body("category")
    .isString()
    .withMessage("Category must be a string value")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("Category is required")
    .isMongoId()
    .withMessage("Category must be a valid Mongo ID"),

  body("preparationTime")
    .exists()
    .withMessage("Preparation time is required")
    .bail()
    .isInt({ min: 1, max: 180 })
    .withMessage("Preparation time must be between 1 and 180 minutes"),

  body("isAvailable")
    .optional()
    .isBoolean()
    .withMessage("isAvailable must be a boolean value"),

  body("isFeatured")
    .optional()
    .isBoolean()
    .withMessage("isFeatured must be a boolean value"),

  body("isVeg")
    .optional()
    .isBoolean()
    .withMessage("isVeg must be a boolean value"),
];

const createMenuItemValidation = menuItemBaseValidation();
const updateMenuItemValidation = menuItemBaseValidation();

export { createMenuItemValidation, updateMenuItemValidation };
