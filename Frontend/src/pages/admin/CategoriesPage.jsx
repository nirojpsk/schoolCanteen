import { useState } from "react";
import CategoryForm from "../../components/admin/CategoryForm";
import CategoriesTable from "../../components/admin/CategoriesTable";

const initialCategories = [
  {
    id: 1,
    name: "Snacks",
    slug: "snacks",
    description: "Quick and tasty snack items for students.",
    isActive: true,
  },
  {
    id: 2,
    name: "Drinks",
    slug: "drinks",
    description: "Hot and cold beverages available in the canteen.",
    isActive: true,
  },
  {
    id: 3,
    name: "Lunch",
    slug: "lunch",
    description: "Filling meals for regular lunch service.",
    isActive: true,
  },
];

export default function CategoriesPage() {
  const [categories, setCategories] = useState(initialCategories);
  const [editingCategory, setEditingCategory] = useState(null);

  const handleAddOrUpdateCategory = (formData) => {
    if (editingCategory) {
      setCategories((prev) =>
        prev.map((category) =>
          category.id === editingCategory.id
            ? { ...category, ...formData }
            : category
        )
      );
      setEditingCategory(null);
      return;
    }

    const newCategory = {
      id: Date.now(),
      ...formData,
    };

    setCategories((prev) => [newCategory, ...prev]);
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
  };

  const handleDeleteCategory = (id) => {
    setCategories((prev) => prev.filter((category) => category.id !== id));

    if (editingCategory?.id === id) {
      setEditingCategory(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingCategory(null);
  };

  return (
    <section className="space-y-8">
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <h1 className="text-3xl font-bold text-slate-900">Manage Categories</h1>
        <p className="mt-2 text-slate-600">
          Create, edit, and organize menu categories for the canteen.
        </p>
      </div>

      <div className="grid gap-8 xl:grid-cols-5">
        <div className="xl:col-span-2">
          <CategoryForm
            key={editingCategory?.id ?? "new-category"}
            onSubmit={handleAddOrUpdateCategory}
            editingCategory={editingCategory}
            onCancelEdit={handleCancelEdit}
          />
        </div>

        <div className="xl:col-span-3">
          <CategoriesTable
            categories={categories}
            onEdit={handleEditCategory}
            onDelete={handleDeleteCategory}
          />
        </div>
      </div>
    </section>
  );
}
