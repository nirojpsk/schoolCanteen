import { useState } from "react";

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
}) {
  const [formData, setFormData] = useState(() =>
    createInitialFormData(editingCategory)
  );

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
      slug: value
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, ""),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);

    if (!editingCategory) {
      setFormData(createInitialFormData());
    }
  };

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            {editingCategory ? "Edit Category" : "Add New Category"}
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            {editingCategory
              ? "Update the selected category details."
              : "Create a category for organizing menu items."}
          </p>
        </div>

        {editingCategory && (
          <button
            onClick={onCancelEdit}
            className="rounded-lg bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200"
          >
            Cancel
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="grid gap-5">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Category Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleNameChange}
            placeholder="Example: Snacks"
            className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-green-600"
            required
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Slug
          </label>
          <input
            type="text"
            name="slug"
            value={formData.slug}
            onChange={handleChange}
            placeholder="example: snacks"
            className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-green-600"
            required
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Description
          </label>
          <textarea
            rows="4"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Short description about this category"
            className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-green-600"
          ></textarea>
        </div>

        <label className="flex items-center gap-3 text-sm font-medium text-slate-700">
          <input
            type="checkbox"
            name="isActive"
            checked={formData.isActive}
            onChange={handleChange}
            className="h-4 w-4 rounded border-slate-300"
          />
          Active Category
        </label>

        <button
          type="submit"
          className="rounded-xl bg-green-700 px-6 py-3 font-semibold text-white transition hover:bg-green-800"
        >
          {editingCategory ? "Update Category" : "Add Category"}
        </button>
      </form>
    </div>
  );
}
