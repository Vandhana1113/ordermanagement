import React, { useState } from "react";
import OrderForm from "./OrderForm";
import OrderList from "./OrderList";
import ReturnForm from "./ReturnForm";

const Ordermanage = () => {
  
  const [orders, setOrders] = useState([]);

  const handleAddOrder = (newOrder) => {
    setOrders((prev) => [...prev, newOrder]);
  };

  const handleAdvanceStatus = (orderId) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.orderId === orderId) {
          const currentIndex = statusFlow.indexOf(order.status);
          const nextStatus = statusFlow[currentIndex + 1] || "Closed";
          return { ...order, status: nextStatus };
        }
        return order;
      })
    );
  };

  const handleReturn = ({ orderId, reason }) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.orderId === orderId) {
          return { ...order, status: "Returned", returnReason: reason };
        }
        return order;
      })
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Order Management</h1>

      <div className="flex flex-col lg:flex-row lg:space-x-6">
        <div className="flex-1">
          <OrderForm onAddOrder={handleAddOrder} />
          <ReturnForm onReturn={handleReturn} />
        </div>
        <div className="flex-1 mt-6 lg:mt-0">
          <OrderList orders={orders} onAdvanceStatus={handleAdvanceStatus} />
        </div>
      </div>
    </div>
  );
};


export default Ordermanage;

const statusFlow = ["Draft", "Confirmed", "Picked", "Dispatched", "Delivered", "Closed"];
