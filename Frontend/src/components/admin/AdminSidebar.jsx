import { NavLink } from "react-router-dom";
import {
  HiOutlineViewGrid,
  HiOutlineCollection,
  HiOutlineClipboardList,
  HiOutlineStar,
  HiOutlineShoppingBag,
} from "react-icons/hi";

const links = [
  {
    name: "Dashboard",
    path: "/admin/dashboard",
    icon: HiOutlineViewGrid,
  },
  {
    name: "Categories",
    path: "/admin/categories",
    icon: HiOutlineCollection,
  },
  {
    name: "Menu Items",
    path: "/admin/menu-items",
    icon: HiOutlineClipboardList,
  },
  {
    name: "Specials",
    path: "/admin/specials",
    icon: HiOutlineStar,
  },
  {
    name: "Orders",
    path: "/admin/orders",
    icon: HiOutlineShoppingBag,
  },
];

 function AdminSidebar() {
  return (
    <aside className="min-h-full w-full bg-slate-900 text-white lg:w-72">
      <div className="border-b border-slate-800 px-6 py-6">
        <h2 className="text-2xl font-bold">Canteen Admin</h2>
        <p className="mt-1 text-sm text-slate-400">
          Manage menu, specials, and orders
        </p>
      </div>

      <nav className="flex flex-col gap-2 p-4">
        {links.map((link) => {
          const Icon = link.icon;

          return (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                  isActive
                    ? "bg-green-700 text-white"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`
              }
            >
              <Icon className="text-xl" />
              <span>{link.name}</span>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}

export default AdminSidebar;