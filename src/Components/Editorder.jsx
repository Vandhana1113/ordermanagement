import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { editOrder } from "../Slice/OrderSlice";
import { useNavigate, useParams } from "react-router-dom";
import ConfirmPopup from "../Pages/Confirmpopup"; // ✅ Import popup

const branchPartners = {
  Chennai: ["Partner A1", "Partner A2"],
  Salem: ["Partner B1", "Partner B2"],
  Coimbatore: ["Partner C1"],
  Vellore: ["Partner D1", "Partner D2"],
  Thiruvallur: ["Partner T1", "Partner T2"],
};

const EditOrderForm = () => {
  const { orderId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { orders, statusFlow } = useSelector((state) => state.orders);
  const order = orders.find((o) => o.orderId === orderId);

  const [formData, setFormData] = useState(null);

  // ✅ Popup states
  const [showPopup, setShowPopup] = useState(false);
  const [pendingStatus, setPendingStatus] = useState(null);

  useEffect(() => {
    if (order) {
      const normalizedProducts = order.products.map((p) => ({
        productName: p.productName || p.name || "",
        price: p.price || p.unitPrice || 0,
        qty: p.qty || p.quantity || 0,
        Gst: p.Gst || p.gst || 0,
      }));
      setFormData({ ...order, products: normalizedProducts });
    }
  }, [order]);

  if (!formData) {
    return <p className="text-center text-red-600">Order not found</p>;
  }

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  // ✅ Status change handler
  const handleStatusSelect = (e) => {
    const newStatus = e.target.value;
    if (newStatus !== formData.status) {
      setPendingStatus(newStatus);
      setShowPopup(true);
    }
  };

  const confirmStatusChange = () => {
    handleChange("status", pendingStatus);
    setPendingStatus(null);
    setShowPopup(false);
  };

  const cancelStatusChange = () => {
    setPendingStatus(null);
    setShowPopup(false);
  };

  const updateProduct = (index, field, value) => {
    const updated = [...formData.products];
    updated[index][field] =
      field === "productName" ? value : Number(value) || 0;
    setFormData({ ...formData, products: updated });
  };

  const addProduct = () => {
    setFormData({
      ...formData,
      products: [
        ...formData.products,
        { productName: "", price: 0, qty: 0, Gst: 0 },
      ],
    });
  };

  const removeProduct = (index) => {
    const updated = [...formData.products];
    updated.splice(index, 1);
    setFormData({ ...formData, products: updated });
  };

  const subtotal = formData.products.reduce(
    (sum, p) => sum + Number(p.price || 0) * Number(p.qty || 0),
    0
  );
  const totalGST = formData.products.reduce(
    (sum, p) => sum + Number(p.Gst || 0),
    0
  );
  const totalAmount = subtotal + totalGST;

  const handleSubmit = (e) => {
    e.preventDefault();

    const updatedOrder = {
      ...formData,
      subtotal,
      totalGST,
      totalAmount,
      products: formData.products.map((p) => ({
        productName: p.productName,
        price: Number(p.price),
        qty: Number(p.qty),
        Gst: Number(p.Gst),
      })),
    };

    dispatch(editOrder({ orderId, updatedData: updatedOrder }));
    navigate("/");
  };

  return (
    <div className="fixed inset-0 bg-opacity-0.5 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-blue-250 rounded-2xl shadow-xl w-full max-w-6xl p-8 max-h-[95vh] overflow-y-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-3">
          ✏️ Edit Order #{formData.orderId}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* ✅ Order Status with confirmation */}
          <div className="p-4 border rounded-lg shadow-sm bg-gray-50">
            <label className="block text-sm font-medium mb-1">Order Status</label>
            <select
              value={formData.status}
              onChange={handleStatusSelect}
              className="px-4 py-2 border rounded-lg w-full focus:ring-2 focus:ring-blue-500"
            >
              {statusFlow.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
              <option value="Returned" className="text-red-600 font-semibold">
                Returned
              </option>
            </select>
          </div>

          {/* ✅ Popup */}
          {showPopup && (
            <ConfirmPopup
              title="Confirm Status Change"
              message={`Are you sure you want to change order status to "${pendingStatus}"?`}
              danger={pendingStatus === "Returned"} // 🔥 red theme if Returned
              onConfirm={confirmStatusChange}
              onCancel={cancelStatusChange}
            />
          )}

          {/* Customer Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-lg shadow-sm bg-gray-100">
            <div>
              <label className="block text-sm font-medium mb-1">Customer Name</label>
              <input
                type="text"
                value={formData.customerName}
                onChange={(e) => handleChange("customerName", e.target.value)}
                className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 w-full"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Staff Name</label>
              <input
                type="text"
                value={formData.staffName}
                onChange={(e) => handleChange("staffName", e.target.value)}
                className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Payment Mode</label>
              <select
                value={formData.paymentMode}
                onChange={(e) => handleChange("paymentMode", e.target.value)}
                className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 w-full"
              >
                <option value="Prepaid">Prepaid</option>
                <option value="COD with Advance">COD with Advance</option>
              </select>
            </div>
          </div>

          {/* Payment & Delivery */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border rounded-lg shadow-sm bg-gray-50">
            <div>
              <label className="block text-sm font-medium mb-1">Incentive</label>
              <input
                type="number"
                value={formData.incentive}
                onChange={(e) => handleChange("incentive", e.target.value)}
                className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 w-full"
                min={0}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Expected Delivery Date
              </label>
              <input
                type="date"
                value={formData.expectedDeliveryDate}
                onChange={(e) =>
                  handleChange("expectedDeliveryDate", e.target.value)
                }
                className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 w-full"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Branch</label>
              <select
                value={formData.branch}
                onChange={(e) => handleChange("branch", e.target.value)}
                className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 w-full"
              >
                <option value="">Select Branch</option>
                {Object.keys(branchPartners).map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>
            {formData.branch && (
              <div>
                <label className="block text-sm font-medium mb-1">
                  Delivery Partner
                </label>
                <select
                  value={formData.deliveryPartner}
                  onChange={(e) => handleChange("deliveryPartner", e.target.value)}
                  className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 w-full"
                >
                  <option value="">Select Partner</option>
                  {branchPartners[formData.branch]?.map((partner, idx) => (
                    <option key={idx} value={partner}>
                      {partner}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Editable Products */}
          <div className="p-4 border rounded-lg shadow-sm bg-gray-50">
            <h3 className="font-semibold text-gray-700 mb-3">Products</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-gray-200 rounded-lg">
                <thead className="bg-gray-100 text-gray-700">
                  <tr>
                    <th className="px-4 py-2 text-left">Product</th>
                    <th className="px-4 py-2">Price</th>
                    <th className="px-4 py-2">Qty</th>
                    <th className="px-4 py-2">GST</th>
                    <th className="px-4 py-2">Subtotal</th>
                    <th className="px-4 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {formData.products.map((p, idx) => (
                    <tr key={idx} className="border-b">
                      <td className="px-2 py-1">
                        <input
                          type="text"
                          value={p.productName}
                          onChange={(e) =>
                            updateProduct(idx, "productName", e.target.value)
                          }
                          className="px-2 py-1 border rounded-lg w-full"
                          required
                        />
                      </td>
                      <td className="px-2 py-1">
                        <input
                          type="number"
                          value={p.price}
                          onChange={(e) =>
                            updateProduct(idx, "price", e.target.value)
                          }
                          className="px-2 py-1 border rounded-lg w-full"
                          min={0}
                          required
                        />
                      </td>
                      <td className="px-2 py-1">
                        <input
                          type="number"
                          value={p.qty}
                          onChange={(e) =>
                            updateProduct(idx, "qty", e.target.value)
                          }
                          className="px-2 py-1 border rounded-lg w-full"
                          min={0}
                          required
                        />
                      </td>
                      <td className="px-2 py-1">
                        <input
                          type="number"
                          value={p.Gst}
                          onChange={(e) =>
                            updateProduct(idx, "Gst", e.target.value)
                          }
                          className="px-2 py-1 border rounded-lg w-full"
                          min={0}
                        />
                      </td>
                      <td className="px-2 py-1 text-center font-medium">
                        ₹{(p.price * p.qty + (p.Gst || 0)).toFixed(2)}
                      </td>
                      <td className="px-2 py-1 text-center">
                        <button
                          type="button"
                          onClick={() => removeProduct(idx)}
                          className="text-red-600 hover:text-red-800 font-medium"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button
                type="button"
                onClick={addProduct}
                className="mt-3 px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700"
              >
                + Add Product
              </button>
            </div>
          </div>

          {/* Totals */}
          <div className="flex justify-end gap-6 mt-4 text-lg font-semibold text-gray-700">
            <div>Subtotal: ₹{subtotal.toFixed(2)}</div>
            <div>GST: ₹{totalGST.toFixed(2)}</div>
            <div>Total: ₹{totalAmount.toFixed(2)}</div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="px-5 py-2 border rounded-lg hover:bg-gray-100 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
            >
              ✅ Update Order
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditOrderForm;
