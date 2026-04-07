import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import AdminSidebar from "../components/admin/AdminSidebar";
import EmptyState from "../components/common/EmptyState";
import LoadingBlock from "../components/common/LoadingBlock";

export default function AdminLayout() {
    const { userInfo, sessionChecked, sessionError } = useSelector((state) => state.auth);
    const currentUser = userInfo ?? null;

    if (!sessionChecked) {
        return (
            <div className="flex min-h-screen items-center justify-center px-4">
                <LoadingBlock label="Checking admin session..." className="w-full max-w-md" />
            </div>
        );
    }

    if (!currentUser && sessionError) {
        return (
            <div className="content-shell py-16">
                <EmptyState
                    title="Admin session check failed"
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

    if (!currentUser || currentUser.role !== "admin") {
        return <Navigate to="/admin/login" replace />;
    }

    return (
        <div className="min-h-screen bg-[linear-gradient(180deg,#f5f8f2_0%,#f8fbf7_100%)]">
            <div className="pointer-events-none fixed inset-x-0 top-0 z-0 h-72 bg-[radial-gradient(circle_at_top,_rgba(18,114,82,0.14),_transparent_58%)]" />
            <div className="relative mx-auto max-w-[1640px] lg:flex lg:gap-6 lg:px-4">
                <div className="lg:sticky lg:top-0 lg:h-screen lg:w-[292px] lg:shrink-0 lg:py-4">
                    <AdminSidebar />
                </div>

                <div className="flex-1 p-4 md:p-6 lg:p-8 lg:pl-0">
                    <Outlet />
                </div>
            </div>
        </div>
    );
}
