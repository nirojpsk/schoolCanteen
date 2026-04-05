const statusStyles = {
  pending: "bg-yellow-100 text-yellow-700",
  preparing: "bg-sky-100 text-sky-700",
  ready: "bg-green-100 text-green-700",
  completed: "bg-slate-200 text-slate-700",
  cancelled: "bg-red-100 text-red-700",
};

export default function OrdersTable({
  orders,
  onSelectOrder,
  onUpdateStatus,
  selectedOrder,
}) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900">Orders List</h2>
        <p className="mt-1 text-sm text-slate-600">
          View preorder requests and update their status.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-250 text-left">
          <thead>
            <tr className="border-b border-slate-200 text-sm text-slate-500">
              <th className="pb-3 font-medium">Order ID</th>
              <th className="pb-3 font-medium">Student</th>
              <th className="pb-3 font-medium">Class</th>
              <th className="pb-3 font-medium">Pickup Time</th>
              <th className="pb-3 font-medium">Total</th>
              <th className="pb-3 font-medium">Status</th>
              <th className="pb-3 font-medium">Actions</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => (
              <tr
                key={order.id}
                className={`border-b border-slate-100 text-sm text-slate-700 ${
                  selectedOrder?.id === order.id ? "bg-slate-50" : ""
                }`}
              >
                <td className="py-4 font-semibold text-slate-900">
                  {order.orderId}
                </td>
                <td className="py-4">{order.studentName}</td>
                <td className="py-4">{order.classSection}</td>
                <td className="py-4">{order.pickupTime}</td>
                <td className="py-4 font-semibold">Rs. {order.totalAmount}</td>
                <td className="py-4">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      statusStyles[order.status]
                    }`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="py-4">
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => onSelectOrder(order)}
                      className="rounded-lg bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200"
                    >
                      View
                    </button>

                    <button
                      onClick={() => onUpdateStatus(order.id, "preparing")}
                      className="rounded-lg bg-sky-100 px-3 py-2 text-xs font-semibold text-sky-700 hover:bg-sky-200"
                    >
                      Preparing
                    </button>

                    <button
                      onClick={() => onUpdateStatus(order.id, "ready")}
                      className="rounded-lg bg-green-100 px-3 py-2 text-xs font-semibold text-green-700 hover:bg-green-200"
                    >
                      Ready
                    </button>

                    <button
                      onClick={() => onUpdateStatus(order.id, "completed")}
                      className="rounded-lg bg-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-300"
                    >
                      Completed
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {orders.length === 0 && (
              <tr>
                <td
                  colSpan="7"
                  className="py-8 text-center text-sm text-slate-500"
                >
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}