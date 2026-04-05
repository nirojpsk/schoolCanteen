import { Outlet } from "react-router-dom";
import AdminSidebar from "../components/admin/AdminSidebar";

export default function AdminLayout() {
    return (
        <div className="min-h-screen bg-slate-100">
            <div className="lg:flex">
                <div className="lg:min-h-screen lg:w-72">
                    <AdminSidebar />
                </div>

                <div className="flex-1 p-4 md:p-6 lg:p-8">
                    <Outlet />
                </div>
            </div>
        </div>
    );
}