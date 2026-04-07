import { useEffect, useState } from "react";
import { slugify } from "../../utils/formatters";

const createInitialFormData = (editingCategory) => ({
  name: editingCategory?.name || "",
  slug: editingCategory?.slug || "",
  description: editingCategory?.description || "",
  isActive: editingCategory?.isActive ?? true,
});

export default function CategoryForm({
  onSubmit,
  editingCategory,
  onCancelEdit,
  isSubmitting = false,
}) {
  const [formData, setFormData] = useState(() =>
    createInitialFormData(editingCategory)
  );
  const isEditing = Boolean(editingCategory);

  useEffect(() => {
    setFormData(createInitialFormData(editingCategory));
  }, [editingCategory]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
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
      setFormData(createInitialFormData());
    }
  };

  return (
    <div className="admin-card p-6 md:p-7">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-slate-400">
            Category Editor
          </p>
          <h2 className="mt-3 text-3xl font-extrabold text-slate-950">
            {isEditing ? "Refine Category" : "Create Category"}
          </h2>
          <p className="mt-2 text-sm leading-7 text-slate-600">
            Shape the public menu architecture so students can find items quickly
            and the admin team can manage sections confidently.
          </p>
        </div>

        {isEditing ? (
          <button type="button" onClick={onCancelEdit} className="ghost-button text-sm">
            Cancel
          </button>
        ) : null}
      </div>

      <div className="admin-muted-panel mt-6 space-y-3 px-5 py-5">
        <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-emerald-800">
          Structure Note
        </p>
        <p className="text-sm leading-7 text-slate-700">
          Category names automatically generate clean slugs, which keeps filters
          and menu URLs consistent across the website.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 grid gap-5">
        <div>
          <label className="field-label">Category name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleNameChange}
            placeholder="Snacks, Lunch, Drinks..."
            className="field-input"
            required
          />
          <p className="mt-2 text-xs text-slate-500">
            Use short, student-friendly labels like Snacks, Lunch, Drinks, or Bakery.
          </p>
        </div>

        <div>
          <label className="field-label">Slug</label>
          <input
            type="text"
            name="slug"
            value={formData.slug}
            onChange={handleChange}
            placeholder="snacks"
            className="field-input"
            required
          />
          <p className="mt-2 text-xs text-slate-500">
            This is the website-facing identifier used in filters and links.
          </p>
        </div>

        <div>
          <label className="field-label">Description</label>
          <textarea
            rows="4"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Briefly explain what belongs in this category."
            className="field-input"
          />
        </div>

        <div className="soft-panel space-y-3 px-5 py-5">
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-slate-400">
            Live Preview
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-[#eef8f1] px-4 py-2 text-sm font-semibold text-emerald-900">
              /menu?category={formData.slug || "new-category"}
            </span>
            <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">
              {formData.name || "Category Name"}
            </span>
          </div>
          <p className="text-sm leading-7 text-slate-600">
            {formData.description ||
              "Add a concise description to help the admin team keep menu content organized."}
          </p>
        </div>

        <label className="admin-muted-panel flex items-center gap-3 px-4 py-4 text-sm font-semibold text-slate-700">
          <input
            type="checkbox"
            name="isActive"
            checked={formData.isActive}
            onChange={handleChange}
            className="h-4 w-4 rounded border-slate-300"
          />
          Show this category on the public site
        </label>

        <button type="submit" disabled={isSubmitting} className="primary-button w-full justify-center">
          {isSubmitting
            ? isEditing
              ? "Updating..."
              : "Saving..."
            : isEditing
            ? "Update Category"
            : "Add Category"}
        </button>
      </form>
    </div>
  );
}
