import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addOrder } from "../Slice/OrderSlice";
import { useNavigate } from "react-router-dom";

const branchPartners = {
  Chennai: ["Partner A1", "Partner A2"],
  Salem: ["Partner B1", "Partner B2"],
  Coimbatore: ["Partner C1"],
  Vellore: ["Partner D1", "Partner D2"],
  Thiruvallur: ["Partner T1", "Partner T2"],
};

const OrderForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [customerName, setCustomerName] = useState("");
  const [paymentMode, setPaymentMode] = useState("Prepaid");
  const [branch, setBranch] = useState("");
  const [expectedDeliveryDate, setExpectedDeliveryDate] = useState("");
  const [incentive, setIncentive] = useState(0);
  const [deliveryPartner, setDeliveryPartner] = useState("");
  const [staffName, setStaffName] = useState("");
  const [products, setProducts] = useState([
    { productName: "", price: "", qty: "", Gst: "" },
  ]);

  // Add product row
  const addProduct = () => {
    setProducts([
      ...products,
      { productName: "", price: "", qty: "", Gst: "" },
    ]);
  };

  // Remove product row
  const removeProduct = (index) => {
    if (products.length > 1) {
      const updated = [...products];
      updated.splice(index, 1);
      setProducts(updated);
    }
  };

  // Update product
  const updateProduct = (index, field, value) => {
    const updated = [...products];
    updated[index][field] = value === "" ? "" : field === "productName" ? value : Number(value);
    setProducts(updated);
  };

  // Totals
  const subtotal = products.reduce(
    (sum, p) => sum + Number(p.price || 0) * Number(p.qty || 0),
    0
  );
  const totalGST = products.reduce((sum, p) => sum + Number(p.Gst || 0), 0);
  const totalAmount = subtotal + totalGST;
  const totalItems = products.reduce((sum, p) => sum + Number(p.qty || 0), 0);
  const itemsCount = products.length;

  // Handle submit
  const handleSubmit = (e) => {
    e.preventDefault();
    const orderId = `ORD-${Date.now()}`;
    const now = new Date();
    const formattedDate = now.toISOString().split("T")[0];
    const formattedTime = now.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

    const cleanedProducts = products.map((p) => {
      const subTotal = Number(p.price || 0) * Number(p.qty || 0);
      const total = subTotal + Number(p.Gst || 0);
      return {
        productName: p.productName,
        price: Number(p.price),
        qty: Number(p.qty),
        Gst: Number(p.Gst),
        subTotal,
        total,
      };
    });

    const newOrder = {
      orderId,
      staffName,
      customerName,
      incentive: Number(incentive),
      deliveryPartner,
      paymentMode,
      branch,
      expectedDeliveryDate,
      orderDate: formattedDate,
      orderTime: formattedTime,
      status: "Draft",
      products: cleanedProducts,
      subtotal,
      totalGST,
      totalAmount,
      itemsCount,
      totalItems,
    };

    dispatch(addOrder(newOrder));

    // Reset form
    setStaffName("");
    setIncentive(0);
    setDeliveryPartner("");
    setCustomerName("");
    setPaymentMode("Prepaid");
    setBranch("");
    setExpectedDeliveryDate("");
    setProducts([{ productName: "", price: "", qty: "", Gst: "" }]);

    navigate("/")
  };

  return (
    <div className="fixed inset-0 bg-opacity-0.5 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-6xl p-6 max-h-[95vh] overflow-y-auto relative">
        <form onSubmit={handleSubmit}>
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-semibold">Create Order</h2>
          </div>

          {/* Order Details */}
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium">Customer Name</label>
              <input
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full border px-3 py-2 rounded"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Payment Type</label>
              <select
                value={paymentMode}
                onChange={(e) => setPaymentMode(e.target.value)}
                className="w-full border px-3 py-2 rounded"
                required
              >
                <option value="Prepaid">Prepaid</option>
                <option value="COD with Advance">COD with Advance</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium">Staff Name</label>
              <input
                value={staffName}
                onChange={(e) => setStaffName(e.target.value)}
                className="w-full border px-3 py-2 rounded"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Staff Incentive</label>
              <input
                type="number"
                value={incentive === 0 ? "" : incentive}
                onChange={(e) =>
                  setIncentive(e.target.value === "" ? 0 : Number(e.target.value))
                }
                className="w-full border px-3 py-2 rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Branch</label>
              <select
                value={branch}
                onChange={(e) => {
                  setBranch(e.target.value);
                  setDeliveryPartner("");
                }}
                className="w-full border px-3 py-2 rounded"
                required
              >
                <option value="">Select a branch</option>
                <option value="Chennai">Chennai</option>
                <option value="Salem">Salem</option>
                <option value="Coimbatore">Coimbatore</option>
                <option value="Vellore">Vellore</option>
                <option value="Thiruvallur">Thiruvallur</option>
              </select>
            </div>

            {branch && (
              <div>
                <label className="block text-sm font-medium">Delivery Partner</label>
                <select
                  value={deliveryPartner}
                  onChange={(e) => setDeliveryPartner(e.target.value)}
                  className="w-full border px-3 py-2 rounded"
                  required
                >
                  <option value="">Select a partner</option>
                  {branchPartners[branch]?.map((partner, idx) => (
                    <option key={idx} value={partner}>
                      {partner}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium">Expected Delivery Date</label>
              <input
                type="date"
                value={expectedDeliveryDate}
                onChange={(e) => setExpectedDeliveryDate(e.target.value)}
                className="w-full border px-3 py-2 rounded"
                required
              />
            </div>
          </div>

          {/* Products Table */}
          <table className="w-full table-fixed border-collapse border border-gray-300 mb-4">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2">S.No</th>
                <th className="border p-2">Product Name</th>
                <th className="border p-2">Price</th>
                <th className="border p-2">Qty</th>
                <th className="border p-2">GST</th>
                <th className="border p-2">Subtotal</th>
                <th className="border p-2">Total</th>
                <th className="border p-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p, i) => {
                const subTotal = Number(p.price || 0) * Number(p.qty || 0);
                const total = subTotal + Number(p.Gst || 0);
                return (
                  <tr key={i} className="text-center">
                    <td className="border p-2">{i + 1}</td>
                    <td className="border p-2">
                      <input
                        type="text"
                        value={p.productName}
                        onChange={(e) => updateProduct(i, "productName", e.target.value)}
                        className="w-full px-2 py-1 border rounded"
                        required
                      />
                    </td>
                    <td className="border p-2">
                      <input
                        type="number"
                        value={p.price === "" ? "" : p.price}
                        onChange={(e) => updateProduct(i, "price", e.target.value)}
                        className="w-full px-2 py-1 border rounded"
                        required
                      />
                    </td>
                    <td className="border p-2">
                      <input
                        type="number"
                        value={p.qty === "" ? "" : p.qty}
                        onChange={(e) => updateProduct(i, "qty", e.target.value)}
                        className="w-full px-2 py-1 border rounded"
                        required
                      />
                    </td>
                    <td className="border p-2">
                      <input
                        type="number"
                        value={p.Gst === "" ? "" : p.Gst}
                        onChange={(e) => updateProduct(i, "Gst", e.target.value)}
                        className="w-full px-2 py-1 border rounded"
                        required
                      />
                    </td>
                    <td className="border p-2">{subTotal.toFixed(2)}</td>
                    <td className="border p-2">{total.toFixed(2)}</td>
                    <td className="border p-2">
                      <button
                        type="button"
                        onClick={() => removeProduct(i)}
                        className="text-red-600 hover:underline"
                        disabled={products.length === 1}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                );
              })}
              <tr>
                <td colSpan="8" className="text-left p-2">
                  <button
                    type="button"
                    onClick={addProduct}
                    className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                  >
                    Add Product
                  </button>
                </td>
              </tr>
            </tbody>
          </table>

          {/* Totals */}
          <div className="flex justify-between items-start mb-3 mt-5">
            <div className="text-left space-y-1">
              <p>Items Count: {itemsCount}</p>
              <p>Total Quantity: {totalItems}</p>
            </div>
            <div className="text-right space-y-1">
              <p>Subtotal: ₹{subtotal.toFixed(2)}</p>
              <p>Tax (GST): ₹{totalGST.toFixed(2)}</p>
              <p className="font-bold text-lg">Grand Total: ₹{totalAmount.toFixed(2)}</p>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="px-4 py-2 border rounded hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
            >
              Create Order
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OrderForm;
