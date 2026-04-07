const emailPattern = /^\S+@\S+\.\S+$/;
const phonePattern = /^[0-9+\-\s]{7,20}$/;
const urlPattern = /^(https?:\/\/)?[\w.-]+\.[a-z]{2,}([/?#].*)?$/i;
const pickupTimePattern = /^(0?[1-9]|1[0-2]):[0-5][0-9]\s?(AM|PM)$/i;

export const validateEmail = (value) =>
  emailPattern.test(String(value).trim()) ? "" : "Please enter a valid email address.";

export const validatePassword = (value) =>
  String(value).length >= 8 ? "" : "Password must be at least 8 characters.";

export const validateName = (value, label = "Name") => {
  const trimmed = String(value ?? "").trim();

  if (trimmed.length < 2) return `${label} must be at least 2 characters.`;
  if (trimmed.length > 60) return `${label} must not exceed 60 characters.`;
  return "";
};

export const validateClassSection = (value) => {
  if (!value) return "";
  return String(value).trim().length <= 50
    ? ""
    : "Class / Section must not exceed 50 characters.";
};

export const validatePhone = (value, { required = false } = {}) => {
  const trimmed = String(value ?? "").trim();

  if (!trimmed) {
    return required ? "Phone number is required." : "";
  }

  return phonePattern.test(trimmed) ? "" : "Please enter a valid phone number.";
};

export const validateOptionalUrl = (value, label = "URL") => {
  const trimmed = String(value ?? "").trim();

  if (!trimmed) return "";
  return urlPattern.test(trimmed) ? "" : `Please enter a valid ${label.toLowerCase()}.`;
};

export const validatePickupTime = (value) =>
  pickupTimePattern.test(String(value).trim())
    ? ""
    : "Pickup time must use the format HH:MM AM/PM.";

export const validateLoginForm = ({ email, password }) => {
  const errors = [validateEmail(email), password ? "" : "Password is required."];
  return errors.filter(Boolean);
};

export const validateRegisterForm = (formData) => {
  const errors = [
    validateName(formData.name, "Name"),
    validateEmail(formData.email),
    validatePassword(formData.password),
    formData.password === formData.confirmPassword ? "" : "Passwords do not match.",
    validatePhone(formData.phone),
    validateClassSection(formData.classSection),
    validateOptionalUrl(formData.profileImage, "profile image URL"),
  ];

  return errors.filter(Boolean);
};

export const validateProfileForm = (formData) =>
  [
    validateName(formData.name, "Name"),
    validatePhone(formData.phone),
    validateClassSection(formData.classSection),
    validateOptionalUrl(formData.profileImage, "profile image URL"),
  ].filter(Boolean);

export const validatePasswordChangeForm = (formData) =>
  [
    formData.currentPassword ? "" : "Current password is required.",
    validatePassword(formData.newPassword),
    formData.newPassword === formData.confirmPassword
      ? ""
      : "New password and confirmation do not match.",
  ].filter(Boolean);

export const validatePreorderForm = ({ student, cart }) =>
  [
    validateName(student.studentName, "Student name"),
    student.classSection?.trim() ? validateClassSection(student.classSection) : "Class / Section is required.",
    validatePhone(student.phone, { required: true }),
    validatePickupTime(student.pickupTime),
    cart.length ? "" : "Add at least one item to the preorder.",
    String(student.note ?? "").length <= 500 ? "" : "Note must not exceed 500 characters.",
  ].filter(Boolean);

export const getFirstValidationError = (errors) => errors.find(Boolean) || "";
