import { useState } from "react";
import OrdersTable from "./OrdersTable";
import OrderDetailsCard from "./OrderDetailsCard";

const initialOrders = [
  {
    id: 1,
    orderId: "#ORD-001",
    studentName: "Aarav Rai",
    classSection: "Grade 10 - A",
    phone: "9800000001",
    pickupTime: "10:30 AM",
    totalAmount: 120,
    status: "pending",
    note: "Please make it a little less spicy.",
    items: [
      { name: "Chicken Momo", quantity: 1, price: 120 },
    ],
  },
  {
    id: 2,
    orderId: "#ORD-002",
    studentName: "Sujal Karki",
    classSection: "Grade 9 - B",
    phone: "9800000002",
    pickupTime: "11:15 AM",
    totalAmount: 160,
    status: "preparing",
    note: "",
    items: [
      { name: "Veg Chowmein", quantity: 1, price: 90 },
      { name: "Fresh Juice", quantity: 1, price: 70 },
    ],
  },
  {
    id: 3,
    orderId: "#ORD-003",
    studentName: "Asmita Bista",
    classSection: "Grade 8 - C",
    phone: "9800000003",
    pickupTime: "12:00 PM",
    totalAmount: 50,
    status: "ready",
    note: "Pickup by friend.",
    items: [
      { name: "Samosa", quantity: 2, price: 25 },
    ],
  },
];

export default function OrdersPage() {
  const [orders, setOrders] = useState(initialOrders);
  const [selectedOrder, setSelectedOrder] = useState(initialOrders[0]);

  const handleSelectOrder = (order) => {
    setSelectedOrder(order);
  };

  const handleUpdateStatus = (id, newStatus) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === id ? { ...order, status: newStatus } : order
      )
    );

    setSelectedOrder((prev) =>
      prev && prev.id === id ? { ...prev, status: newStatus } : prev
    );
  };

  return (
    <section className="space-y-8">
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <h1 className="text-3xl font-bold text-slate-900">Manage Orders</h1>
        <p className="mt-2 text-slate-600">
          View preorder requests, inspect order details, and update order status.
        </p>
      </div>

      <div className="grid gap-8 xl:grid-cols-5">
        <div className="xl:col-span-3">
          <OrdersTable
            orders={orders}
            onSelectOrder={handleSelectOrder}
            onUpdateStatus={handleUpdateStatus}
            selectedOrder={selectedOrder}
          />
        </div>

        <div className="xl:col-span-2">
          <OrderDetailsCard selectedOrder={selectedOrder} />
        </div>
      </div>
    </section>
  );
}
