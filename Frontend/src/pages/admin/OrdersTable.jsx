import { HiChevronRight, HiClock } from "react-icons/hi";
import StatusBadge from "../../components/common/StatusBadge";
import { formatCurrency } from "../../utils/formatters";

export default function OrdersTable({
  orders,
  onSelectOrder,
  selectedOrderId,
}) {
  return (
    <div className="admin-card p-6 md:p-7">
      <div className="mb-6">
        <h2 className="text-3xl font-extrabold text-slate-950">Order Queue</h2>
        <p className="mt-2 text-sm leading-7 text-slate-600">
          Select a preorder to review its details and update the workflow status.
        </p>
      </div>

      <div className="overflow-hidden rounded-[28px] border border-slate-100 bg-white">
        <div className="hidden grid-cols-[1.3fr_0.85fr_0.85fr_0.75fr_auto] gap-4 border-b border-slate-100 px-5 py-4 text-xs font-extrabold uppercase tracking-[0.18em] text-slate-400 md:grid">
          <span>Student</span>
          <span>Pickup</span>
          <span>Total</span>
          <span>Status</span>
          <span>Action</span>
        </div>

        {orders.length ? (
          <div className="divide-y divide-slate-100">
            {orders.map((order) => {
              const initials = order.studentName
                .split(" ")
                .filter(Boolean)
                .slice(0, 2)
                .map((part) => part[0]?.toUpperCase())
                .join("");

              return (
                <button
                  key={order._id}
                  type="button"
                  onClick={() => onSelectOrder(order)}
                  className={`grid w-full gap-4 px-5 py-5 text-left transition md:grid-cols-[1.3fr_0.85fr_0.85fr_0.75fr_auto] md:items-center ${
                    selectedOrderId === order._id
                      ? "bg-emerald-50/70"
                      : "bg-white hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#dff3e8] text-sm font-extrabold text-emerald-900">
                      {initials || "ST"}
                    </div>
                    <div>
                      <p className="font-extrabold text-slate-950">{order.studentName}</p>
                      <p className="mt-1 text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                        {order.classSection}
                      </p>
                      <p className="mt-2 text-xs font-semibold text-slate-500">
                        #{order._id.slice(-6).toUpperCase()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-sm font-semibold text-slate-600">
                    <HiClock className="text-base text-slate-400" />
                    <span>{order.pickupTime}</span>
                  </div>

                  <div className="text-base font-extrabold text-slate-950">
                    {formatCurrency(order.totalAmount)}
                  </div>

                  <div>
                    <StatusBadge value={order.status} tone={order.status} />
                  </div>

                  <div className="flex justify-end">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-50 text-slate-500">
                      <HiChevronRight className="text-xl" />
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="px-5 py-10 text-center text-sm text-slate-500">
            No orders match the current filters.
          </div>
        )}
      </div>
    </div>
  );
}
