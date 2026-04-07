export const formatCurrency = (value) => {
  const amount = Number(value ?? 0);
  return `Rs. ${amount.toLocaleString("en-NP", {
    maximumFractionDigits: 0,
  })}`;
};

export const formatStatus = (value = "") =>
  value
    .split("-")
    .join(" ")
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

export const formatDate = (value, options) => {
  if (!value) return "N/A";

  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    return "N/A";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    ...options,
  }).format(parsed);
};

export const formatDateTime = (value) =>
  formatDate(value, {
    hour: "numeric",
    minute: "2-digit",
  });

export const formatDateRange = (startDate, endDate) => {
  if (!startDate || !endDate) return "Date not available";

  return `${formatDate(startDate, {
    month: "short",
    day: "numeric",
  })} - ${formatDate(endDate)}`;
};

export const slugify = (value = "") =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

export const getApiErrorMessage = (
  error,
  fallback = "Something went wrong. Please try again."
) => {
  if (error?.status === "TIMEOUT_ERROR") {
    return "The request took too long. Please try again.";
  }

  if (error?.status === "FETCH_ERROR") {
    return "Could not reach the server. Please check your connection.";
  }

  return (
    error?.data?.message ||
    error?.error ||
    error?.message ||
    fallback
  );
};

export const isSpecialRunning = (special, now = new Date()) => {
  if (!special) return false;

  const start = new Date(special.startDate);
  const end = new Date(special.endDate);

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return false;
  }

  return Boolean(special.isActive) && start <= now && end >= now;
};

export const getDiscountAmount = (special) => {
  const menuPrice = Number(special?.menuItem?.price ?? 0);
  const specialPrice = Number(special?.specialPrice ?? 0);
  return Math.max(menuPrice - specialPrice, 0);
};

export const getDiscountPercent = (special) => {
  const menuPrice = Number(special?.menuItem?.price ?? 0);
  const savings = getDiscountAmount(special);

  if (!menuPrice) return 0;

  return Math.round((savings / menuPrice) * 100);
};

export const buildPickupSlots = ({
  startHour = 9,
  endHour = 16,
  intervalMinutes = 15,
} = {}) => {
  const slots = [];

  for (let totalMinutes = startHour * 60; totalMinutes <= endHour * 60; totalMinutes += intervalMinutes) {
    const hours24 = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    const suffix = hours24 >= 12 ? "PM" : "AM";
    const hours12 = hours24 % 12 || 12;
    const minuteLabel = String(minutes).padStart(2, "0");
    slots.push(`${hours12}:${minuteLabel} ${suffix}`);
  }

  return slots;
};

export const toDateInputValue = (value) => {
  if (!value) return "";

  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) return "";

  return parsed.toISOString().split("T")[0];
};
