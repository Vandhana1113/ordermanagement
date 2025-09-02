import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { advanceStatus, cancelReturn } from "../Slice/OrderSlice";
import BillingModal from "./BillingModel";

const OrderList = () => {
  const orders = useSelector((state) => state.orders.orders);
  const dispatch = useDispatch();
  const [selectedOrder, setSelectedOrder] = useState(null);

  return (
    <div className="flex justify-center min-h-[70vh] p-4">
      <div className="w-full max-w-6xl">
        <h3 className="text-xl font-semibold mb-4 text-center">Orders</h3>

        {orders.length === 0 ? (
          <p className="text-gray-500 text-center">No orders yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded shadow-md border border-gray-200">
              <thead>
                <tr className="bg-gray-100 text-gray-600 text-sm">
                  <th className="py-3 px-6 text-left">Order ID</th>
                  <th className="py-3 px-6 text-left">Customer</th>
                  <th className="py-3 px-6 text-left">Branch</th>
                  <th className="py-3 px-6 text-left">Qty</th>
                  <th className="py-3 px-6 text-left">Unit ₹</th>
                  <th className="py-3 px-6 text-left">Total ₹</th>
                  <th className="py-3 px-6 text-left">Status</th>
                  <th className="py-3 px-6 text-center">Actions</th>
                  <th className="py-3 px-6 text-center">Download</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {orders.map((order) => (
                  <tr key={order.orderId} className="border-b hover:bg-gray-50">
                    <td className="py-2 px-4">{order.orderId}</td>
                    <td className="py-2 px-4">{order.customerName}</td>
                    <td className="py-2 px-4">{order.branch}</td>
                    <td className="py-2 px-4">{order.quantity}</td>
                    <td className="py-2 px-4">₹{order.unitPrice.toFixed(2)}</td>
                    <td className="py-2 px-4">₹{order.totalPrice.toFixed(2)}</td>
                    <td className="py-3 px-6 text-left">
                      <span className="text-blue-600 font-semibold">
                        {order.status}
                      </span>
                      {order.status === "Returned" && order.returnReason && (
                        <p className="text-red-500 mt-1 text-xs">
                          Returned: {order.returnReason}
                        </p>
                      )}
                    </td>
                    <td className="py-2 px-4 text-center space-x-2">
                      {order.status !== "Closed" && order.status !== "Returned" && (
                        <button
                          onClick={() => dispatch(advanceStatus(order.orderId))}
                          className="bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700"
                        >
                          Next
                        </button>
                      )}

                      {order.status === "Returned" && (
                        <button
                          onClick={() => dispatch(cancelReturn(order.orderId))}
                          className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
                        >
                          Cancel
                        </button>
                      )}
                    </td>
                    <td className="py-3 px-6 text-center">
                      <button
                        onClick={() => setSelectedOrder(order)} // your download handler
                        className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition"
                      >
                        Invoice
                      </button>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {selectedOrder && (
          <BillingModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />
        )}
      </div>
    </div>
  );
};

export default OrderList;
