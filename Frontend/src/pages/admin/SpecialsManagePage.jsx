import { useState } from "react";
import SpecialForm from "../../components/admin/SpecialForm";
import SpecialsTable from "../../components/admin/SpecialsTable";

const menuItems = [
  { id: 1, name: "Chicken Momo" },
  { id: 2, name: "Veg Chowmein" },
  { id: 3, name: "Fresh Juice" },
  { id: 4, name: "Combo Lunch Set" },
];

const initialSpecials = [
  {
    id: 1,
    title: "Student Combo Set",
    description: "A tasty combo with snack and drink for students.",
    menuItem: "Combo Lunch Set",
    specialPrice: 120,
    startDate: "2026-04-04",
    endDate: "2026-04-10",
    bannerImage:
      "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=400&q=80",
    isActive: true,
  },
  {
    id: 2,
    title: "Fresh Juice Deal",
    description: "Refreshing juice offer for school break.",
    menuItem: "Fresh Juice",
    specialPrice: 60,
    startDate: "2026-04-05",
    endDate: "2026-04-08",
    bannerImage:
      "https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?auto=format&fit=crop&w=400&q=80",
    isActive: false,
  },
];

export default function SpecialsManagePage() {
  const [specials, setSpecials] = useState(initialSpecials);
  const [editingSpecial, setEditingSpecial] = useState(null);

  const handleAddOrUpdateSpecial = (formData) => {
    if (editingSpecial) {
      setSpecials((prev) =>
        prev.map((special) =>
          special.id === editingSpecial.id ? { ...special, ...formData } : special
        )
      );
      setEditingSpecial(null);
      return;
    }

    const newSpecial = {
      id: Date.now(),
      ...formData,
    };

    setSpecials((prev) => [newSpecial, ...prev]);
  };

  const handleEditSpecial = (special) => {
    setEditingSpecial(special);
  };

  const handleDeleteSpecial = (id) => {
    setSpecials((prev) => prev.filter((special) => special.id !== id));

    if (editingSpecial?.id === id) {
      setEditingSpecial(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingSpecial(null);
  };

  const handleToggleActive = (id) => {
    setSpecials((prev) =>
      prev.map((special) =>
        special.id === id
          ? { ...special, isActive: !special.isActive }
          : special
      )
    );
  };

  return (
    <section className="space-y-8">
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <h1 className="text-3xl font-bold text-slate-900">Manage Specials</h1>
        <p className="mt-2 text-slate-600">
          Create, edit, and control special offers shown on the canteen website.
        </p>
      </div>

      <div className="grid gap-8 xl:grid-cols-5">
        <div className="xl:col-span-2">
          <SpecialForm
            key={editingSpecial?.id ?? "new-special"}
            onSubmit={handleAddOrUpdateSpecial}
            editingSpecial={editingSpecial}
            onCancelEdit={handleCancelEdit}
            menuItems={menuItems}
          />
        </div>

        <div className="xl:col-span-3">
          <SpecialsTable
            specials={specials}
            onEdit={handleEditSpecial}
            onDelete={handleDeleteSpecial}
            onToggleActive={handleToggleActive}
          />
        </div>
      </div>
    </section>
  );
}
