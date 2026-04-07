import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { HiEye, HiEyeOff } from "react-icons/hi";
import { toast } from "react-toastify";
import { setCredentials } from "../../features/auth/authSlice";
import { siteConfig } from "../../constants/siteConfig";
import { useLoginMutation } from "../../services/authApiSlice";
import { getApiErrorMessage } from "../../utils/formatters";
import { getFirstValidationError, validateLoginForm } from "../../utils/validators";

const highlights = [
  {
    title: "Quick preordering",
    description: "Skip the lunch queue with saved student details and a faster reorder flow.",
  },
  {
    title: "Live menu updates",
    description: "Check current menu availability, specials, and pickup timing in one place.",
  },
  {
    title: "Student account access",
    description: "Keep your canteen profile ready for smooth daily ordering across the week.",
  },
];

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [formError, setFormError] = useState("");
  const [login, { isLoading }] = useLoginMutation();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormError("");
    setFormData((previous) => ({
      ...previous,
      [name]: value,
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

      const user = response?.data;

      if (!user) {
        toast.error("Login response was invalid.");
        return;
      }

      dispatch(setCredentials(user));
      toast.success(response?.message || "Login successful.");

      const fallbackPath = user.role === "admin" ? "/" : "/account";
      const nextPath =
        user.role === "admin"
          ? fallbackPath
          : typeof location.state?.from === "string"
          ? location.state.from
          : fallbackPath;

      navigate(nextPath, { replace: true });
    } catch (error) {
      const message = getApiErrorMessage(error, "Could not log in.");
      setFormError(message);
      toast.error(message);
    }
  };

  return (
    <section className="page-section pt-10">
      <div className="content-shell overflow-hidden rounded-[42px] border border-white/50 bg-white/92 shadow-[0_35px_80px_rgba(15,23,42,0.12)]">
        <div className="grid xl:grid-cols-[0.9fr_1.1fr]">
          <div className="bg-[linear-gradient(180deg,#064533_0%,#0c5d44_100%)] px-6 py-10 text-white md:px-10 xl:min-h-[760px] xl:px-12">
            <div className="flex h-full flex-col justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f6d99d] text-sm font-extrabold text-emerald-950">
                    {siteConfig.shortName}
                  </div>
                  <div>
                    <p className="text-2xl font-extrabold">{siteConfig.name}</p>
                    <p className="text-sm text-emerald-50/65">Student account access</p>
                  </div>
                </div>

                <span className="mt-10 inline-flex rounded-full bg-white/8 px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#ffc629]">
                  Welcome back
                </span>

                <h1 className="mt-6 max-w-md text-5xl font-extrabold leading-[0.98]">
                  Sign in and keep lunch simple.
                </h1>
                <p className="mt-6 max-w-lg text-base leading-8 text-emerald-50/78">
                  Access your saved student profile, streamline future preorders,
                  and move through the canteen with less daily friction.
                </p>

                <div className="mt-10 space-y-5">
                  {highlights.map((item, index) => (
                    <div key={item.title} className="rounded-[28px] border border-white/10 bg-white/6 p-4">
                      <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-emerald-100/45">
                        0{index + 1}
                      </p>
                      <h2 className="mt-3 text-xl font-extrabold text-white">{item.title}</h2>
                      <p className="mt-2 text-sm leading-7 text-emerald-50/70">
                        {item.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-10 rounded-[30px] bg-white/8 p-5">
                <p className="text-sm font-bold text-emerald-50/80">
                  "The fastest way to grab lunch between classes."
                </p>
                <p className="mt-3 text-xs font-extrabold uppercase tracking-[0.22em] text-emerald-100/45">
                  Student-friendly digital ordering
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white px-6 py-10 md:px-10 xl:px-14">
            <div className="mx-auto max-w-lg">
              <Link to="/" className="ghost-button px-0 text-sm">
                Back to homepage
              </Link>

              <p className="mt-8 text-sm font-extrabold uppercase tracking-[0.24em] text-emerald-700">
                Student Sign In
              </p>
              <h2 className="mt-4 text-4xl font-extrabold text-slate-950">Access your account</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Use your saved account details to make preordering quicker and keep
                your canteen profile ready every school day.
              </p>

              <div className="soft-panel mt-8 p-5">
                <p className="subtle-kicker">Account benefits</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="public-chip px-4 py-2 text-sm">Saved student details</span>
                  <span className="public-chip px-4 py-2 text-sm">Faster checkout</span>
                  <span className="public-chip px-4 py-2 text-sm">Cleaner pickup flow</span>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="mt-8 grid gap-5">
                {formError ? (
                  <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                    {formError}
                  </div>
                ) : null}

                <div>
                  <label className="field-label">Student email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@school.edu"
                    className="field-input"
                    autoComplete="email"
                    required
                  />
                </div>

                <div>
                  <label className="field-label">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter your password"
                      className="field-input pr-14"
                      autoComplete="current-password"
                      minLength="8"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((previous) => !previous)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <HiEyeOff className="text-xl" /> : <HiEye className="text-xl" />}
                    </button>
                  </div>
                </div>

                <button type="submit" disabled={isLoading} className="primary-button mt-2 w-full justify-center">
                  {isLoading ? "Signing in..." : "Sign In"}
                </button>
              </form>

              <p className="mt-6 text-sm text-slate-600">
                New student?{" "}
                <Link
                  to="/register"
                  state={location.state}
                  className="font-extrabold text-emerald-700 hover:text-emerald-800"
                >
                  Create an account
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
