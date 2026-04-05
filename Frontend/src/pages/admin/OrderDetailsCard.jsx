export default function OrderDetailsCard({ selectedOrder }) {
  if (!selectedOrder) {
    return (
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-900">Order Details</h2>
        <p className="mt-3 text-sm text-slate-600">
          Select an order from the table to view its full details.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900">Order Details</h2>
        <p className="mt-1 text-sm text-slate-600">
          Review the selected preorder request information.
        </p>
      </div>

      <div className="space-y-5">
        <div>
          <p className="text-sm text-slate-500">Order ID</p>
          <h3 className="text-lg font-semibold text-slate-900">
            {selectedOrder.orderId}
          </h3>
        </div>

        <div>
          <p className="text-sm text-slate-500">Student Name</p>
          <h3 className="text-lg font-semibold text-slate-900">
            {selectedOrder.studentName}
          </h3>
        </div>

        <div>
          <p className="text-sm text-slate-500">Class / Section</p>
          <p className="text-slate-800">{selectedOrder.classSection}</p>
        </div>

        <div>
          <p className="text-sm text-slate-500">Phone Number</p>
          <p className="text-slate-800">{selectedOrder.phone}</p>
        </div>

        <div>
          <p className="text-sm text-slate-500">Pickup Time</p>
          <p className="text-slate-800">{selectedOrder.pickupTime}</p>
        </div>

        <div>
          <p className="text-sm text-slate-500">Items</p>
          <div className="mt-2 space-y-2">
            {selectedOrder.items.map((item, index) => (
              <div
                key={index}
                className="rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-700"
              >
                {item.name} × {item.quantity} — Rs. {item.price}
              </div>
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm text-slate-500">Total Amount</p>
          <h3 className="text-xl font-bold text-green-700">
            Rs. {selectedOrder.totalAmount}
          </h3>
        </div>

        <div>
          <p className="text-sm text-slate-500">Note</p>
          <p className="text-slate-800">
            {selectedOrder.note || "No extra note provided."}
          </p>
        </div>
      </div>
    </div>
  );
}