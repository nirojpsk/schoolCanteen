import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { HiChevronDown, HiMenu, HiX } from "react-icons/hi";
import { toast } from "react-toastify";
import { clearCredentials } from "../../features/auth/authSlice";
import { siteConfig } from "../../constants/siteConfig";
import { apiSlice } from "../../services/apiSlice";
import { useLogoutMutation } from "../../services/authApiSlice";
import { getApiErrorMessage } from "../../utils/formatters";

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
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userInfo = useSelector((state) => state.auth.userInfo);
  const [logout, { isLoading }] = useLogoutMutation();
  const accountMenuRef = useRef(null);

  useEffect(() => {
    if (!isAccountMenuOpen) {
      return undefined;
    }

    const handlePointerDown = (event) => {
      if (
        accountMenuRef.current &&
        !accountMenuRef.current.contains(event.target)
      ) {
        setIsAccountMenuOpen(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsAccountMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isAccountMenuOpen]);

  const closeMenus = () => {
    setIsOpen(false);
    setIsAccountMenuOpen(false);
  };

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      dispatch(clearCredentials());
      dispatch(apiSlice.util.resetApiState());
      closeMenus();
      toast.success("Logged out successfully.");
      navigate("/", { replace: true });
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Could not log out."));
    }
  };

  const isAdmin = userInfo?.role === "admin";
  const accountPath = isAdmin ? "/admin/dashboard" : "/account#profile-details";
  const initials =
    userInfo?.name
      ?.split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") ||
    userInfo?.email?.charAt(0)?.toUpperCase() ||
    "U";

  const desktopNavLink = ({ isActive }) =>
    `rounded-full px-4 py-3 text-sm font-extrabold transition ${
      isActive
        ? "bg-white text-emerald-950 shadow-[0_14px_30px_rgba(255,255,255,0.15)]"
        : "text-white/74 hover:bg-white/8 hover:text-white"
    }`;

  const mobileNavLink = ({ isActive }) =>
    `rounded-[22px] px-4 py-3 text-sm font-extrabold transition ${
      isActive
        ? "bg-emerald-50 text-emerald-900"
        : "text-slate-700 hover:bg-slate-50 hover:text-slate-950"
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-emerald-950/12 bg-[rgba(7,67,49,0.9)] shadow-[0_18px_45px_rgba(6,32,24,0.2)] backdrop-blur-2xl">
      <div className="hidden border-b border-white/8 lg:block">
        <div className="content-shell flex items-center justify-between gap-6 py-3">
          <div className="text-xs font-semibold text-white/70">{siteConfig.slogan}</div>
          <div className="text-xs font-semibold text-white/70">
            Lunch window: {siteConfig.hours.lunch}
          </div>
        </div>
      </div>

      <nav className="content-shell flex items-center justify-between gap-4 py-4">
        <Link to="/" className="flex min-w-0 items-center gap-3" onClick={closeMenus}>
          <img
            src={siteConfig.logoPath}
            alt={`${siteConfig.name} logo`}
            className="h-12 w-12 shrink-0 rounded-full border border-white/10 bg-white/90 object-cover shadow-[0_16px_30px_rgba(246,217,157,0.2)]"
          />
          <div className="min-w-0">
            <p className="truncate text-xl font-extrabold text-white">{siteConfig.name}</p>
            <p className="mt-0.5 truncate text-[11px] font-semibold uppercase tracking-[0.18em] text-white/48">
              Modern school canteen ordering
            </p>
          </div>
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={desktopNavLink}
              onClick={() => setIsAccountMenuOpen(false)}
            >
              {link.name}
            </NavLink>
          ))}
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          {userInfo ? (
            isAdmin ? (
              <>
                <div className="rounded-full border border-white/10 bg-white/7 px-4 py-2.5 text-right">
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-white/45">
                    Admin Access
                  </p>
                  <p className="mt-1 text-sm font-semibold text-white">
                    {userInfo.name || userInfo.email}
                  </p>
                </div>
                <Link
                  to={accountPath}
                  className="primary-button px-5 py-3 text-sm"
                  onClick={() => setIsAccountMenuOpen(false)}
                >
                  Admin Dashboard
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={isLoading}
                  className="rounded-full px-4 py-3 text-sm font-extrabold text-white/72 hover:bg-white/8 hover:text-white"
                >
                  {isLoading ? "Logging out..." : "Logout"}
                </button>
              </>
            ) : (
              <div className="relative" ref={accountMenuRef}>
                <button
                  type="button"
                  onClick={() => setIsAccountMenuOpen((previous) => !previous)}
                  className="flex items-center gap-2 rounded-full border border-white/10 bg-white/7 p-1.5 pr-3 hover:bg-white/10"
                  aria-haspopup="menu"
                  aria-expanded={isAccountMenuOpen}
                  aria-label="Open student menu"
                >
                  {userInfo.profileImage ? (
                    <img
                      src={userInfo.profileImage}
                      alt={userInfo.name || "Student profile"}
                      className="h-11 w-11 rounded-full object-cover ring-2 ring-white/10"
                    />
                  ) : (
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/12 text-sm font-extrabold text-white ring-2 ring-white/10">
                      {initials}
                    </div>
                  )}
                  <HiChevronDown
                    className={`text-lg text-white/72 transition ${isAccountMenuOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {isAccountMenuOpen ? (
                  <div className="absolute right-0 mt-3 w-72 overflow-hidden rounded-[28px] border border-slate-100 bg-white p-3 shadow-[0_28px_50px_rgba(15,23,42,0.16)]">
                    <div className="rounded-[22px] bg-[#f7faf8] p-4">
                      <div className="flex items-center gap-3">
                        {userInfo.profileImage ? (
                          <img
                            src={userInfo.profileImage}
                            alt={userInfo.name || "Student profile"}
                            className="h-12 w-12 rounded-full object-cover"
                          />
                        ) : (
                          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-sm font-extrabold text-emerald-900">
                            {initials}
                          </div>
                        )}

                        <div className="min-w-0">
                          <p className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-slate-400">
                            Student Account
                          </p>
                          <p className="mt-1 truncate text-base font-extrabold text-slate-950">
                            {userInfo.name || "Student"}
                          </p>
                          <p className="mt-1 truncate text-sm text-slate-500">
                            {userInfo.email}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 grid gap-2">
                      <Link
                        to="/account#profile-details"
                        className="rounded-[20px] px-4 py-3 text-sm font-extrabold text-slate-700 hover:bg-slate-50 hover:text-slate-950"
                        onClick={() => setIsAccountMenuOpen(false)}
                      >
                        Profile Details
                      </Link>

                      <button
                        type="button"
                        onClick={handleLogout}
                        disabled={isLoading}
                        className="rounded-[20px] px-4 py-3 text-left text-sm font-extrabold text-slate-700 hover:bg-slate-50 hover:text-slate-950 disabled:opacity-70"
                      >
                        {isLoading ? "Logging out..." : "Logout"}
                      </button>
                    </div>
                  </div>
                ) : null}
              </div>
            )
          ) : (
            <>
              <Link
                to="/login"
                className="rounded-full border border-white/16 bg-white/8 px-5 py-3 text-sm font-extrabold text-white transition hover:bg-white/12"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="secondary-button border-white/12 bg-white px-5 py-3 text-sm text-emerald-950"
              >
                Create Account
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/8 text-3xl text-white lg:hidden"
          onClick={() => setIsOpen((previous) => !previous)}
          aria-label="Toggle navigation"
        >
          {isOpen ? <HiX /> : <HiMenu />}
        </button>
      </nav>

      {isOpen ? (
        <div className="border-t border-white/10 bg-white px-4 py-4 shadow-2xl lg:hidden">
          <div className="content-shell flex flex-col gap-3">
            <div className="overflow-hidden rounded-[28px] bg-[linear-gradient(135deg,#0b5a42_0%,#116d4d_100%)] p-5 text-white shadow-[0_20px_45px_rgba(7,49,36,0.18)]">
              <p className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-[#ffc629]">
                Student Friendly Flow
              </p>
              <h2 className="mt-3 text-2xl font-extrabold">
                Browse, preorder, and collect lunch faster.
              </h2>
              <p className="mt-3 text-sm leading-7 text-emerald-50/76">
                The public site stays connected to live menu availability, specials, and your saved student account.
              </p>
            </div>

            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={mobileNavLink}
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </NavLink>
            ))}

            <div className="mt-2 rounded-[28px] border border-slate-100 bg-slate-50 p-4">
              {userInfo ? (
                isAdmin ? (
                  <div className="space-y-3">
                    <div>
                      <p className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-slate-400">
                        Admin Session
                      </p>
                      <p className="mt-1 text-sm font-semibold text-slate-900">
                        {userInfo.name || userInfo.email}
                      </p>
                    </div>
                    <Link
                      to={accountPath}
                      className="primary-button w-full justify-center text-sm"
                      onClick={() => setIsOpen(false)}
                    >
                      Admin Dashboard
                    </Link>
                    <button
                      type="button"
                      onClick={handleLogout}
                      disabled={isLoading}
                      className="secondary-button w-full justify-center text-sm"
                    >
                      {isLoading ? "Logging out..." : "Logout"}
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 rounded-[22px] bg-white px-4 py-4">
                      {userInfo.profileImage ? (
                        <img
                          src={userInfo.profileImage}
                          alt={userInfo.name || "Student profile"}
                          className="h-12 w-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-sm font-extrabold text-emerald-900">
                          {initials}
                        </div>
                      )}

                      <div className="min-w-0">
                        <p className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-slate-400">
                          Student Session
                        </p>
                        <p className="mt-1 truncate text-sm font-semibold text-slate-900">
                          {userInfo.name || userInfo.email}
                        </p>
                      </div>
                    </div>

                    <Link
                      to="/account#profile-details"
                      className="rounded-full border border-slate-200 bg-white px-4 py-3 text-center text-sm font-extrabold text-slate-700"
                      onClick={() => setIsOpen(false)}
                    >
                      Profile Details
                    </Link>
                    <button
                      type="button"
                      onClick={handleLogout}
                      disabled={isLoading}
                      className="secondary-button w-full justify-center text-sm"
                    >
                      {isLoading ? "Logging out..." : "Logout"}
                    </button>
                  </div>
                )
              ) : (
                <div className="space-y-3">
                  <p className="text-sm leading-7 text-slate-600">
                    Sign in or create an account to save your student details and move through lunch pickup more smoothly.
                  </p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Link
                      to="/login"
                      className="rounded-full border border-slate-200 bg-white px-4 py-3 text-center text-sm font-extrabold text-slate-700"
                      onClick={() => setIsOpen(false)}
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/register"
                      className="primary-button w-full justify-center text-sm"
                      onClick={() => setIsOpen(false)}
                    >
                      Create Account
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}

export default Navbar;
