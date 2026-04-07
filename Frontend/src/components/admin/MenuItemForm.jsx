import { useEffect, useState } from "react";
import { slugify } from "../../utils/formatters";

const createInitialFormData = (editingItem, categories) => ({
  name: editingItem?.name || "",
  slug: editingItem?.slug || "",
  description: editingItem?.description || "",
  price: editingItem?.price ?? "",
  image: editingItem?.image || "",
  category:
    editingItem?.category?._id ||
    editingItem?.category ||
    categories?.[0]?._id ||
    "",
  isAvailable: editingItem?.isAvailable ?? true,
  isFeatured: editingItem?.isFeatured ?? false,
  isVeg: editingItem?.isVeg ?? true,
  preparationTime: editingItem?.preparationTime ?? 10,
});

export default function MenuItemForm({
  onSubmit,
  editingItem,
  onCancelEdit,
  categories,
  isSubmitting = false,
}) {
  const [formData, setFormData] = useState(() =>
    createInitialFormData(editingItem, categories)
  );
  const isEditing = Boolean(editingItem);
  const hasCategories = categories.length > 0;
  const previewImage =
    formData.image ||
    "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=80";

  useEffect(() => {
    setFormData(createInitialFormData(editingItem, categories));
  }, [categories, editingItem]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : name === "price" || name === "preparationTime"
          ? Number(value)
          : value,
    }));
  };

  const handleNameChange = (e) => {
    const value = e.target.value;

    setFormData((prev) => ({
      ...prev,
      name: value,
      slug: slugify(value),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSubmit(formData);

    if (!isEditing) {
      setFormData(createInitialFormData(null, categories));
    }
  };

  return (
    <div className="admin-card p-6 md:p-7">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-slate-400">
            Menu Composer
          </p>
          <h2 className="mt-3 text-3xl font-extrabold text-slate-950">
            {isEditing ? "Refine Menu Item" : "Add New Menu Item"}
          </h2>
          <p className="mt-2 text-sm leading-7 text-slate-600">
            Create polished menu cards with the right pricing, dietary tag, and
            availability so the public site always feels fresh.
          </p>
        </div>

        {isEditing ? (
          <button type="button" onClick={onCancelEdit} className="ghost-button text-sm">
            Cancel
          </button>
        ) : null}
      </div>

      {!hasCategories ? (
        <div className="admin-muted-panel mt-6 space-y-3 px-5 py-5">
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-emerald-800">
            Setup Required
          </p>
          <p className="text-sm leading-7 text-slate-700">
            Create at least one category before adding menu items so each product
            has a clear place on the public menu.
          </p>
        </div>
      ) : null}

      <div className="soft-panel mt-6 grid gap-4 p-5">
        <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-slate-400">
          Card Preview
        </p>
        <div className="grid gap-4 lg:grid-cols-[120px_1fr]">
          <img
            src={previewImage}
            alt={formData.name || "Menu preview"}
            className="h-28 w-full rounded-[24px] object-cover shadow-[0_18px_30px_rgba(15,23,42,0.12)] lg:w-28"
          />
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-[#eef8f1] px-3 py-1 text-xs font-extrabold uppercase tracking-[0.16em] text-emerald-900">
                {formData.isAvailable ? "Available" : "Hidden"}
              </span>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-extrabold uppercase tracking-[0.16em] text-slate-700">
                {formData.isVeg ? "Veg" : "Non-Veg"}
              </span>
              {formData.isFeatured ? (
                <span className="rounded-full bg-[#fff8ea] px-3 py-1 text-xs font-extrabold uppercase tracking-[0.16em] text-amber-800">
                  Featured
                </span>
              ) : null}
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-slate-950">
                {formData.name || "Menu item title"}
              </h3>
              <p className="mt-2 text-sm leading-7 text-slate-600">
                {formData.description ||
                  "Add a clear description so students instantly understand the dish and why they should choose it."}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-lg font-extrabold text-emerald-900">
                Rs. {Number(formData.price || 0).toLocaleString("en-NP")}
              </span>
              <span className="text-sm font-semibold text-slate-500">
                {formData.preparationTime || 0} min prep
              </span>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 grid gap-6">
        <div>
          <label className="field-label">Item name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleNameChange}
            placeholder="Example: Chicken Momo"
            className="field-input"
            required
          />
          <p className="mt-2 text-xs text-slate-500">
            Use appetizing, readable names that work well on cards and in preorder summaries.
          </p>
        </div>

        <div>
          <label className="field-label">Slug</label>
          <input
            type="text"
            name="slug"
            value={formData.slug}
            onChange={handleChange}
            placeholder="example: chicken-momo"
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
            placeholder="Short description about this item"
            className="field-input"
            required
          />
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          <div className="soft-panel space-y-5 p-5">
            <div>
              <label className="field-label">Price (Rs.)</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="Example: 120"
                className="field-input"
                min="0"
                required
              />
            </div>

            <div>
              <label className="field-label">Preparation time</label>
              <input
                type="number"
                name="preparationTime"
                value={formData.preparationTime}
                onChange={handleChange}
                placeholder="Example: 10"
                className="field-input"
                min="1"
                required
              />
            </div>
          </div>

          <div className="soft-panel space-y-5 p-5">
            <div>
              <label className="field-label">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="field-input"
                required
                disabled={!hasCategories}
              >
                {hasCategories ? (
                  categories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))
                ) : (
                  <option value="">Create a category first</option>
                )}
              </select>
            </div>

            <div>
              <label className="field-label">Image URL</label>
              <input
                type="text"
                name="image"
                value={formData.image}
                onChange={handleChange}
                placeholder="Paste image URL"
                className="field-input"
                required
              />
            </div>
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          <label className="admin-muted-panel flex items-center gap-3 px-4 py-4 text-sm font-semibold text-slate-700">
            <input
              type="checkbox"
              name="isAvailable"
              checked={formData.isAvailable}
              onChange={handleChange}
              className="h-4 w-4 rounded border-slate-300"
            />
            Show this item as available for ordering
          </label>

          <label className="admin-muted-panel flex items-center gap-3 px-4 py-4 text-sm font-semibold text-slate-700">
            <input
              type="checkbox"
              name="isFeatured"
              checked={formData.isFeatured}
              onChange={handleChange}
              className="h-4 w-4 rounded border-slate-300"
            />
            Feature this item on highlighted sections
          </label>
        </div>

        <div className="soft-panel space-y-4 p-5">
          <div>
            <p className="field-label">Dietary preference</p>
            <p className="mt-2 text-xs text-slate-500">
              This affects the badge shown on public menu cards and helps students filter quickly.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="admin-muted-panel flex items-center gap-3 px-4 py-4 text-sm font-semibold text-slate-700">
              <input
                type="radio"
                name="isVeg"
                checked={formData.isVeg === true}
                onChange={() =>
                  setFormData((prev) => ({ ...prev, isVeg: true }))
                }
                className="h-4 w-4 border-slate-300"
              />
              Veg
            </label>

            <label className="admin-muted-panel flex items-center gap-3 px-4 py-4 text-sm font-semibold text-slate-700">
              <input
                type="radio"
                name="isVeg"
                checked={formData.isVeg === false}
                onChange={() =>
                  setFormData((prev) => ({ ...prev, isVeg: false }))
                }
                className="h-4 w-4 border-slate-300"
              />
              Non-Veg
            </label>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting || !hasCategories}
          className="primary-button w-full justify-center"
        >
          {isSubmitting
            ? isEditing
              ? "Updating..."
              : "Saving..."
            : isEditing
            ? "Update Menu Item"
            : "Add Menu Item"}
        </button>
      </form>
    </div>
  );
}
