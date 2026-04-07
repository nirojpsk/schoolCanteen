import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { HiSearch } from "react-icons/hi";
import { toast } from "react-toastify";
import AdminHeader from "../../components/admin/AdminHeader";
import EmptyState from "../../components/common/EmptyState";
import LoadingBlock from "../../components/common/LoadingBlock";
import StatusBadge from "../../components/common/StatusBadge";
import {
  useDeleteUserMutation,
  useGetUserOrderHistoryQuery,
  useGetUsersQuery,
  useUpdateUserStatusMutation,
} from "../../services/authApiSlice";
import {
  formatCurrency,
  formatDateTime,
  getApiErrorMessage,
} from "../../utils/formatters";

const roleOptions = ["all", "student", "staff", "admin"];
const accountStatusOptions = ["all", "active", "inactive"];
const onlineStatusOptions = ["all", "online", "offline"];

export default function UsersPage() {
  const currentUser = useSelector((state) => state.auth.userInfo);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("all");
  const [accountStatus, setAccountStatus] = useState("all");
  const [onlineStatus, setOnlineStatus] = useState("all");
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [updateUserStatus, { isLoading: isUpdatingStatus }] =
    useUpdateUserStatusMutation();
  const [deleteUser, { isLoading: isDeletingUser }] = useDeleteUserMutation();

  const queryParams = useMemo(() => {
    const params = {};

    if (search.trim()) params.search = search.trim();
    if (role !== "all") params.role = role;
    if (accountStatus !== "all") params.isActive = String(accountStatus === "active");
    if (onlineStatus !== "all") params.isOnline = String(onlineStatus === "online");

    return params;
  }, [accountStatus, onlineStatus, role, search]);

  const { data, isLoading, isFetching } = useGetUsersQuery(queryParams, {
    pollingInterval: 60000,
  });

  const visibleUsers = useMemo(() => data?.data ?? [], [data]);
  const onlineCount = visibleUsers.filter((user) => user.isOnline).length;
  const activeCount = visibleUsers.filter((user) => user.isActive).length;
  const totalSpentAcrossVisibleUsers = visibleUsers.reduce(
    (total, user) => total + Number(user.totalSpent || 0),
    0
  );

  const selectedUser =
    visibleUsers.find((user) => user._id === selectedUserId) ?? visibleUsers[0] ?? null;
  const resolvedSelectedUserId = selectedUser?._id ?? null;

  const {
    data: userHistoryResponse,
    isLoading: isLoadingHistory,
    isFetching: isFetchingHistory,
  } = useGetUserOrderHistoryQuery(resolvedSelectedUserId, {
    skip: !resolvedSelectedUserId,
    pollingInterval: 60000,
  });

  const userHistory = userHistoryResponse?.data?.orders ?? [];
  const userSummary = userHistoryResponse?.data?.summary ?? null;
  const historyUser = userHistoryResponse?.data?.user ?? selectedUser;

  const handleToggleStatus = async (user) => {
    const nextIsActive = !user.isActive;
    const actionLabel = nextIsActive ? "activate" : "deactivate";
    const isConfirmed = window.confirm(
      `Do you want to ${actionLabel} the account for "${user.name}"?`
    );

    if (!isConfirmed) return;

    try {
      const response = await updateUserStatus({
        id: user._id,
        isActive: nextIsActive,
      }).unwrap();
      toast.success(response?.message || "User status updated.");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Could not update user status."));
    }
  };

  const handleDeleteUser = async (user) => {
    const isConfirmed = window.confirm(
      `Delete "${user.name}" permanently? This cannot be undone.`
    );

    if (!isConfirmed) return;

    try {
      const response = await deleteUser(user._id).unwrap();
      toast.success(response?.message || "User deleted.");
      if (selectedUserId === user._id) {
        setSelectedUserId(null);
      }
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Could not delete user."));
    }
  };

  return (
    <section className="space-y-8">
      <AdminHeader
        title="Users, Spending, And Order History"
        description="Track account access, review user-by-user spend totals, and inspect linked preorder history from one admin workspace."
        actions={
          <label className="relative w-full xl:w-[340px]">
            <HiSearch className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by name or email..."
              className="field-input pl-11"
            />
          </label>
        }
      />

      <div className="grid gap-4 md:grid-cols-4">
        <div className="admin-card p-5">
          <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-slate-400">
            Loaded Users
          </p>
          <p className="mt-3 text-4xl font-extrabold text-slate-950">{visibleUsers.length}</p>
        </div>
        <div className="admin-card p-5">
          <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-slate-400">
            Online Now
          </p>
          <p className="mt-3 text-4xl font-extrabold text-emerald-900">{onlineCount}</p>
        </div>
        <div className="admin-card p-5">
          <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-slate-400">
            Account Active
          </p>
          <p className="mt-3 text-4xl font-extrabold text-slate-950">{activeCount}</p>
        </div>
        <div className="admin-card p-5">
          <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-slate-400">
            User Spending
          </p>
          <p className="mt-3 text-4xl font-extrabold text-slate-950">
            {formatCurrency(totalSpentAcrossVisibleUsers)}
          </p>
        </div>
      </div>

      <div className="grid gap-8 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="admin-card p-6 md:p-7">
          <div className="flex flex-wrap gap-3">
            <select
              value={role}
              onChange={(event) => setRole(event.target.value)}
              className="field-input max-w-[200px]"
            >
              {roleOptions.map((option) => (
                <option key={option} value={option}>
                  {option === "all" ? "All Roles" : option.charAt(0).toUpperCase() + option.slice(1)}
                </option>
              ))}
            </select>

            <select
              value={accountStatus}
              onChange={(event) => setAccountStatus(event.target.value)}
              className="field-input max-w-[220px]"
            >
              {accountStatusOptions.map((option) => (
                <option key={option} value={option}>
                  {option === "all"
                    ? "All Account States"
                    : option.charAt(0).toUpperCase() + option.slice(1)}
                </option>
              ))}
            </select>

            <select
              value={onlineStatus}
              onChange={(event) => setOnlineStatus(event.target.value)}
              className="field-input max-w-[220px]"
            >
              {onlineStatusOptions.map((option) => (
                <option key={option} value={option}>
                  {option === "all"
                    ? "All Presence States"
                    : option.charAt(0).toUpperCase() + option.slice(1)}
                </option>
              ))}
            </select>

            <div className="ml-auto flex items-center text-sm font-semibold text-slate-500">
              {isFetching ? "Refreshing users..." : "Live user and spending list"}
            </div>
          </div>

          <div className="mt-6">
            {isLoading ? (
              <LoadingBlock label="Loading users..." />
            ) : visibleUsers.length ? (
              <div className="admin-table-wrap">
                <table className="w-full min-w-[1200px] text-left">
                  <thead className="bg-slate-50 text-sm text-slate-500">
                    <tr>
                      <th className="px-5 py-4 font-semibold">User</th>
                      <th className="px-5 py-4 font-semibold">Role</th>
                      <th className="px-5 py-4 font-semibold">Presence</th>
                      <th className="px-5 py-4 font-semibold">Orders</th>
                      <th className="px-5 py-4 font-semibold">Spent</th>
                      <th className="px-5 py-4 font-semibold">Last Order</th>
                      <th className="px-5 py-4 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visibleUsers.map((user) => {
                      const isSelf = currentUser?._id === user._id;
                      const isSelected = resolvedSelectedUserId === user._id;

                      return (
                        <tr
                          key={user._id}
                          className={`border-t border-slate-100 text-sm text-slate-700 ${
                            isSelected ? "bg-emerald-50/60" : ""
                          }`}
                        >
                          <td className="px-5 py-4">
                            <button
                              type="button"
                              onClick={() => setSelectedUserId(user._id)}
                              className="text-left"
                            >
                              <p className="font-extrabold text-slate-950">{user.name}</p>
                              <p className="mt-1 text-xs text-slate-500">{user.email}</p>
                              <p className="mt-1 text-xs text-slate-400">
                                {user.classSection || "No class/section"}
                              </p>
                            </button>
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex flex-col gap-2">
                              <StatusBadge value={user.role} />
                              <StatusBadge
                                value={user.isActive ? "Active" : "Inactive"}
                                tone={user.isActive ? "active" : "inactive"}
                              />
                            </div>
                          </td>
                          <td className="px-5 py-4">
                            <StatusBadge
                              value={user.isOnline ? "Online" : "Offline"}
                              tone={user.isOnline ? "active" : "inactive"}
                            />
                          </td>
                          <td className="px-5 py-4 font-extrabold text-slate-950">
                            {user.orderCount || 0}
                          </td>
                          <td className="px-5 py-4 font-extrabold text-slate-950">
                            {formatCurrency(user.totalSpent || 0)}
                          </td>
                          <td className="px-5 py-4 text-slate-600">
                            {formatDateTime(user.lastOrderAt)}
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex flex-wrap gap-2">
                              <button
                                type="button"
                                onClick={() => handleToggleStatus(user)}
                                disabled={isUpdatingStatus || isSelf}
                                className="secondary-button px-4 py-2 text-xs"
                              >
                                {user.isActive ? "Deactivate" : "Activate"}
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteUser(user)}
                                disabled={isDeletingUser || isSelf}
                                className="rounded-full bg-rose-50 px-4 py-2 text-xs font-extrabold text-rose-700 hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-60"
                              >
                                Delete
                              </button>
                            </div>
                            {isSelf ? (
                              <p className="mt-2 text-xs text-slate-400">Your own account is protected.</p>
                            ) : null}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <EmptyState
                title="No users found"
                description="Try changing the role, presence, or account filters to reveal more users."
              />
            )}
          </div>
        </div>

        <div className="space-y-6">
          {!resolvedSelectedUserId ? (
            <EmptyState
              title="No user selected"
              description="Choose a user from the table to inspect their spending and linked order history."
            />
          ) : isLoadingHistory ? (
            <LoadingBlock label="Loading user spending history..." />
          ) : (
            <>
              <div className="admin-card p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-extrabold text-slate-950">
                      {historyUser?.name}
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">{historyUser?.email}</p>
                  </div>
                  <StatusBadge
                    value={historyUser?.isOnline ? "Online" : "Offline"}
                    tone={historyUser?.isOnline ? "active" : "inactive"}
                  />
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-[24px] bg-slate-50 p-4">
                    <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-slate-400">
                      Total Spent
                    </p>
                    <p className="mt-3 text-3xl font-extrabold text-slate-950">
                      {formatCurrency(userSummary?.totalSpent || historyUser?.totalSpent || 0)}
                    </p>
                  </div>
                  <div className="rounded-[24px] bg-[#eef8f1] p-4">
                    <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-slate-400">
                      Completed Spend
                    </p>
                    <p className="mt-3 text-3xl font-extrabold text-emerald-900">
                      {formatCurrency(
                        userSummary?.completedSpent || historyUser?.completedSpent || 0
                      )}
                    </p>
                  </div>
                  <div className="rounded-[24px] bg-[#eef4ff] p-4">
                    <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-slate-400">
                      Order Count
                    </p>
                    <p className="mt-3 text-3xl font-extrabold text-slate-950">
                      {userSummary?.orderCount || historyUser?.orderCount || 0}
                    </p>
                  </div>
                  <div className="rounded-[24px] bg-[#fff8ea] p-4">
                    <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-slate-400">
                      Last Order
                    </p>
                    <p className="mt-3 text-base font-extrabold text-slate-950">
                      {formatDateTime(userSummary?.lastOrderAt || historyUser?.lastOrderAt)}
                    </p>
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  <StatusBadge value={historyUser?.role || "User"} />
                  <StatusBadge
                    value={historyUser?.isActive ? "Active" : "Inactive"}
                    tone={historyUser?.isActive ? "active" : "inactive"}
                  />
                  <StatusBadge
                    value={historyUser?.classSection || "No Class/Section"}
                    tone="normal"
                  />
                </div>

                <p className="mt-5 text-xs leading-6 text-slate-400">
                  Linked order history is fully reliable for orders placed while the user was signed in after account-based preorder tracking was enabled.
                </p>
              </div>

              <div className="admin-card p-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-extrabold text-slate-950">Order History</h2>
                    <p className="mt-1 text-sm text-slate-500">
                      {isFetchingHistory ? "Refreshing history..." : "Latest linked orders for this user."}
                    </p>
                  </div>
                </div>

                <div className="mt-6 space-y-4">
                  {userHistory.length ? (
                    userHistory.map((order) => (
                      <div key={order._id} className="rounded-[24px] border border-slate-100 bg-slate-50 p-4">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div>
                            <p className="text-sm font-extrabold text-slate-950">
                              #{order._id.slice(-6).toUpperCase()}
                            </p>
                            <p className="mt-1 text-xs text-slate-500">
                              {formatDateTime(order.createdAt)}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <StatusBadge value={order.status} tone={order.status} />
                            <span className="text-base font-extrabold text-slate-950">
                              {formatCurrency(order.totalAmount)}
                            </span>
                          </div>
                        </div>

                        <p className="mt-3 text-sm leading-7 text-slate-600">
                          {order.items.map((item) => `${item.name} x${item.quantity}`).join(", ")}
                        </p>

                        <div className="mt-3 flex flex-wrap gap-4 text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                          <span>Pickup: {order.pickupTime}</span>
                          <span>Class: {order.classSection}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <EmptyState
                      title="No linked order history"
                      description="This user does not have any orders linked to their account yet."
                    />
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
