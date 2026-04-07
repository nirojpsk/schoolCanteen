import { useMemo } from "react";
import { Link } from "react-router-dom";
import {
  HiOutlineCollection,
  HiOutlineClipboardList,
  HiOutlineSparkles,
  HiOutlineShoppingBag,
  HiOutlineUsers,
  HiOutlineCurrencyDollar,
} from "react-icons/hi";
import AdminHeader from "../../components/admin/AdminHeader";
import DashboardStatCard from "../../components/admin/DashboardStatCard";
import EmptyState from "../../components/common/EmptyState";
import LoadingBlock from "../../components/common/LoadingBlock";
import StatusBadge from "../../components/common/StatusBadge";
import {
  useGetDashboardStatsQuery,
  useGetRecentOrdersQuery,
} from "../../services/dashboardApiSlice";
import { useGetUsersQuery } from "../../services/authApiSlice";
import { useGetActiveSpecialsQuery } from "../../services/specialApiSlice";
import { formatCurrency, formatDateTime } from "../../utils/formatters";

export default function DashboardPage() {
  const { data: statsResponse, isLoading: isLoadingStats } =
    useGetDashboardStatsQuery(undefined, {
      pollingInterval: 60000,
    });
  const { data: recentResponse, isLoading: isLoadingRecent } =
    useGetRecentOrdersQuery(undefined, {
      pollingInterval: 60000,
    });
  const { data: usersResponse } = useGetUsersQuery(
    { role: "student" },
    { pollingInterval: 60000 }
  );
  const { data: specialResponse } = useGetActiveSpecialsQuery();

  const stats = statsResponse?.data;
  const recentOrders = useMemo(() => recentResponse?.data ?? [], [recentResponse]);
  const activeSpecial = specialResponse?.data?.[0] ?? null;
  const studentUsers = useMemo(() => usersResponse?.data ?? [], [usersResponse]);
  const totalOrders =
    Number(stats?.pendingPreorders ?? 0) +
    Number(stats?.preparingPreorders ?? 0) +
    Number(stats?.readyPreorders ?? 0) +
    Number(stats?.completedPreorders ?? 0) +
    Number(stats?.cancelledPreorders ?? 0);
  const loadRatio = totalOrders
    ? Math.round(
        (((stats?.pendingPreorders ?? 0) + (stats?.preparingPreorders ?? 0)) /
          totalOrders) *
          100
      )
    : 0;

  const cards = [
    {
      title: "Total Categories",
      value: stats?.totalCategories ?? 0,
      subtitle: "Food groups currently powering the public menu filters.",
      accent: "emerald",
      icon: HiOutlineCollection,
      badge: "+2 new",
    },
    {
      title: "Total Items",
      value: stats?.totalMenuItems ?? 0,
      subtitle: "Live menu items students can browse across the website.",
      accent: "sky",
      icon: HiOutlineClipboardList,
      badge: `${recentOrders.length || 0} recent`,
    },
    {
      title: "Live Specials",
      value: stats?.totalSpecials ?? 0,
      subtitle: "Promotions currently visible on the homepage and specials page.",
      accent: "amber",
      icon: HiOutlineSparkles,
      badge: activeSpecial ? "Active" : "Standby",
    },
    {
      title: "Pending Orders",
      value: stats?.pendingPreorders ?? 0,
      subtitle: "Requests waiting for kitchen action right now.",
      accent: "rose",
      icon: HiOutlineShoppingBag,
      badge: loadRatio > 65 ? "Urgent" : "Stable",
    },
    {
      title: "Online Users",
      value: stats?.onlineUsers ?? 0,
      subtitle: "Users with recent activity seen within the last 5 minutes.",
      accent: "emerald",
      icon: HiOutlineUsers,
      badge: `${stats?.activeUsers ?? 0} active`,
    },
    {
      title: "Total Earnings",
      value: formatCurrency(stats?.totalRevenue ?? 0),
      subtitle: "Revenue from all non-cancelled preorder requests.",
      accent: "amber",
      icon: HiOutlineCurrencyDollar,
      badge: formatCurrency(stats?.completedRevenue ?? 0),
    },
  ];

  const demandForecast = useMemo(() => {
    const demand = recentOrders.reduce((totals, order) => {
      order.items.forEach((item) => {
        totals[item.name] = (totals[item.name] || 0) + Number(item.quantity || 0);
      });

      return totals;
    }, {});

    const sorted = Object.entries(demand)
      .map(([name, count]) => ({ name, count }))
      .sort((left, right) => right.count - left.count)
      .slice(0, 4);
    const maxCount = sorted[0]?.count || 1;

    return sorted.map((item) => ({
      ...item,
      percentage: Math.round((item.count / maxCount) * 100),
    }));
  }, [recentOrders]);
  const topSpenders = useMemo(
    () =>
      [...studentUsers]
        .sort((left, right) => Number(right.totalSpent || 0) - Number(left.totalSpent || 0))
        .slice(0, 5),
    [studentUsers]
  );

  return (
    <section className="space-y-8">
      <AdminHeader
        title="Dashboard"
        description="A real-time view of menu content, user activity, earnings, and incoming preorder operations across the canteen website."
        actions={
          <>
            <Link to="/" className="secondary-button px-5 py-3 text-sm">
              Go Back
            </Link>
            <Link to="/admin/users" className="secondary-button px-5 py-3 text-sm">
              Manage Users
            </Link>
            <Link to="/admin/orders" className="primary-button px-5 py-3 text-sm">
              View Orders
            </Link>
          </>
        }
      />

      {isLoadingStats ? (
        <LoadingBlock label="Loading dashboard statistics..." />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {cards.map((stat) => (
            <DashboardStatCard
              key={stat.title}
              title={stat.title}
              value={stat.value}
              subtitle={stat.subtitle}
              accent={stat.accent}
              icon={stat.icon}
              badge={stat.badge}
            />
          ))}
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          <div className="admin-card p-6 md:p-7">
            <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
              <div>
                <h2 className="text-3xl font-extrabold text-slate-950">Kitchen Snapshot</h2>
                <p className="mt-2 text-sm leading-7 text-slate-600">
                  Live production indicators for the current preorder workflow.
                </p>
              </div>
              <Link to="/admin/orders" className="secondary-button px-5 py-3 text-sm">
                View All Tickets
              </Link>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-[28px] border border-amber-100 bg-[#fff8ea] p-5">
                <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-slate-400">
                  Preparing
                </p>
                <p className="mt-3 text-4xl font-extrabold text-slate-950">
                  {stats?.preparingPreorders ?? 0}
                </p>
              </div>
              <div className="rounded-[28px] border border-emerald-100 bg-[#eef8f1] p-5">
                <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-slate-400">
                  Ready For Pickup
                </p>
                <p className="mt-3 text-4xl font-extrabold text-slate-950">
                  {stats?.readyPreorders ?? 0}
                </p>
              </div>
              <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-5">
                <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-slate-400">
                  Completed Today
                </p>
                <p className="mt-3 text-4xl font-extrabold text-slate-950">
                  {stats?.completedPreorders ?? 0}
                </p>
              </div>
              <div className="rounded-[28px] border border-rose-100 bg-[#fff1ef] p-5">
                <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-slate-400">
                  Cancelled
                </p>
                <p className="mt-3 text-4xl font-extrabold text-slate-950">
                  {stats?.cancelledPreorders ?? 0}
                </p>
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-[34px] bg-[linear-gradient(135deg,#0a4d39_0%,#0e6a4b_100%)] text-white shadow-[0_28px_55px_rgba(7,49,36,0.2)]">
            <div className="grid gap-6 p-6 md:grid-cols-[1.05fr_0.95fr] md:p-8">
              <div className="max-w-xl">
                <p className="inline-flex rounded-full bg-[#ffc629] px-3 py-1 text-xs font-extrabold uppercase tracking-[0.2em] text-emerald-950">
                  Promotion Live
                </p>
                <h2 className="mt-5 text-4xl font-extrabold leading-tight">
                  {activeSpecial?.title || "Highlight your next student offer here"}
                </h2>
                <p className="mt-4 text-sm leading-7 text-emerald-50/78">
                  {activeSpecial?.description ||
                    "Active specials from the admin panel automatically appear on both the public homepage and the specials page."}
                </p>
                <div className="mt-5 flex flex-wrap items-center gap-3">
                  {activeSpecial ? (
                    <>
                      <StatusBadge value="Active Now" tone="active" />
                      <span className="text-lg font-extrabold text-[#ffc629]">
                        {formatCurrency(activeSpecial.specialPrice)}
                      </span>
                    </>
                  ) : (
                    <StatusBadge value="No active special" tone="inactive" />
                  )}
                </div>
                <Link
                  to="/admin/specials"
                  className="secondary-button mt-6 border-white/10 bg-white text-emerald-950"
                >
                  Edit Special
                </Link>
              </div>

              <div className="overflow-hidden rounded-[28px] bg-white/10">
                <img
                  src={
                    activeSpecial?.bannerImage ||
                    activeSpecial?.menuItem?.image ||
                    "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1200&q=80"
                  }
                  alt={activeSpecial?.title || "Featured special"}
                  className="h-full min-h-[260px] w-full object-cover"
                />
              </div>
            </div>
          </div>

          <div className="admin-card p-6 md:p-7">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-3xl font-extrabold text-slate-950">Recent Preorders</h2>
                <p className="mt-2 text-sm leading-7 text-slate-600">
                  The latest requests submitted from the public website.
                </p>
              </div>
              <Link to="/admin/orders" className="secondary-button px-4 py-3 text-sm">
                Manage Orders
              </Link>
            </div>

            {isLoadingRecent ? (
              <LoadingBlock label="Loading recent orders..." />
            ) : recentOrders.length ? (
              <div className="admin-table-wrap">
                <table className="w-full min-w-[720px] text-left">
                  <thead className="bg-slate-50 text-sm text-slate-500">
                    <tr>
                      <th className="px-5 py-4 font-semibold">Order ID</th>
                      <th className="px-5 py-4 font-semibold">Student</th>
                      <th className="px-5 py-4 font-semibold">Items</th>
                      <th className="px-5 py-4 font-semibold">Pickup</th>
                      <th className="px-5 py-4 font-semibold">Total</th>
                      <th className="px-5 py-4 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((order) => (
                      <tr key={order._id} className="border-t border-slate-100 text-sm text-slate-700">
                        <td className="px-5 py-4 font-extrabold text-slate-950">
                          #{order._id.slice(-6).toUpperCase()}
                        </td>
                        <td className="px-5 py-4">
                          <p className="font-semibold text-slate-900">{order.studentName}</p>
                          <p className="text-xs text-slate-500">{order.classSection}</p>
                        </td>
                        <td className="px-5 py-4">
                          {order.items.map((item) => item.name).join(", ")}
                        </td>
                        <td className="px-5 py-4">
                          <p>{order.pickupTime}</p>
                          <p className="text-xs text-slate-500">
                            {formatDateTime(order.createdAt)}
                          </p>
                        </td>
                        <td className="px-5 py-4 font-extrabold">
                          {formatCurrency(order.totalAmount)}
                        </td>
                        <td className="px-5 py-4">
                          <StatusBadge value={order.status} tone={order.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <EmptyState
                title="No recent orders"
                description="Once students submit preorders from the public site, the latest ones will appear here."
              />
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="admin-card p-6">
            <h2 className="text-2xl font-extrabold text-slate-950">Users Overview</h2>
            <p className="mt-2 text-sm leading-7 text-slate-600">
              Admin visibility into registered accounts, enabled users, and who is online now.
            </p>

            <div className="mt-6 grid gap-4">
              <div className="rounded-[24px] bg-slate-50 p-5">
                <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-slate-400">
                  Total Users
                </p>
                <p className="mt-3 text-3xl font-extrabold text-slate-950">
                  {stats?.totalUsers ?? 0}
                </p>
              </div>
              <div className="rounded-[24px] bg-[#eef8f1] p-5">
                <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-slate-400">
                  Account Active
                </p>
                <p className="mt-3 text-3xl font-extrabold text-emerald-900">
                  {stats?.activeUsers ?? 0}
                </p>
              </div>
              <div className="rounded-[24px] bg-[#eef4ff] p-5">
                <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-slate-400">
                  Online Now
                </p>
                <p className="mt-3 text-3xl font-extrabold text-slate-950">
                  {stats?.onlineUsers ?? 0}
                </p>
              </div>
            </div>

            <Link to="/admin/users" className="primary-button mt-5 w-full justify-center">
              Open Users Page
            </Link>
          </div>

          <div className="admin-card p-6">
            <h2 className="text-2xl font-extrabold text-slate-950">Revenue Summary</h2>
            <p className="mt-2 text-sm leading-7 text-slate-600">
              Revenue totals from the current preorder pipeline and completed orders.
            </p>

            <div className="mt-6 grid gap-4">
              <div className="rounded-[24px] bg-[#fff8ea] p-5">
                <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-slate-400">
                  Total Earnings
                </p>
                <p className="mt-3 text-3xl font-extrabold text-slate-950">
                  {formatCurrency(stats?.totalRevenue ?? 0)}
                </p>
              </div>
              <div className="rounded-[24px] bg-[#eef8f1] p-5">
                <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-slate-400">
                  Completed Revenue
                </p>
                <p className="mt-3 text-3xl font-extrabold text-emerald-900">
                  {formatCurrency(stats?.completedRevenue ?? 0)}
                </p>
              </div>
            </div>
          </div>

          <div className="admin-card p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-extrabold text-slate-950">User Spending</h2>
                <p className="mt-2 text-sm leading-7 text-slate-600">
                  Highest student spenders based on linked account orders.
                </p>
              </div>
              <Link to="/admin/users" className="secondary-button px-4 py-3 text-sm">
                View Histories
              </Link>
            </div>

            <div className="mt-6 space-y-4">
              {topSpenders.length ? (
                topSpenders.map((user) => (
                  <div key={user._id} className="rounded-[24px] bg-slate-50 p-4">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="font-extrabold text-slate-950">{user.name}</p>
                        <p className="mt-1 text-xs text-slate-500">
                          {user.orderCount || 0} linked orders
                        </p>
                      </div>
                      <p className="text-lg font-extrabold text-emerald-900">
                        {formatCurrency(user.totalSpent || 0)}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm leading-7 text-slate-600">
                  User spending history will appear here once linked account orders are available.
                </p>
              )}
            </div>
          </div>

          <div className="admin-card p-6">
            <h2 className="text-2xl font-extrabold text-slate-950">Demand Forecast</h2>
            <p className="mt-2 text-sm leading-7 text-slate-600">
              A quick read on the most common items across recent orders.
            </p>

            <div className="mt-6 space-y-4">
              {demandForecast.length ? (
                demandForecast.map((item) => (
                  <div key={item.name} className="space-y-2">
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-semibold text-slate-800">{item.name}</span>
                      <span className="text-sm font-extrabold text-emerald-800">
                        {item.percentage}%
                      </span>
                    </div>
                    <div className="h-3 rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-[linear-gradient(90deg,#ffc629_0%,#15835d_100%)]"
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm leading-7 text-slate-600">
                  Demand insights will appear here once more orders have been placed.
                </p>
              )}
            </div>
          </div>

          <div className="admin-card p-6">
            <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-slate-400">
              Live Traffic
            </p>
            <h2 className="mt-3 text-4xl font-extrabold text-emerald-900">{loadRatio}%</h2>
            <p className="mt-2 text-sm leading-7 text-slate-600">
              Peak-hour load based on pending and preparing orders against today&apos;s total order volume.
            </p>

            <div className="mt-6 flex h-36 items-end gap-3">
              {[42, 66, 84, loadRatio || 58, 71, 52].map((value, index) => (
                <div key={`${value}-${index}`} className="flex-1 rounded-t-[18px] bg-[#dff3e8]">
                  <div
                    className="w-full rounded-t-[18px] bg-[linear-gradient(180deg,#85e0b4_0%,#127252_100%)]"
                    style={{ height: `${value}%` }}
                  />
                </div>
              ))}
            </div>
            <p className="mt-3 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
              Last 6 service intervals
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
