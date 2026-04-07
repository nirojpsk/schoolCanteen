import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import EmptyState from "../common/EmptyState";
import LoadingBlock from "../common/LoadingBlock";

export default function AuthRouteGate({ mode = "protected" }) {
  const location = useLocation();
  const { userInfo, sessionChecked, sessionError } = useSelector((state) => state.auth);
  const currentUser = userInfo ?? null;

  if (!sessionChecked) {
    return (
      <div className="content-shell py-16">
        <LoadingBlock label="Checking your session..." />
      </div>
    );
  }

  if (mode === "guestOnly" && currentUser) {
    return (
      <Navigate
        to={currentUser.role === "admin" ? "/" : "/account"}
        replace
      />
    );
  }

  if (mode === "protected" && !currentUser) {
    if (sessionError) {
      return (
        <div className="content-shell py-16">
          <EmptyState
            title="Session check failed"
            description={sessionError}
            action={
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="primary-button"
              >
                Retry
              </button>
            }
          />
        </div>
      );
    }

    const nextPath = `${location.pathname}${location.search}${location.hash}`;
    return <Navigate to="/login" replace state={{ from: nextPath }} />;
  }

  return <Outlet />;
}
