import { useState } from "react";
import StatusBadge from "../../components/common/StatusBadge";
import { formatCurrency, formatDateTime } from "../../utils/formatters";

const statuses = ["pending", "preparing", "ready", "completed", "cancelled"];

export default function OrderDetailsCard({
  selectedOrder,
  onUpdateStatus,
  isUpdating = false,
}) {
  const [draftStatus, setDraftStatus] = useState(selectedOrder?.status || "pending");

  if (!selectedOrder) {
    return (
      <div className="admin-card p-6">
        <h2 className="text-2xl font-extrabold text-slate-950">Order Details</h2>
        <p className="mt-3 text-sm leading-7 text-slate-600">
          Select an order from the queue to review student details, ordered items, and update the workflow status.
        </p>
      </div>
    );
  }

  const initials = selectedOrder.studentName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  return (
    <div className="admin-card p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-950">Order Details</h2>
          <p className="mt-2 text-sm leading-7 text-slate-600">
            Review the selected preorder and confirm the next workflow update.
          </p>
        </div>
        <StatusBadge value={selectedOrder.status} tone={selectedOrder.status} />
      </div>

      <div className="mt-6 rounded-[28px] bg-slate-50 p-5">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#dff3e8] text-lg font-extrabold text-emerald-900">
            {initials || "ST"}
          </div>
          <div>
            <h3 className="text-2xl font-extrabold text-slate-950">
              {selectedOrder.studentName}
            </h3>
            <p className="mt-1 text-sm text-slate-500">{selectedOrder.classSection}</p>
            <p className="mt-1 text-sm text-slate-500">{selectedOrder.phone}</p>
          </div>
        </div>
      </div>

      <div className="mt-6 space-y-5">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-slate-400">
            Order Reference
          </p>
          <p className="mt-2 font-extrabold text-slate-950">
            #{selectedOrder._id.slice(-6).toUpperCase()}
          </p>
        </div>

        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-slate-400">
            Pickup Time
          </p>
          <p className="mt-2 font-semibold text-slate-800">{selectedOrder.pickupTime}</p>
        </div>

        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-slate-400">
            Ordered Items
          </p>
          <div className="mt-3 space-y-3">
            {selectedOrder.items.map((item, index) => (
              <div
                key={`${item.name}-${index}`}
                className="rounded-[22px] bg-slate-50 px-4 py-3 text-sm text-slate-700"
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold text-slate-900">{item.name}</p>
                    <p className="text-xs text-slate-500">
                      {formatCurrency(item.priceAtOrderTime)} each
                    </p>
                  </div>
                  <span className="font-extrabold text-slate-900">x{item.quantity}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[24px] bg-[#fff4e6] p-4">
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-slate-400">
            Student Note
          </p>
          <p className="mt-2 text-sm leading-7 text-slate-700">
            {selectedOrder.note || "No extra note was added to this preorder."}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-slate-400">
              Submitted
            </p>
            <p className="mt-2 font-semibold text-slate-800">
              {formatDateTime(selectedOrder.createdAt)}
            </p>
          </div>

          <div className="text-right">
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-slate-400">
              Grand Total
            </p>
            <p className="mt-2 text-3xl font-extrabold text-emerald-900">
              {formatCurrency(selectedOrder.totalAmount)}
            </p>
          </div>
        </div>

        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-slate-400">
            Update Workflow Status
          </p>
          <select
            value={draftStatus}
            onChange={(event) => setDraftStatus(event.target.value)}
            className="field-input mt-3"
          >
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={() => onUpdateStatus(selectedOrder, draftStatus)}
            disabled={isUpdating || draftStatus === selectedOrder.status}
            className="primary-button mt-4 w-full justify-center"
          >
            {isUpdating ? "Updating..." : "Confirm Update"}
          </button>
        </div>
      </div>
    </div>
  );
}
