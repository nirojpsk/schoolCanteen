import SectionTitle from "../../components/common/SectionTitle";
import FeaturedItemCard from "../../components/home/FeaturedItemCard";

const menuItems = [
  {
    id: 1,
    name: "Veg Chowmein",
    price: 90,
    category: "Lunch",
    isVeg: true,
    description: "Freshly cooked noodles with vegetables and flavourful seasoning.",
    image:
      "https://images.unsplash.com/photo-1617622141675-d3005b9067c5?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 2,
    name: "Chicken Momo",
    price: 120,
    category: "Snacks",
    isVeg: false,
    description: "Steamed momo served hot and perfect for school break time.",
    image:
      "https://images.unsplash.com/photo-1628294895950-9805252327bc?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 3,
    name: "Samosa",
    price: 25,
    category: "Snacks",
    isVeg: true,
    description: "Crispy snack item that is quick, filling, and affordable.",
    image:
      "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 4,
    name: "Tea",
    price: 20,
    category: "Drinks",
    isVeg: true,
    description: "Hot tea served fresh during school hours.",
    image:
      "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 5,
    name: "Fresh Juice",
    price: 70,
    category: "Drinks",
    isVeg: true,
    description: "Refreshing juice for a quick school break boost.",
    image:
      "https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 6,
    name: "Combo Lunch Set",
    price: 150,
    category: "Combo",
    isVeg: false,
    description: "A filling combo meal prepared for busy school days.",
    image:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80",
  },
];

export default function MenuPage() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
      <SectionTitle
        badge="Our Menu"
        title="Browse Meals, Snacks and Drinks"
        subtitle="Explore available food items from the school canteen."
      />

      <div className="mt-10 grid gap-4 rounded-2xl bg-white p-4 shadow-sm md:grid-cols-3">
        <input
          type="text"
          placeholder="Search food items..."
          className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-green-600"
        />

        <select className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-green-600">
          <option>All Categories</option>
          <option>Snacks</option>
          <option>Lunch</option>
          <option>Drinks</option>
          <option>Combo</option>
        </select>

        <select className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-green-600">
          <option>All Availability</option>
          <option>Available</option>
          <option>Out of Stock</option>
        </select>
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {menuItems.map((item) => (
          <FeaturedItemCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}