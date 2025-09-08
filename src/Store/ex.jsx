import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { editOrder } from "../Slice/OrderSlice";
import { useNavigate, useParams } from "react-router-dom";

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

  const order = useSelector((state) =>
    state.orders.orders.find((o) => o.orderId === orderId)
  );

  const [formData, setFormData] = useState(null);

  useEffect(() => {
    if (order) {
      setFormData({ ...order });
    }
  }, [order]);

  if (!formData) {
    return <p className="text-center text-red-600">Order not found</p>;
  }

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const updateProduct = (index, field, value) => {
    const updated = [...formData.products];
    updated[index][field] = value === "" ? "" : field === "productName" ? value : Number(value);
    setFormData({ ...formData, products: updated });
  };

  const addProduct = () => {
    setFormData({
      ...formData,
      products: [...formData.products, { productName: "", price: "", qty: "", Gst: "" }],
    });
  };

  const removeProduct = (index) => {
    if (formData.products.length > 1) {
      const updated = [...formData.products];
      updated.splice(index, 1);
      setFormData({ ...formData, products: updated });
    }
  };

  const subtotal = formData.products.reduce(
    (sum, p) => sum + Number(p.price || 0) * Number(p.qty || 0),
    0
  );
  const totalGST = formData.products.reduce((sum, p) => sum + Number(p.Gst || 0), 0);
  const totalAmount = subtotal + totalGST;

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedOrder = { ...formData, subtotal, totalGST, totalAmount };
    dispatch(editOrder({ orderId, updatedData: updatedOrder }));
    navigate("/");
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-6xl p-6 max-h-[95vh] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">Edit Order #{formData.orderId}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Customer Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Customer Name"
              value={formData.customerName}
              onChange={(e) => handleChange("customerName", e.target.value)}
              className="px-4 py-2 border rounded w-full"
            />
            <input
              type="text"
              placeholder="Staff Name"
              value={formData.staffName}
              onChange={(e) => handleChange("staffName", e.target.value)}
              className="px-4 py-2 border rounded w-full"
            />
            <select
              value={formData.branch}
              onChange={(e) => handleChange("branch", e.target.value)}
              className="px-4 py-2 border rounded w-full"
            >
              <option value="">Select Branch</option>
              {Object.keys(branchPartners).map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>

          {/* Payment & Incentive */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <select
              value={formData.paymentMode}
              onChange={(e) => handleChange("paymentMode", e.target.value)}
              className="px-4 py-2 border rounded w-full"
            >
              <option value="Prepaid">Prepaid</option>
              <option value="COD with Advance">COD with Advance</option>
            </select>
            <input
              type="number"
              placeholder="Incentive"
              value={formData.incentive}
              onChange={(e) => handleChange("incentive", e.target.value)}
              className="px-4 py-2 border rounded w-full"
            />
            <input
              type="date"
              value={formData.expectedDeliveryDate}
              onChange={(e) => handleChange("expectedDeliveryDate", e.target.value)}
              className="px-4 py-2 border rounded w-full"
            />
          </div>

          {/* Delivery Partner */}
          {formData.branch && (
            <div>
              <label className="block text-sm font-medium">Delivery Partner</label>
              <select
                value={formData.deliveryPartner}
                onChange={(e) => handleChange("deliveryPartner", e.target.value)}
                className="px-4 py-2 border rounded w-full"
              >
                <option value="">Select Partner</option>
                {branchPartners[formData.branch]?.map((partner, idx) => (
                  <option key={idx} value={partner}>{partner}</option>
                ))}
              </select>
            </div>
          )}

          {/* Products Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm border border-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2">Product</th>
                  <th className="px-4 py-2">Price</th>
                  <th className="px-4 py-2">Qty</th>
                  <th className="px-4 py-2">GST</th>
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
                        onChange={(e) => updateProduct(idx, "productName", e.target.value)}
                        className="px-2 py-1 border rounded w-full"
                      />
                    </td>
                    <td className="px-2 py-1">
                      <input
                        type="number"
                        value={p.price}
                        onChange={(e) => updateProduct(idx, "price", e.target.value)}
                        className="px-2 py-1 border rounded w-full"
                      />
                    </td>
                    <td className="px-2 py-1">
                      <input
                        type="number"
                        value={p.qty}
                        onChange={(e) => updateProduct(idx, "qty", e.target.value)}
                        className="px-2 py-1 border rounded w-full"
                      />
                    </td>
                    <td className="px-2 py-1">
                      <input
                        type="number"
                        value={p.Gst}
                        onChange={(e) => updateProduct(idx, "Gst", e.target.value)}
                        className="px-2 py-1 border rounded w-full"
                      />
                    </td>
                    <td className="px-2 py-1 text-center">
                      <button
                        type="button"
                        onClick={() => removeProduct(idx)}
                        className="text-red-600 hover:text-red-800"
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
              className="mt-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Add Product
            </button>
          </div>

          {/* Totals */}
          <div className="flex justify-end gap-6 mt-4 text-right">
            <div>Subtotal: ₹{subtotal}</div>
            <div>GST: ₹{totalGST}</div>
            <div>Total: ₹{totalAmount}</div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-4 mt-4">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="px-4 py-2 border rounded hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Update Order
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditOrderForm;

