
import { useState } from "react";

const createInitialFormData = (editingSpecial, menuItems) => ({
  title: editingSpecial?.title || "",
  description: editingSpecial?.description || "",
  menuItem: editingSpecial?.menuItem || menuItems?.[0]?.name || "",
  specialPrice: editingSpecial?.specialPrice ?? "",
  startDate: editingSpecial?.startDate || "",
  endDate: editingSpecial?.endDate || "",
  bannerImage: editingSpecial?.bannerImage || "",
  isActive: editingSpecial?.isActive ?? true,
});

export default function SpecialForm({
  onSubmit,
  editingSpecial,
  onCancelEdit,
  menuItems,
}) {
  const [formData, setFormData] = useState(() =>
    createInitialFormData(editingSpecial, menuItems)
  );

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

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);

    if (!editingSpecial) {
      setFormData(createInitialFormData(null, menuItems));
    }
  };

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            {editingSpecial ? "Edit Special" : "Create New Special"}
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            {editingSpecial
              ? "Update the selected special offer."
              : "Create a new daily special or promotional offer."}
          </p>
        </div>

        {editingSpecial && (
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
            Special Title
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Example: Student Combo Set"
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
            placeholder="Write a short description for the offer"
            className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-green-600"
            required
          ></textarea>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Related Menu Item
            </label>
            <select
              name="menuItem"
              value={formData.menuItem}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-green-600"
              required
            >
              {menuItems.map((item) => (
                <option key={item.id} value={item.name}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Special Price (Rs.)
            </label>
            <input
              type="number"
              name="specialPrice"
              value={formData.specialPrice}
              onChange={handleChange}
              placeholder="Example: 120"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-green-600"
              min="0"
              required
            />
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Start Date
            </label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-green-600"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              End Date
            </label>
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-green-600"
              required
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Banner Image URL
          </label>
          <input
            type="text"
            name="bannerImage"
            value={formData.bannerImage}
            onChange={handleChange}
            placeholder="Paste banner image URL"
            className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-green-600"
            required
          />
        </div>

        <label className="flex items-center gap-3 text-sm font-medium text-slate-700">
          <input
            type="checkbox"
            name="isActive"
            checked={formData.isActive}
            onChange={handleChange}
            className="h-4 w-4 rounded border-slate-300"
          />
          Active Special
        </label>

        <button
          type="submit"
          className="rounded-xl bg-green-700 px-6 py-3 font-semibold text-white transition hover:bg-green-800"
        >
          {editingSpecial ? "Update Special" : "Create Special"}
        </button>
      </form>
    </div>
  );
}
