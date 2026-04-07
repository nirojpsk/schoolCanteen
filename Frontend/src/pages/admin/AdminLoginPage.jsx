import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { HiCollection, HiClipboardList, HiSparkles } from "react-icons/hi";
import { toast } from "react-toastify";
import { useLoginMutation, useLogoutMutation } from "../../services/authApiSlice";
import {
  clearCredentials,
  setCredentials,
} from "../../features/auth/authSlice";
import { getApiErrorMessage } from "../../utils/formatters";
import { getFirstValidationError, validateLoginForm } from "../../utils/validators";

const adminHighlights = [
  {
    icon: HiCollection,
    title: "Menu structure control",
    description: "Organize categories and keep the public menu easy to browse.",
  },
  {
    icon: HiSparkles,
    title: "Specials management",
    description: "Launch promotions that update the website without extra design work.",
  },
  {
    icon: HiClipboardList,
    title: "Order workflow",
    description: "Track preorder requests from pending to ready for pickup.",
  },
];

export default function AdminLoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [formError, setFormError] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userInfo = useSelector((state) => state.auth.userInfo);
  const [login, { isLoading }] = useLoginMutation();
  const [logout] = useLogoutMutation();

  if (userInfo?.role === "admin") {
    return <Navigate to="/" replace />;
  }

  const handleChange = (event) => {
    setFormError("");
    setFormData((previous) => ({
      ...previous,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationError = getFirstValidationError(validateLoginForm(formData));

    if (validationError) {
      setFormError(validationError);
      toast.error(validationError);
      return;
    }

    try {
      const response = await login({
        email: formData.email.trim(),
        password: formData.password,
      }).unwrap();
      const userData = response?.data;

      if (!userData) {
        toast.error("Login response was invalid.");
        return;
      }

      if (userData.role !== "admin") {
        dispatch(clearCredentials());
        await logout().unwrap().catch(() => {});
        toast.error("Only admin accounts can access this dashboard.");
        return;
      }

      dispatch(setCredentials(userData));
      toast.success(response?.message || "Login successful.");
      navigate("/", { replace: true });
    } catch (error) {
      const message = getApiErrorMessage(error, "Login failed.");
      setFormError(message);
      toast.error(message);
    }
  };

  return (
    <section className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="grid w-full max-w-6xl overflow-hidden rounded-[40px] border border-white/50 bg-white/92 shadow-[0_35px_80px_rgba(15,23,42,0.12)] xl:grid-cols-[0.92fr_1.08fr]">
        <div className="bg-[linear-gradient(180deg,#063f2f_0%,#0c5d44_100%)] px-6 py-10 text-white md:px-10 xl:min-h-[760px] xl:px-12">
          <div className="flex h-full flex-col justify-between">
            <div>
              <p className="text-sm font-extrabold uppercase tracking-[0.24em] text-[#f6d99d]">
                Mechi Admin
              </p>
              <h1 className="mt-6 max-w-md text-5xl font-extrabold leading-[0.98]">
                Manage the school canteen from one calm workspace
              </h1>
              <p className="mt-6 max-w-lg text-base leading-8 text-emerald-50/78">
                Keep categories, menu items, specials, and preorder activity aligned with the public site throughout the school day.
              </p>

              <div className="mt-10 space-y-5">
                {adminHighlights.map((item) => {
                  const Icon = item.icon;

                  return (
                    <div key={item.title} className="flex gap-4 rounded-[28px] border border-white/10 bg-white/6 p-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/10 text-[#f6d99d]">
                        <Icon className="text-lg" />
                      </div>
                      <div>
                        <h2 className="text-xl font-extrabold text-white">{item.title}</h2>
                        <p className="mt-2 text-sm leading-7 text-emerald-50/70">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-10 rounded-[30px] bg-white/8 p-5 text-sm leading-7 text-emerald-50/75">
              After sign in, you&apos;ll return to the public website and can open the admin workspace from the header whenever needed.
            </div>
          </div>
        </div>

        <div className="bg-white px-6 py-10 md:px-10 xl:px-14">
          <div className="mx-auto max-w-lg">
            <p className="text-sm font-extrabold uppercase tracking-[0.24em] text-emerald-700">
              Secure Login
            </p>
            <h2 className="mt-4 text-4xl font-extrabold text-slate-950">Admin sign in</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Use an admin email and password from the backend user system. Only users with the admin role can reach the dashboard.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 grid gap-5">
              {formError ? (
                <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                  {formError}
                </div>
              ) : null}

              <div>
                <label className="mb-2 block text-xs font-extrabold uppercase tracking-[0.18em] text-slate-400">
                  Admin Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="admin@school.edu"
                  className="field-input"
                  autoComplete="email"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-extrabold uppercase tracking-[0.18em] text-slate-400">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="field-input"
                  autoComplete="current-password"
                  minLength="8"
                  required
                />
              </div>

              <button type="submit" disabled={isLoading} className="primary-button mt-2 w-full">
                {isLoading ? "Signing in..." : "Login To Dashboard"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
