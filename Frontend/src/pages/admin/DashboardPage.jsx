import AdminHeader from "../../components/admin/AdminHeader";
import DashboardStatCard from "../../components/admin/DashboardStatCard";

const stats = [
  {
    title: "Total Categories",
    value: 5,
    subtitle: "Food groups currently available",
  },
  {
    title: "Menu Items",
    value: 18,
    subtitle: "Items listed in the canteen menu",
  },
  {
    title: "Active Specials",
    value: 3,
    subtitle: "Special offers running right now",
  },
  {
    title: "Pending Orders",
    value: 7,
    subtitle: "Preorders waiting for action",
  },
];

const recentOrders = [
  {
    id: "#ORD-001",
    student: "Aarav Rai",
    item: "Chicken Momo",
    status: "Pending",
  },
  {
    id: "#ORD-002",
    student: "Sujal Karki",
    item: "Veg Chowmein",
    status: "Preparing",
  },
  {
    id: "#ORD-003",
    student: "Asmita Bista",
    item: "Fresh Juice",
    status: "Ready",
  },
];

export default function DashboardPage() {
  return (
    <section className="space-y-8">
      <AdminHeader />

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <DashboardStatCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            subtitle={stat.subtitle}
          />
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="rounded-2xl bg-white p-6 shadow-sm xl:col-span-2">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">Recent Orders</h2>
            <button className="rounded-lg bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200">
              View All
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-125 text-left">
              <thead>
                <tr className="border-b border-slate-200 text-sm text-slate-500">
                  <th className="pb-3 font-medium">Order ID</th>
                  <th className="pb-3 font-medium">Student</th>
                  <th className="pb-3 font-medium">Item</th>
                  <th className="pb-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-slate-100 text-sm text-slate-700"
                  >
                    <td className="py-4 font-semibold text-slate-900">{order.id}</td>
                    <td className="py-4">{order.student}</td>
                    <td className="py-4">{order.item}</td>
                    <td className="py-4">
                      <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900">Quick Actions</h2>

          <div className="mt-6 grid gap-4">
            <button className="rounded-xl bg-green-700 px-4 py-3 text-left font-semibold text-white transition hover:bg-green-800">
              Add New Menu Item
            </button>

            <button className="rounded-xl bg-slate-100 px-4 py-3 text-left font-semibold text-slate-800 transition hover:bg-slate-200">
              Create Today’s Special
            </button>

            <button className="rounded-xl bg-slate-100 px-4 py-3 text-left font-semibold text-slate-800 transition hover:bg-slate-200">
              Manage Orders
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}