import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { advanceStatus, deleteOrder, cancelReturn } from "../Slice/OrderSlice";
import BillingModal from "../Components/BillingModel";
import { useNavigate } from "react-router-dom";
import { EyeIcon, PaperAirplaneIcon, PencilSquareIcon, TrashIcon, ArrowUturnLeftIcon } from '@heroicons/react/24/solid';
import Deletepopup from "../Pages/Deletepopup";
import ConfirmModal from "../Pages/Statusconfirm"

const OrderList = () => {

  const navigate = useNavigate();
  const orders = useSelector((state) => state.orders.orders);

  const dispatch = useDispatch();
  const [selectedOrder, setSelectedOrder] = useState(null);

  const [orderToDelete, setOrderToDelete] = useState(null); // ✅ modal state

  // 🔹 Confirm delete
  const handleDeleteConfirm = () => {
    if (orderToDelete) {
      dispatch(deleteOrder(orderToDelete.orderId));
      setOrderToDelete(null);
    }
  };

  const [orderToAdvance, setOrderToAdvance] = useState(null);// ✅  status popup

  const handleAdvanceConfirm = () => {
    if (orderToAdvance) {
      dispatch(advanceStatus(orderToAdvance.orderId));
      setOrderToAdvance(null);
    }
  };

  return (
    <div className="mt-3 bg-white rounded-lg">
      <h3 className="text-xl font-semibold mb-4">Orders</h3>

      {orders.length === 0 ? (
        <p className="text-gray-500 text-center">No orders yet.</p>
      ) : (
        <div className="overflow-x-auto w-full">
          <table className="w-full bg-white rounded shadow-md border border-gray-200">
            <thead>
              <tr className="bg-gray-100 text-gray-600 text-sm">
                <th className="py-3 px-6 text-left">Order ID</th>
                {/* ✅ Order Date & Time */}
                <th className="py-3 px-6 text-left">Order Date</th>
                <th className="py-3 px-6 text-left">Customer</th>
                <th className="py-3 px-6 text-left">Branch</th>
                {/* <th className="py-3 px-6 text-left">Qty</th>
                <th className="py-3 px-6 text-left">Unit ₹</th> */}
                <th className="py-3 px-6 text-left">₹ Total</th>
                {/* ✅ Payment Type */}
                <th className="py-3 px-6 text-left">Payment Type</th>
                <th className="py-3 px-6 text-left">Status</th>
                {/* ✅ Expected Delivery Date */}
                <th className="py-3 px-6 text-left">Delivery Date</th>
                <th className="py-3 px-6 text-center">Actions</th>
                <th className="py-3 px-6 text-center">Options</th>
                <th className="py-3 px-6 text-center">Download</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {orders.map((order) => (
                <tr key={order.orderId} className="border-b hover:bg-gray-50">
                  <td className="py-2 px-4">{order.orderId}</td>
                  {/* ✅ Show Date & Time */}
                  <td className="py-2 px-4">
                    {order.orderDate} <br />
                    <span className="text-xs text-gray-500">
                      {order.orderTime}
                    </span>
                  </td>

                  <td className="py-2 px-4">{order.customerName}</td>
                  <td className="py-2 px-4">{order.branch}</td>
                  {/* <td className="py-2 px-4">{order.quantity}</td>
                  <td className="py-2 px-4">₹{order.unitPrice.toFixed(2)}</td> */}
                  <td className="py-2 px-4">₹{order.totalAmount.toFixed(2)}</td>
                  {/* ✅ Show Payment Type */}
                  <td className="py-2 px-4">{order.paymentMode}</td>
                  <td className="py-3 px-6 text-left">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold 
                        ${order.status === "Draft"
                          ? "bg-gray-200 text-gray-800"
                          : order.status === "Returned"
                            ? "bg-red-200 text-red-800"
                            : order.status === "Confirmed"
                              ? "bg-yellow-200 text-yellow-800"
                              : order.status === "Delivered"
                                ? "bg-green-200 text-green-800"
                                : "bg-blue-200 text-blue-800"
                        }`}
                    >
                      {order.status}
                    </span>

                    {order.status === "Returned" && order.returnReason && (
                      <p className="text-red-500 mt-1 text-xs italic">
                        Returned: {order.returnReason}
                      </p>
                    )}
                  </td>



                  {/* ✅ Show Delivery Date */}
                  <td className="py-2 px-4">{order.expectedDeliveryDate}</td>



                  <td className="py-2 px-4 text-center space-x-2">
                    {order.status !== "Closed" && order.status !== "Returned" && (
                      <button
                        onClick={() => setOrderToAdvance(order)} // ✅ open modal instead of window.confirm
                        disabled={order.status === "Delivered"}
                        className={`px-3 py-1 rounded-md text-sm transition ${order.status === "Delivered"
                            ? "bg-gray-400 text-white cursor-not-allowed"
                            : "bg-green-600 text-white hover:bg-green-700"
                          }`}
                      >
                        <PaperAirplaneIcon className="h-4 w-4" />
                      </button>

                    )}


                    {order.status === "Returned" && (
                      <button
                        disabled={order.status === "Returned"}
                        className={`px-3 py-1 rounded-md text-sm transition ${order.status === "Returned"
                          ? "bg-gray-400 text-white cursor-not-allowed"
                          : "bg-green-600 text-white hover:bg-green-700"
                          }`}
                      >
                        <PaperAirplaneIcon className="h-4 w-4" />
                      </button>
                    )}
                  </td>
                  <td className="py-3 px-6 text-center">
                    <div className="flex justify-center gap-2">
                      <button
                        className="bg-blue-600 text-white px-2 py-1 rounded-md text-sm hover:bg-blue-700 transition"
                        onClick={() => navigate(`/view/${order.orderId}`)}
                      >
                        <EyeIcon className="h-4 w-4" />
                      </button>

                      <button
                        className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                        onClick={() => navigate(`/edit/${order.orderId}`)}
                      >
                        <PencilSquareIcon className="h-4 w-4" />
                      </button>

                      {/* Delete Button → opens modal */}
                      <button
                        className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
                        onClick={() => setOrderToDelete(order)}
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>


                      <button
                        className="bg-purple-600 text-white px-2 py-1 rounded hover:bg-purple-700"
                        onClick={() => navigate(`/return/${order.orderId}`)}
                      >
                        <ArrowUturnLeftIcon className="h-4 w-4" />
                      </button>

                    </div>
                  </td>



                  <td className="py-3 px-6 text-center">
                    <button
                      onClick={() => setSelectedOrder(order)}
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
        <BillingModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}

      {/* ✅ Delete confirmation modal */}
      <Deletepopup
        isOpen={orderToDelete !== null}
        onClose={() => setOrderToDelete(null)}
        onConfirm={handleDeleteConfirm}
        itemName={
          orderToDelete
            ? `Order #${orderToDelete.orderId} (${orderToDelete.customerName})`
            : ""
        }
        title="Delete Order?"
        message="This will permanently delete"
      />

      {/* ✅ Advance confirmation modal */}
      <ConfirmModal
        isOpen={orderToAdvance !== null}
        onClose={() => setOrderToAdvance(null)}
        onConfirm={handleAdvanceConfirm}
        title="Advance Order Status?"
        message={
          orderToAdvance
            ? `Are you sure you want to move order (${orderToAdvance.orderId}) from status "${orderToAdvance.status}" to the next status?`
            : ""
        }
      />
    </div>
  );
};

export default OrderList;
