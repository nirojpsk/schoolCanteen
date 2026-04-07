import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  HiCamera,
  HiEye,
  HiEyeOff,
} from "react-icons/hi";
import { toast } from "react-toastify";
import { setCredentials } from "../../features/auth/authSlice";
import { siteConfig } from "../../constants/siteConfig";
import { useRegisterStudentMutation } from "../../services/authApiSlice";
import { getApiErrorMessage } from "../../utils/formatters";
import { getFirstValidationError, validateRegisterForm } from "../../utils/validators";

const benefits = [
  {
    title: "Quick preordering",
    description: "Skip the long lunch queues with saved student details and faster checkout.",
  },
  {
    title: "Live menu updates",
    description: "See availability and specials in real time from the canteen dashboard.",
  },
  {
    title: "Student rewards",
    description: "Stay ready for future loyalty features and daily school specials.",
  },
];

const classSuggestions = [
  "Grade 8 - A",
  "Grade 9 - B",
  "Grade 10 - A",
  "Grade 11 - Science",
];

export default function RegisterPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    classSection: "",
    profileImage: "",
  });
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [formError, setFormError] = useState("");
  const [registerStudent, { isLoading }] = useRegisterStudentMutation();

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
    const validationError = getFirstValidationError(validateRegisterForm(formData));

    if (validationError) {
      setFormError(validationError);
      toast.error(validationError);
      return;
    }

    if (!acceptedTerms) {
      const message = "Please agree to the terms before creating an account.";
      setFormError(message);
      toast.error(message);
      return;
    }

    try {
      const response = await registerStudent({
        name: formData.name,
        email: formData.email.trim(),
        password: formData.password,
        phone: formData.phone,
        classSection: formData.classSection,
        profileImage: formData.profileImage,
      }).unwrap();

      const user = response?.data;

      if (!user) {
        toast.error("Registration response was invalid.");
        return;
      }

      dispatch(setCredentials(user));
      toast.success(response?.message || "Student account created.");
      const nextPath =
        typeof location.state?.from === "string" ? location.state.from : "/account";
      navigate(nextPath, { replace: true });
    } catch (error) {
      const message = getApiErrorMessage(error, "Could not create account.");
      setFormError(message);
      toast.error(message);
    }
  };

  return (
    <section className="page-section pt-10">
      <div className="content-shell overflow-hidden rounded-[42px] border border-white/50 bg-white/92 shadow-[0_35px_80px_rgba(15,23,42,0.12)]">
        <div className="grid xl:grid-cols-[0.9fr_1.1fr]">
          <div className="bg-[linear-gradient(180deg,#064533_0%,#0c5d44_100%)] px-6 py-10 text-white md:px-10 xl:min-h-[820px] xl:px-12">
            <div className="flex h-full flex-col justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f6d99d] text-sm font-extrabold text-emerald-950">
                    {siteConfig.shortName}
                  </div>
                  <div>
                    <p className="text-2xl font-extrabold">{siteConfig.name}</p>
                    <p className="text-sm text-emerald-50/65">Student onboarding</p>
                  </div>
                </div>

                <span className="mt-10 inline-flex rounded-full bg-white/8 px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#ffc629]">
                  Create your account
                </span>

                <h1 className="mt-6 max-w-md text-5xl font-extrabold leading-[0.98]">
                  Join once, order lunch easier every day.
                </h1>
                <p className="mt-6 max-w-lg text-base leading-8 text-emerald-50/78">
                  Save your details, keep your profile ready, and make every school
                  lunch feel easier to browse, order, and collect.
                </p>

                <div className="mt-10 space-y-5">
                  {benefits.map((item, index) => (
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
                  The easiest way to keep lunch details ready between classes.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white px-6 py-10 md:px-10 xl:px-14">
            <div className="mx-auto max-w-3xl">
              <Link to="/" className="ghost-button px-0 text-sm">
                Back to homepage
              </Link>

              <p className="mt-8 text-sm font-extrabold uppercase tracking-[0.24em] text-emerald-700">
                Student Registration
              </p>
              <h2 className="mt-4 text-4xl font-extrabold text-slate-950">Create your account</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Create an account once and use your saved profile to speed up future preorders and account management.
              </p>

              <div className="soft-panel mt-8 p-5">
                <div className="grid gap-5 md:grid-cols-[140px_1fr] md:items-center">
                  <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-slate-200 bg-[#eef4ff]">
                    {formData.profileImage ? (
                      <img
                        src={formData.profileImage}
                        alt="Profile preview"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <HiCamera className="text-4xl text-slate-400" />
                    )}
                  </div>

                  <div>
                    <p className="subtle-kicker">Profile preview</p>
                    <p className="mt-2 text-sm leading-7 text-slate-600">
                      Add an optional image URL if you want your account page to feel more personal.
                    </p>
                    <input
                      type="text"
                      name="profileImage"
                      value={formData.profileImage}
                      onChange={handleChange}
                      placeholder="https://example.com/profile.jpg"
                      className="field-input mt-4"
                    />
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="mt-8 grid gap-5">
                {formError ? (
                  <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                    {formError}
                  </div>
                ) : null}

                <div className="grid gap-5 md:grid-cols-2">
                  <div>
                    <label className="field-label">Full name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      className="field-input"
                      minLength="2"
                      maxLength="60"
                      autoComplete="name"
                      required
                    />
                  </div>

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
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  <div>
                    <label className="field-label">Class / Section</label>
                    <input
                      type="text"
                      name="classSection"
                      value={formData.classSection}
                      onChange={handleChange}
                      placeholder="Grade 10 - B"
                      className="field-input"
                      maxLength="50"
                    />
                    <div className="mt-3 flex flex-wrap gap-2">
                      {classSuggestions.map((item) => (
                        <button
                          key={item}
                          type="button"
                          onClick={() =>
                            setFormData((previous) => ({
                              ...previous,
                              classSection: item,
                            }))
                          }
                          className="rounded-full bg-slate-100 px-3 py-2 text-xs font-extrabold text-slate-700 hover:bg-slate-200"
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="field-label">Phone number</label>
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+977 9800000000"
                      className="field-input"
                      pattern="^[0-9+\\-\\s]{7,20}$"
                      autoComplete="tel"
                    />
                  </div>
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  <div>
                    <label className="field-label">Password</label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Create a secure password"
                        className="field-input pr-14"
                        minLength="8"
                        autoComplete="new-password"
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

                  <div>
                    <label className="field-label">Confirm password</label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Repeat your password"
                        className="field-input pr-14"
                        minLength="8"
                        autoComplete="new-password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword((previous) => !previous)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                        aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                      >
                        {showConfirmPassword ? <HiEyeOff className="text-xl" /> : <HiEye className="text-xl" />}
                      </button>
                    </div>
                  </div>
                </div>

                <label className="mt-1 inline-flex items-start gap-3 rounded-[24px] bg-[#f7faf8] px-4 py-4 text-sm text-slate-600">
                  <input
                    type="checkbox"
                    checked={acceptedTerms}
                    onChange={(event) => setAcceptedTerms(event.target.checked)}
                    className="mt-1 h-4 w-4 rounded border-slate-300"
                  />
                  <span>
                    I agree to the terms of service and privacy expectations for my school canteen account.
                  </span>
                </label>

                <button type="submit" disabled={isLoading} className="primary-button mt-2 w-full justify-center">
                  {isLoading ? "Creating account..." : "Create Account"}
                </button>
              </form>

              <p className="mt-6 text-sm text-slate-600">
                Already have an account?{" "}
                <Link
                  to="/login"
                  state={location.state}
                  className="font-extrabold text-emerald-700 hover:text-emerald-800"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
