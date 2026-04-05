function AdminHeader() {
    return (
        <div className="flex flex-col gap-4 rounded-2xl bg-white p-5 shadow-sm md:flex-row md:items-center md:justify-between">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
                <p className="mt-1 text-sm text-slate-600">
                    Welcome back. Manage the school canteen system from here.
                </p>
            </div>

            <div className="rounded-xl bg-slate-100 px-4 py-3 text-sm font-medium text-slate-700">
                Logged in as Admin
            </div>
        </div>
    );
}

export default AdminHeader; 