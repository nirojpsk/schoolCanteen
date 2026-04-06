import { body } from "express-validator";

const categoryBaseValidation = () => [
  body("name")
    .isString()
    .withMessage("Category name must be a string value")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("Category name is required")
    .isLength({ min: 3, max: 50 })
    .withMessage("Category name must be between 3 and 50 characters"),

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
    .optional({ values: "null" })
    .isString()
    .withMessage("Description must be a string value")
    .bail()
    .trim()
    .isLength({ max: 300 })
    .withMessage("Description must not exceed 300 characters"),

  body("isActive")
    .optional()
    .isBoolean()
    .withMessage("isActive must be a boolean value"),
];

const createCategoryValidation = categoryBaseValidation();
const updateCategoryValidation = categoryBaseValidation();

export { createCategoryValidation, updateCategoryValidation };
