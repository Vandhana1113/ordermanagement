import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { returnOrder } from "../Slice/OrderSlice";
import { useNavigate } from "react-router-dom"; // ← import useNavigate

const ReturnForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // ← initialize it
  const [returnData, setReturnData] = useState({ orderId: "", reason: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setReturnData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(returnOrder(returnData));
    setReturnData({ orderId: "", reason: "" });
    navigate("/orders"); // ← navigate to Order List after return
  };

  return (
    <div className="flex items-center justify-center min-h-[70vh]">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h3 className="text-xl font-semibold mb-4 text-center">Process Return</h3>
        <input
          name="orderId"
          placeholder="Order ID"
          value={returnData.orderId}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded mb-3"
          required
        />
        <select
          name="reason"
          value={returnData.reason}
          onChange={handleChange}
          required
          className="w-full p-2 border border-gray-300 rounded mb-4"
        >
          <option value="">Select Reason</option>
          <option value="Damaged Item">Damaged Item</option>
          <option value="Wrong Item Delivered">Wrong Item Delivered</option>
          <option value="Customer Rejected">Customer Rejected</option>
        </select>
        <button
          type="submit"
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition w-full"
        >
          Submit Return
        </button>
      </form>
    </div>
  );
};

export default ReturnForm;

