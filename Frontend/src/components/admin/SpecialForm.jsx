import { useEffect, useState } from "react";
import { toDateInputValue } from "../../utils/formatters";

const createInitialFormData = (editingSpecial, menuItems) => ({
  title: editingSpecial?.title || "",
  description: editingSpecial?.description || "",
  menuItem:
    editingSpecial?.menuItem?._id ||
    editingSpecial?.menuItem ||
    menuItems?.[0]?._id ||
    "",
  specialPrice: editingSpecial?.specialPrice ?? "",
  startDate: toDateInputValue(editingSpecial?.startDate),
  endDate: toDateInputValue(editingSpecial?.endDate),
  bannerImage: editingSpecial?.bannerImage || "",
  isActive: editingSpecial?.isActive ?? true,
});

export default function SpecialForm({
  onSubmit,
  editingSpecial,
  onCancelEdit,
  menuItems,
  isSubmitting = false,
}) {
  const [formData, setFormData] = useState(() =>
    createInitialFormData(editingSpecial, menuItems)
  );
  const isEditing = Boolean(editingSpecial);
  const hasMenuItems = menuItems.length > 0;
  const linkedMenuItem = menuItems.find((item) => item._id === formData.menuItem);
  const previewImage =
    formData.bannerImage ||
    linkedMenuItem?.image ||
    "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1200&q=80";

  useEffect(() => {
    setFormData(createInitialFormData(editingSpecial, menuItems));
  }, [editingSpecial, menuItems]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : name === "specialPrice"
          ? Number(value)
          : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSubmit(formData);

    if (!isEditing) {
      setFormData(createInitialFormData(null, menuItems));
    }
  };

  return (
    <div className="admin-card p-6 md:p-7">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-slate-400">
            Campaign Builder
          </p>
          <h2 className="mt-3 text-3xl font-extrabold text-slate-950">
            {isEditing ? "Refine Special" : "Create New Special"}
          </h2>
          <p className="mt-2 text-sm leading-7 text-slate-600">
            Launch timely offers that look premium on the homepage, specials
            listing, and admin dashboard.
          </p>
        </div>

        {isEditing ? (
          <button type="button" onClick={onCancelEdit} className="ghost-button text-sm">
            Cancel
          </button>
        ) : null}
      </div>

      {!hasMenuItems ? (
        <div className="admin-muted-panel mt-6 space-y-3 px-5 py-5">
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-emerald-800">
            Setup Required
          </p>
          <p className="text-sm leading-7 text-slate-700">
            Add at least one menu item first so specials can link back to a real
            product and price context.
          </p>
        </div>
      ) : null}

      <div className="soft-panel mt-6 grid gap-4 p-5">
        <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-slate-400">
          Promotion Preview
        </p>
        <div className="overflow-hidden rounded-[28px] bg-[linear-gradient(135deg,#0a4d39_0%,#0e6a4b_100%)] text-white shadow-[0_18px_36px_rgba(8,59,45,0.16)]">
          <div className="grid gap-5 p-5 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="space-y-3">
              <span className="inline-flex rounded-full bg-[#ffc629] px-3 py-1 text-xs font-extrabold uppercase tracking-[0.18em] text-emerald-950">
                {formData.isActive ? "Live Campaign" : "Draft Campaign"}
              </span>
              <h3 className="text-2xl font-extrabold leading-tight">
                {formData.title || "Special title preview"}
              </h3>
              <p className="text-sm leading-7 text-emerald-50/80">
                {formData.description ||
                  "Use a short, persuasive description so the offer feels exciting without becoming hard to scan."}
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-lg font-extrabold text-[#ffc629]">
                  Rs. {Number(formData.specialPrice || 0).toLocaleString("en-NP")}
                </span>
                <span className="text-sm font-semibold text-emerald-50/75">
                  {linkedMenuItem?.name || "Linked menu item"}
                </span>
              </div>
            </div>

            <img
              src={previewImage}
              alt={formData.title || "Special preview"}
              className="h-56 w-full rounded-[24px] object-cover"
            />
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 grid gap-6">
        <div>
          <label className="field-label">Special title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Example: Student Combo Set"
            className="field-input"
            required
          />
        </div>

        <div>
          <label className="field-label">Description</label>
          <textarea
            rows="4"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Write a short description for the offer"
            className="field-input"
            required
          />
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          <div className="soft-panel space-y-5 p-5">
            <div>
              <label className="field-label">Related menu item</label>
              <select
                name="menuItem"
                value={formData.menuItem}
                onChange={handleChange}
                className="field-input"
                required
                disabled={!hasMenuItems}
              >
                {hasMenuItems ? (
                  menuItems.map((item) => (
                    <option key={item._id} value={item._id}>
                      {item.name}
                    </option>
                  ))
                ) : (
                  <option value="">Create a menu item first</option>
                )}
              </select>
            </div>

            <div>
              <label className="field-label">Special price (Rs.)</label>
              <input
                type="number"
                name="specialPrice"
                value={formData.specialPrice}
                onChange={handleChange}
                placeholder="Example: 120"
                className="field-input"
                min="0"
                required
              />
            </div>
          </div>

          <div className="soft-panel space-y-5 p-5">
            <div>
              <label className="field-label">Start date</label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="field-input"
                required
              />
            </div>

            <div>
              <label className="field-label">End date</label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className="field-input"
                required
              />
            </div>
          </div>
        </div>

        <div>
          <label className="field-label">Banner image URL</label>
          <input
            type="text"
            name="bannerImage"
            value={formData.bannerImage}
            onChange={handleChange}
            placeholder="Paste banner image URL"
            className="field-input"
            required
          />
        </div>

        <label className="admin-muted-panel flex items-center gap-3 px-4 py-4 text-sm font-semibold text-slate-700">
          <input
            type="checkbox"
            name="isActive"
            checked={formData.isActive}
            onChange={handleChange}
            className="h-4 w-4 rounded border-slate-300"
          />
          Make this promotion live on the website
        </label>

        <button
          type="submit"
          disabled={isSubmitting || !hasMenuItems}
          className="primary-button w-full justify-center"
        >
          {isSubmitting
            ? isEditing
              ? "Updating..."
              : "Saving..."
            : isEditing
            ? "Update Special"
            : "Create Special"}
        </button>
      </form>
    </div>
  );
}
