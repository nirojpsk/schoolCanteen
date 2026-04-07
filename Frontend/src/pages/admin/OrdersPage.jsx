import { useMemo, useState } from "react";
import { HiSearch } from "react-icons/hi";
import { toast } from "react-toastify";
import AdminHeader from "../../components/admin/AdminHeader";
import LoadingBlock from "../../components/common/LoadingBlock";
import {
  useGetPreordersQuery,
  useUpdatePreorderStatusMutation,
} from "../../services/preorderApiSlice";
import { getApiErrorMessage } from "../../utils/formatters";
import OrdersTable from "./OrdersTable";
import OrderDetailsCard from "./OrderDetailsCard";

const statusTabs = ["all", "pending", "preparing", "ready", "completed", "cancelled"];

export default function OrdersPage() {
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [search, setSearch] = useState("");
  const { data, isLoading } = useGetPreordersQuery();
  const [updatePreorderStatus, { isLoading: isUpdating }] =
    useUpdatePreorderStatusMutation();

  const orders = useMemo(() => data?.data ?? [], [data]);
  const normalizedSearch = search.trim().toLowerCase();
  const filteredOrders = useMemo(
    () =>
      orders.filter((order) => {
        const matchesStatus =
          statusFilter === "all" ? true : order.status === statusFilter;
        const matchesSearch = normalizedSearch
          ? [
              order.studentName,
              order.classSection,
              order._id,
              order._id.slice(-6),
            ]
              .join(" ")
              .toLowerCase()
              .includes(normalizedSearch)
          : true;

        return matchesStatus && matchesSearch;
      }),
    [normalizedSearch, orders, statusFilter]
  );

  const resolvedSelectedOrderId =
    selectedOrderId && filteredOrders.some((order) => order._id === selectedOrderId)
      ? selectedOrderId
      : filteredOrders[0]?._id || null;
  const selectedOrder = useMemo(
    () => filteredOrders.find((order) => order._id === resolvedSelectedOrderId) || null,
    [filteredOrders, resolvedSelectedOrderId]
  );
  const activeLoad = orders.length
    ? Math.round(
        (orders.filter((order) =>
          ["pending", "preparing"].includes(order.status)
        ).length /
          orders.length) *
          100
      )
    : 0;

  const handleUpdateStatus = async (order, status) => {
    try {
      const response = await updatePreorderStatus({
        id: order._id,
        status,
      }).unwrap();
      toast.success(response?.message || "Order status updated.");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Could not update order status."));
    }
  };

  return (
    <section className="space-y-8">
      <AdminHeader
        title="Orders Management"
        description="Manage daily student preorders, inspect order details, and move each request through the kitchen workflow."
        actions={
          <label className="relative w-full xl:w-[340px]">
            <HiSearch className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by student name or ID..."
              className="field-input pl-11"
            />
          </label>
        }
      />

      <div className="flex flex-wrap gap-2">
        {statusTabs.map((status) => (
          <button
            key={status}
            type="button"
            onClick={() => setStatusFilter(status)}
            className={`rounded-full px-5 py-3 text-sm font-extrabold transition ${
              statusFilter === status
                ? "bg-emerald-900 text-white shadow-[0_16px_28px_rgba(12,92,67,0.16)]"
                : "bg-white text-slate-700 hover:bg-slate-50"
            }`}
          >
            {status === "all" ? "All Orders" : status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {isLoading ? (
        <LoadingBlock label="Loading preorder requests..." />
      ) : (
        <div className="grid gap-8 xl:grid-cols-[1.35fr_0.8fr]">
          <div>
            <OrdersTable
              orders={filteredOrders}
              onSelectOrder={(order) => setSelectedOrderId(order._id)}
              selectedOrderId={resolvedSelectedOrderId}
            />
          </div>

          <div className="space-y-6">
            <OrderDetailsCard
              key={resolvedSelectedOrderId || "empty"}
              selectedOrder={selectedOrder}
              onUpdateStatus={handleUpdateStatus}
              isUpdating={isUpdating}
            />

            <div className="overflow-hidden rounded-[30px] bg-[linear-gradient(135deg,#0a5a42_0%,#0f7251_100%)] p-6 text-white shadow-[0_24px_48px_rgba(7,49,36,0.2)]">
              <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-emerald-100/60">
                Peak Hour Load
              </p>
              <h2 className="mt-3 text-5xl font-extrabold">{activeLoad}%</h2>
              <div className="mt-4 h-3 rounded-full bg-white/12">
                <div
                  className="h-full rounded-full bg-[#ffc629]"
                  style={{ width: `${activeLoad}%` }}
                />
              </div>
              <p className="mt-4 text-sm leading-7 text-emerald-50/74">
                A quick snapshot of how much of today&apos;s order volume is still active in the prep queue.
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
