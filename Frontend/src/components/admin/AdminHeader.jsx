import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { HiOutlineLogout } from "react-icons/hi";
import { clearCredentials } from "../../features/auth/authSlice";
import { apiSlice } from "../../services/apiSlice";
import { useLogoutMutation } from "../../services/authApiSlice";
import { getApiErrorMessage } from "../../utils/formatters";

function AdminHeader({
  title = "Admin Dashboard",
  description = "Manage the school canteen system from here.",
  actions = null,
}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userInfo = useSelector((state) => state.auth.userInfo);
  const [logout, { isLoading }] = useLogoutMutation();
  const adminLabel = userInfo?.name || userInfo?.email || "Admin";

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      dispatch(clearCredentials());
      dispatch(apiSlice.util.resetApiState());
      navigate("/", { replace: true });
      toast.success("Logged out successfully.");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Could not log out."));
    }
  };

  return (
    <div className="admin-card flex flex-col gap-5 p-6 md:p-7 xl:flex-row xl:items-start xl:justify-between">
      <div className="max-w-2xl">
        <p className="text-xs font-extrabold uppercase tracking-[0.24em] text-emerald-700">
          School Operations
        </p>
        <h1 className="mt-3 text-3xl font-extrabold text-slate-950 md:text-4xl">
          {title}
        </h1>
        <p className="mt-3 text-sm leading-7 text-slate-600 md:text-base">
          {description}
        </p>
      </div>

      <div className="flex w-full flex-col gap-3 xl:w-auto xl:min-w-[360px] xl:items-end">
        {actions ? <div className="flex w-full flex-wrap justify-end gap-3">{actions}</div> : null}

        <div className="flex flex-wrap items-center justify-end gap-3">
          <div className="rounded-full border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-emerald-700">
              Logged In
            </p>
            <p className="mt-1 font-semibold text-emerald-950">{adminLabel}</p>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            disabled={isLoading}
            className="secondary-button px-5 py-3 text-sm"
          >
            <HiOutlineLogout className="text-base" />
            {isLoading ? "Logging out..." : "Logout"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdminHeader;
