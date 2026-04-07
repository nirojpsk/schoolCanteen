import { Link, NavLink } from "react-router-dom";
import {
  HiOutlineViewGrid,
  HiOutlineCollection,
  HiOutlineClipboardList,
  HiOutlineStar,
  HiOutlineShoppingBag,
  HiOutlineUsers,
  HiOutlineArrowSmLeft,
} from "react-icons/hi";
import { siteConfig } from "../../constants/siteConfig";

const links = [
  { name: "Dashboard", path: "/admin/dashboard", icon: HiOutlineViewGrid },
  { name: "Categories", path: "/admin/categories", icon: HiOutlineCollection },
  { name: "Menu Items", path: "/admin/menu-items", icon: HiOutlineClipboardList },
  { name: "Specials", path: "/admin/specials", icon: HiOutlineStar },
  { name: "Orders", path: "/admin/orders", icon: HiOutlineShoppingBag },
  { name: "Users", path: "/admin/users", icon: HiOutlineUsers },
];

function AdminSidebar() {
  return (
    <aside className="h-full w-full border-b border-slate-200/70 bg-white/92 px-4 py-4 shadow-[18px_0_50px_rgba(13,33,23,0.06)] backdrop-blur lg:rounded-[32px] lg:border lg:px-5 lg:py-5">
      <div className="flex h-full flex-col">
        <div className="rounded-[28px] bg-[linear-gradient(135deg,#0b5a42_0%,#11704f_100%)] p-5 text-white">
          <p className="text-sm font-extrabold uppercase tracking-[0.24em] text-emerald-100/70">
            Mechi Admin
          </p>
          <h2 className="mt-3 text-3xl font-extrabold">{siteConfig.name}</h2>
          <p className="mt-2 text-sm leading-7 text-emerald-50/76">
            School operations for menu control, specials, and preorder workflow.
          </p>
        </div>

        <nav className="mt-5 grid gap-2">
          {links.map((link) => {
            const Icon = link.icon;

            return (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-extrabold transition ${
                    isActive
                      ? "bg-emerald-100 text-emerald-900 shadow-[0_10px_20px_rgba(18,114,82,0.08)]"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`
                }
              >
                <Icon className="text-xl" />
                <span>{link.name}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="mt-6 rounded-[28px] bg-[#eff6ef] p-4 text-sm leading-7 text-slate-600">
          Student orders from the public site land here in real time, so staff can work from one calm workspace.
        </div>

        <div className="mt-auto pt-6">
          <Link to="/" className="primary-button w-full justify-center">
            <HiOutlineArrowSmLeft className="text-lg" />
            Back To Homepage
          </Link>
        </div>
      </div>
    </aside>
  );
}

export default AdminSidebar;
