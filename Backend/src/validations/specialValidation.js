import { body } from "express-validator";

const specialBaseValidation = () => [
  body("title")
    .isString()
    .withMessage("Title must be a string value")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("Title must be between 2 and 100 characters"),

  body("description")
    .isString()
    .withMessage("Description must be a string value")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("Description is required")
    .isLength({ min: 5, max: 500 })
    .withMessage("Description must be between 5 and 500 characters"),

  body("menuItem")
    .isString()
    .withMessage("Menu item must be a string value")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("Menu item is required")
    .isMongoId()
    .withMessage("Menu item must be a valid Mongo ID"),

  body("specialPrice")
    .exists()
    .withMessage("Special price is required")
    .bail()
    .isFloat({ min: 0 })
    .withMessage("Special price must be a number greater than or equal to 0"),

  body("startDate")
    .exists()
    .withMessage("Start date is required")
    .bail()
    .isISO8601()
    .withMessage("Start date must be a valid date"),

  body("endDate")
    .exists()
    .withMessage("End date is required")
    .bail()
    .isISO8601()
    .withMessage("End date must be a valid date")
    .custom((endDate, { req }) => {
      if (new Date(endDate) < new Date(req.body.startDate)) {
        throw new Error("End date must be after or equal to start date");
      }
      return true;
    }),

  body("bannerImage")
    .isString()
    .withMessage("Banner image must be a string value")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("Banner image is required"),

  body("isActive")
    .optional()
    .isBoolean()
    .withMessage("isActive must be a boolean value"),
];

const createSpecialValidation = specialBaseValidation();
const updateSpecialValidation = specialBaseValidation();

export { createSpecialValidation, updateSpecialValidation };
