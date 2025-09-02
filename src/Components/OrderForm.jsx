import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { addOrder } from "../Slice/OrderSlice";
import { useNavigate } from "react-router-dom";

const OrderForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [order, setOrder] = useState({
    orderId: "",
    customerName: "",
    branch: "",
    paymentMode: "Prepaid",
    status: "Draft",
    crossBranch: false,
    quantity: 1,
    unitPrice: 0,
    totalPrice: 0,
  });

  // Automatically calculate total price when quantity or unitPrice changes
  useEffect(() => {
    setOrder((prev) => ({
      ...prev,
      totalPrice: prev.quantity * prev.unitPrice,
    }));
  }, [order.quantity, order.unitPrice]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const parsedValue = type === "checkbox" ? checked : type === "number" ? parseFloat(value) : value;

    setOrder((prev) => ({
      ...prev,
      [name]: parsedValue,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(addOrder(order));
    setOrder({
      orderId: "",
      customerName: "",
      branch: "",
      paymentMode: "Prepaid",
      status: "Draft",
      crossBranch: false,
      quantity: 1,
      unitPrice: 0,
      totalPrice: 0,
    });
    navigate("/orders");
  };

  return (
    <div className="flex items-center justify-center min-h-[70vh]">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-md w-full max-w-md mb-6"
      >
        <h3 className="text-xl font-semibold mb-4 text-center">Create Order</h3>

        <input
          name="orderId"
          placeholder="Order ID"
          value={order.orderId}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded mb-3"
          required
        />
        <input
          name="customerName"
          placeholder="Customer Name"
          value={order.customerName}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded mb-3"
          required
        />
        <input
          name="branch"
          placeholder="Origin Branch"
          value={order.branch}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded mb-3"
          required
        />

        <div className="flex space-x-3 mb-3">
          <input
            name="quantity"
            type="number"
            placeholder="Quantity"
            value={order.quantity}
            onChange={handleChange}
            className="w-1/2 p-2 border border-gray-300 rounded"
            min="1"
            required
          />
          <input
            name="unitPrice"
            type="number"
            placeholder="Unit Price"
            value={order.unitPrice}
            onChange={handleChange}
            className="w-1/2 p-2 border border-gray-300 rounded"
            min="0"
            required
          />
        </div>

        <div className="mb-3">
          <span className="text-sm font-medium text-gray-700">Total Price:</span>
          <div className="w-full p-2 border border-gray-300 rounded bg-gray-100">
            ₹ {order.totalPrice.toFixed(2)}
          </div>
        </div>

        <label className="block mb-3">
          <span className="text-sm font-medium text-gray-700 mb-1">Payment Mode:</span>
          <select
            name="paymentMode"
            value={order.paymentMode}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
          >
            <option value="Prepaid">Prepaid</option>
            <option value="COD with Advance">COD with Advance</option>
          </select>
        </label>

        <label className="flex items-center space-x-2 mb-4">
          <input
            type="checkbox"
            name="crossBranch"
            checked={order.crossBranch}
            onChange={handleChange}
            className="form-checkbox"
          />
          <span>Cross-Branch Fulfillment</span>
        </label>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition w-full mb-2"
        >
          Add Order
        </button>

        <button
          type="button"
          onClick={() => navigate("/orders")}
          className="w-full bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 transition"
        >
          View Order List
        </button>
      </form>
    </div>
  );
};

export default OrderForm;
