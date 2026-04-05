import { useState } from "react";

const createInitialFormData = (editingItem, categories) => ({
  name: editingItem?.name || "",
  slug: editingItem?.slug || "",
  description: editingItem?.description || "",
  price: editingItem?.price ?? "",
  image: editingItem?.image || "",
  category: editingItem?.category || categories?.[0]?.name || "",
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
}) {
  const [formData, setFormData] = useState(() =>
    createInitialFormData(editingItem, categories)
  );

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

    if (!editingItem) {
      setFormData(createInitialFormData(null, categories));
    }
  };

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            {editingItem ? "Edit Menu Item" : "Add New Menu Item"}
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            {editingItem
              ? "Update the selected menu item."
              : "Create a new food or drink item for the canteen menu."}
          </p>
        </div>

        {editingItem && (
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
            Item Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleNameChange}
            placeholder="Example: Chicken Momo"
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
            placeholder="example: chicken-momo"
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
            placeholder="Short description about this item"
            className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-green-600"
            required
          ></textarea>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Price (Rs.)
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="Example: 120"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-green-600"
              min="0"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-green-600"
              required
            >
              {categories.map((category) => (
                <option key={category.id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Image URL
            </label>
            <input
              type="text"
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="Paste image URL"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-green-600"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Preparation Time (min)
            </label>
            <input
              type="number"
              name="preparationTime"
              value={formData.preparationTime}
              onChange={handleChange}
              placeholder="Example: 10"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-green-600"
              min="1"
              required
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="flex items-center gap-3 text-sm font-medium text-slate-700">
            <input
              type="checkbox"
              name="isAvailable"
              checked={formData.isAvailable}
              onChange={handleChange}
              className="h-4 w-4 rounded border-slate-300"
            />
            Available
          </label>

          <label className="flex items-center gap-3 text-sm font-medium text-slate-700">
            <input
              type="checkbox"
              name="isFeatured"
              checked={formData.isFeatured}
              onChange={handleChange}
              className="h-4 w-4 rounded border-slate-300"
            />
            Featured Item
          </label>

          <label className="flex items-center gap-3 text-sm font-medium text-slate-700">
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

          <label className="flex items-center gap-3 text-sm font-medium text-slate-700">
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

        <button
          type="submit"
          className="rounded-xl bg-green-700 px-6 py-3 font-semibold text-white transition hover:bg-green-800"
        >
          {editingItem ? "Update Menu Item" : "Add Menu Item"}
        </button>
      </form>
    </div>
  );
}
