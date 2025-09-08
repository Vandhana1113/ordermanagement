import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { returnOrder } from "../Slice/OrderSlice";
import { useNavigate, useParams } from "react-router-dom"; // ← import useParams

const ReturnForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { orderId } = useParams(); // ✅ get id from route

  const [returnData, setReturnData] = useState({ orderId: "", reason: "" });

  // ✅ prefill orderId from URL when component loads
  useEffect(() => {
    if (orderId) {
      setReturnData((prev) => ({ ...prev, orderId }));
    }
  }, [orderId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setReturnData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(returnOrder(returnData));
    setReturnData({ orderId: "", reason: "" });
    navigate("/"); // redirect to order list after submission
  };

  return (
    <div className="fixed inset-0 bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="flex items-center justify-center min-h-[70vh]">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded shadow-md w-full max-w-md relative"
        >
          {/* Close Button */}
          <button
            type="button"
            onClick={() => navigate("/")}
            className="absolute top-2 right-2 text-gray-600 px-2 py-1 hover:text-red-700 transition mb-5"
          >
            X
          </button>

          <h3 className="text-xl font-semibold mb-4 text-center">Process Return</h3>

          {/* ✅ Prefilled Order ID */}
          <input
            name="orderId"
            placeholder="Order ID"
            value={returnData.orderId}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded mb-3 bg-gray-100"
            readOnly
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
    </div>
  );
};

export default ReturnForm;
