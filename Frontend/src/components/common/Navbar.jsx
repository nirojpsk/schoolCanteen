import { Link, NavLink } from "react-router-dom";
import { useState } from "react";
import { HiMenu, HiX } from "react-icons/hi";

const navLinks = [
    { name: "Home", path: "/" },
    { name: "Menu", path: "/menu" },
    { name: "Specials", path: "/specials" },
    { name: "Preorder", path: "/preorder" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
];

function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    const navLinkClass = ({ isActive }) => `transition-colors duration-200 ${isActive ? "text-green-700 font-semibold" : "text-slate-700 hover:text-green-700"}`;

    return (
        <header className="sticky top-0 z-50 bg-white/95 shadow-sm backdrop-blur-sm">
            <div className="bg-green-700 px-4 py-2 text-center text-sm text-white">
                Fresh and Hygenic meals for students every school day
            </div>
            <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 lg:px-8">
                <Link to="/" className="flex items-center gap-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-700 text-lg font-bold text-white">
                        M
                    </div>
                    <div>
                        <h1 className="text-lg font-bold text-slate-900">Mechi School Canteen</h1>
                        <p className="text-xs text-slate-500
                        ">Fresh  Affordable  Student-Friendly</p>
                    </div>
                </Link>

                <div className="hidden items-center gap-6 lg:flex">
                    {navLinks.map((link) => (
                        <NavLink key={link.path} to={link.path} className={navLinkClass}>
                            {link.name}
                        </NavLink>
                    ))}
                    <Link to="/admin/login" className="rounded-lg bg-amber-600 px-4 py-2 font-medium text-white transition hover:bg-green-400">
                        AdminLogin
                    </Link>
                </div>

                <button className="text-3xl text-slate-800 lg:hidden" onClick={() => setIsOpen(!isOpen)}>
                    {isOpen ? <HiX /> : <HiMenu />}
                </button>
            </nav>
            {isOpen && (
                <div className="border-t bg-white px-4 py-4 shadow-md lg:hidden">
                    <div className="flex flex-col gap-4">
                        {navLinks.map((link) => (
                            <NavLink key={link.path} to={link.path} className={navLinkClass} onClick={() => setIsOpen(false)}>
                                {link.name}
                            </NavLink>
                        ))}
                        <Link to="/admin/login" className="rounded-lg  bg-amber-600 px-4 py-2 text-center font-medium text-white transition hover:bg-green-400" onClick={() => setIsOpen(false)}>
                            Admin Login
                        </Link>
                    </div>
                </div>
            )}
        </header>
    )
}

export default Navbar;