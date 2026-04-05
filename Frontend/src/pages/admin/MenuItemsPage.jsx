import { useState } from "react";
import MenuItemForm from "../../components/admin/MenuItemForm";
import MenuItemsTable from "../../components/admin/MenuItemsTable";

const categories = [
  { id: 1, name: "Snacks" },
  { id: 2, name: "Drinks" },
  { id: 3, name: "Lunch" },
  { id: 4, name: "Combo" },
];

const initialItems = [
  {
    id: 1,
    name: "Chicken Momo",
    slug: "chicken-momo",
    description: "Steamed momo served hot and fresh.",
    price: 120,
    image:
      "https://images.unsplash.com/photo-1628294895950-9805252327bc?auto=format&fit=crop&w=400&q=80",
    category: "Snacks",
    isAvailable: true,
    isFeatured: true,
    isVeg: false,
    preparationTime: 12,
  },
  {
    id: 2,
    name: "Veg Chowmein",
    slug: "veg-chowmein",
    description: "Freshly cooked noodles with vegetables.",
    price: 90,
    image:
      "https://images.unsplash.com/photo-1617622141675-d3005b9067c5?auto=format&fit=crop&w=400&q=80",
    category: "Lunch",
    isAvailable: true,
    isFeatured: false,
    isVeg: true,
    preparationTime: 10,
  },
  {
    id: 3,
    name: "Fresh Juice",
    slug: "fresh-juice",
    description: "Refreshing juice for school breaks.",
    price: 70,
    image:
      "https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?auto=format&fit=crop&w=400&q=80",
    category: "Drinks",
    isAvailable: false,
    isFeatured: false,
    isVeg: true,
    preparationTime: 5,
  },
];

export default function MenuItemsPage() {
  const [items, setItems] = useState(initialItems);
  const [editingItem, setEditingItem] = useState(null);

  const handleAddOrUpdateItem = (formData) => {
    if (editingItem) {
      setItems((prev) =>
        prev.map((item) =>
          item.id === editingItem.id ? { ...item, ...formData } : item
        )
      );
      setEditingItem(null);
      return;
    }

    const newItem = {
      id: Date.now(),
      ...formData,
    };

    setItems((prev) => [newItem, ...prev]);
  };

  const handleEditItem = (item) => {
    setEditingItem(item);
  };

  const handleDeleteItem = (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));

    if (editingItem?.id === id) {
      setEditingItem(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingItem(null);
  };

  const handleToggleAvailability = (id) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, isAvailable: !item.isAvailable }
          : item
      )
    );
  };

  const handleToggleFeatured = (id) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, isFeatured: !item.isFeatured }
          : item
      )
    );
  };

  return (
    <section className="space-y-8">
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <h1 className="text-3xl font-bold text-slate-900">Manage Menu Items</h1>
        <p className="mt-2 text-slate-600">
          Create, edit, and control the food and drink items shown on the canteen website.
        </p>
      </div>

      <div className="grid gap-8 xl:grid-cols-5">
        <div className="xl:col-span-2">
          <MenuItemForm
            key={editingItem?.id ?? "new-menu-item"}
            onSubmit={handleAddOrUpdateItem}
            editingItem={editingItem}
            onCancelEdit={handleCancelEdit}
            categories={categories}
          />
        </div>

        <div className="xl:col-span-3">
          <MenuItemsTable
            items={items}
            onEdit={handleEditItem}
            onDelete={handleDeleteItem}
            onToggleAvailability={handleToggleAvailability}
            onToggleFeatured={handleToggleFeatured}
          />
        </div>
      </div>
    </section>
  );
}
