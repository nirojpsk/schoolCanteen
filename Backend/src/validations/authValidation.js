import { body } from "express-validator";

const optionalTextField = (field, label) =>
  body(field)
    .optional({ values: "null" })
    .isString()
    .withMessage(`${label} must be a string value`)
    .bail()
    .trim();

const requiredNameValidation = () =>
  body("name")
    .isString()
    .withMessage("Name must be a string value")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 2, max: 60 })
    .withMessage("Name must be between 2 and 60 characters");

const requiredEmailValidation = () =>
  body("email")
    .isString()
    .withMessage("Email must be a string value")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please enter a valid email address");

const requiredPasswordValidation = () =>
  body("password")
    .isString()
    .withMessage("Password must be a string value")
    .bail()
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters");

const optionalProfileFieldValidations = () => [
  optionalTextField("phone", "Phone")
    .matches(/^[0-9+\-\s]{7,20}$/)
    .withMessage("Please enter a valid phone number"),

  optionalTextField("profileImage", "Profile image"),

  optionalTextField("classSection", "Class/Section")
    .isLength({ max: 50 })
    .withMessage("Class/Section must not exceed 50 characters"),
];

const loginValidation = [
  requiredEmailValidation(),

  body("password")
    .isString()
    .withMessage("Password must be a string value")
    .bail()
    .notEmpty()
    .withMessage("Password is required"),
];

const registerStudentValidation = [
  requiredNameValidation(),
  requiredEmailValidation(),
  requiredPasswordValidation(),
  ...optionalProfileFieldValidations(),
];

const createStaffOrAdminValidation = [
  requiredNameValidation(),
  requiredEmailValidation(),
  requiredPasswordValidation(),

  body("role")
    .isString()
    .withMessage("Role must be a string value")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("Role is required")
    .customSanitizer((value) => value.toLowerCase())
    .isIn(["staff", "admin"])
    .withMessage("Role must be either staff or admin"),

  ...optionalProfileFieldValidations(),
];

const changePasswordValidation = [
  body("currentPassword")
    .isString()
    .withMessage("Current password must be a string value")
    .bail()
    .notEmpty()
    .withMessage("Current password is required"),

  body("newPassword")
    .isString()
    .withMessage("New password must be a string value")
    .bail()
    .notEmpty()
    .withMessage("New password is required")
    .isLength({ min: 8 })
    .withMessage("New password must be at least 8 characters"),
];

const updateMyProfileValidation = [
  body("name")
    .optional()
    .isString()
    .withMessage("Name must be a string value")
    .bail()
    .trim()
    .isLength({ min: 2, max: 60 })
    .withMessage("Name must be between 2 and 60 characters"),

  ...optionalProfileFieldValidations(),
];
const updateUserStatusValidation = [
  body("isActive")
    .exists()
    .withMessage("isActive is required")
    .isBoolean()
    .withMessage("isActive must be a boolean value"),
];

export {
  loginValidation,
  registerStudentValidation,
  createStaffOrAdminValidation,
  changePasswordValidation,
  updateMyProfileValidation,
  updateUserStatusValidation,
};
