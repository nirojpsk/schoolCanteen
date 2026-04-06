import { body } from "express-validator";

const mongoIdPattern = /^[a-f\d]{24}$/i;

const createPreorderValidation = [
  body("studentName")
    .isString()
    .withMessage("Student name must be a string value")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("Student name is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("Student name must be between 2 and 100 characters"),

  body("classSection")
    .isString()
    .withMessage("Class/Section must be a string value")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("Class/Section is required")
    .isLength({ max: 50 })
    .withMessage("Class/Section must not exceed 50 characters"),

  body("phone")
    .isString()
    .withMessage("Phone number must be a string value")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("Phone number is required")
    .matches(/^[0-9+\-\s]{7,20}$/)
    .withMessage("Please enter a valid phone number"),

  body("pickupTime")
    .isString()
    .withMessage("Pickup time must be a string value")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("Pickup time is required")
    .matches(/^(0?[1-9]|1[0-2]):[0-5][0-9]\s?(AM|PM)$/i)
    .withMessage("Please enter a valid pickup time in the format HH:MM AM/PM"),

  body("note")
    .optional({ values: "null" })
    .isString()
    .withMessage("Note must be a string value")
    .bail()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Note must not exceed 500 characters"),

  body("items")
    .isArray({ min: 1 })
    .withMessage("At least one order item is required")
    .bail()
    .customSanitizer((items) =>
      Array.isArray(items)
        ? items.map((item) => ({
            ...item,
            menuItem: item?.menuItem ?? item?.MenuItem,
          }))
        : items
    )
    .custom((items) => {
      for (const item of items) {
        if (!item?.menuItem) {
          throw new Error("Each order item must include menuItem");
        }

        if (!mongoIdPattern.test(String(item.menuItem))) {
          throw new Error("Each menuItem must be a valid Mongo ID");
        }

        const quantity = Number(item.quantity);

        if (!Number.isInteger(quantity) || quantity < 1) {
          throw new Error("Each item quantity must be at least 1");
        }
      }

      return true;
    }),
];

const updatePreorderStatusValidation = [
  body("status")
    .isString()
    .withMessage("Status must be a string value")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("Status is required")
    .customSanitizer((value) => value.toLowerCase())
    .isIn(["pending", "preparing", "ready", "completed", "cancelled"])
    .withMessage(
      "Status must be one of: pending, preparing, ready, completed, cancelled"
    ),
];

export { createPreorderValidation, updatePreorderStatusValidation };
