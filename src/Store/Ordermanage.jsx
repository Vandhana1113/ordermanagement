// import React, { useState } from "react";
// import OrderForm from "./OrderForm";
// import OrderList from "./OrderList";
// import ReturnForm from "./ReturnForm";

// const Ordermanage = () => {
  
//   const [orders, setOrders] = useState([]);

//   const handleAddOrder = (newOrder) => {
//     setOrders((prev) => [...prev, newOrder]);
//   };

//   const handleAdvanceStatus = (orderId) => {
//     setOrders((prev) =>
//       prev.map((order) => {
//         if (order.orderId === orderId) {
//           const currentIndex = statusFlow.indexOf(order.status);
//           const nextStatus = statusFlow[currentIndex + 1] || "Closed";
//           return { ...order, status: nextStatus };
//         }
//         return order;
//       })
//     );
//   };

//   const handleReturn = ({ orderId, reason }) => {
//     setOrders((prev) =>
//       prev.map((order) => {
//         if (order.orderId === orderId) {
//           return { ...order, status: "Returned", returnReason: reason };
//         }
//         return order;
//       })
//     );
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 p-6">
//       <h1 className="text-3xl font-bold mb-6 text-center">Order Management</h1>

//       <div className="flex flex-col lg:flex-row lg:space-x-6">
//         <div className="flex-1">
//           <OrderForm onAddOrder={handleAddOrder} />
//           <ReturnForm onReturn={handleReturn} />
//         </div>
//         <div className="flex-1 mt-6 lg:mt-0">
//           <OrderList orders={orders} onAdvanceStatus={handleAdvanceStatus} />
//         </div>
//       </div>
//     </div>
//   );
// };


// export default Ordermanage;

// const statusFlow = ["Draft", "Confirmed", "Picked", "Dispatched", "Delivered", "Closed"];


import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addOrder } from "../Slice/OrderSlice";
import { useNavigate } from "react-router-dom";

const OrderForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Form State
  const [originBranch, setOriginBranch] = useState("");
  const [destinationBranch, setDestinationBranch] = useState("");
  const [orderType, setOrderType] = useState("Internal");
  const [paymentMode, setPaymentMode] = useState("Prepaid");
  const [staffPlacedBy, setStaffPlacedBy] = useState("");
  const [staffIncentive, setStaffIncentive] = useState(0);
  const [remarks, setRemarks] = useState("");
  const [products, setProducts] = useState([
    { product: "", quantity: 1, price: 0 },
  ]);

  // Add new product row
  const addProduct = () => {
    setProducts([...products, { product: "", quantity: 1, price: 0 }]);
  };

  // Remove product row
  const removeProduct = (index) => {
    if (products.length > 1) {
      const updated = [...products];
      updated.splice(index, 1);
      setProducts(updated);
    }
  };

  // Update product fields
  const updateProduct = (index, field, value) => {
    const updated = [...products];
    updated[index][field] = value;
    setProducts(updated);
  };

  // Totals
  const subtotal = products.reduce(
    (sum, p) => sum + Number(p.price || 0) * Number(p.quantity || 0),
    0
  );
  const totalItems = products.reduce((sum, p) => sum + Number(p.quantity || 0), 0);
  const itemsCount = products.length;

  // Handle Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    const orderPayload = {
      originBranch,
      destinationBranch,
      products: products.map((p) => ({
        product: p.product,
        quantity: Number(p.quantity),
        price: Number(p.price),
      })),
      orderType,
      paymentMode,
      staffPlacedBy,
      status: "Confirmed",
      staffIncentive: Number(staffIncentive),
      approval: {
        approved: true,
        approvedBy: staffPlacedBy,
      },
      remarks,
    };

    try {
      const res = await fetch("https://herbnas-erp-backend-server.onrender.com/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      });

      if (!res.ok) throw new Error("Failed to create order");

      const savedOrder = await res.json();

      // Update Redux store
      dispatch(addOrder(savedOrder));

      // Reset form
      setOriginBranch("");
      setDestinationBranch("");
      setOrderType("Internal");
      setPaymentMode("Prepaid");
      setStaffPlacedBy("");
      setStaffIncentive(0);
      setRemarks("");
      setProducts([{ product: "", quantity: 1, price: 0 }]);

      navigate("/"); // Redirect back
    } catch (error) {
      console.error("Error creating order:", error);
      alert("Failed to create order. Try again.");
    }
  };

  return (
    <div className="fixed inset-0 bg-opacity-0.5 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-6xl p-6 max-h-[95vh] overflow-y-auto relative">
        <form onSubmit={handleSubmit}>
          <h2 className="text-xl font-semibold mb-4">Create Order</h2>

          {/* Order Details */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium">Origin Branch ID</label>
              <input
                value={originBranch}
                onChange={(e) => setOriginBranch(e.target.value)}
                className="w-full border px-3 py-2 rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Destination Branch ID</label>
              <input
                value={destinationBranch}
                onChange={(e) => setDestinationBranch(e.target.value)}
                className="w-full border px-3 py-2 rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Order Type</label>
              <select
                value={orderType}
                onChange={(e) => setOrderType(e.target.value)}
                className="w-full border px-3 py-2 rounded"
              >
                <option value="Internal">Internal</option>
                <option value="External">External</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium">Payment Mode</label>
              <select
                value={paymentMode}
                onChange={(e) => setPaymentMode(e.target.value)}
                className="w-full border px-3 py-2 rounded"
              >
                <option value="Prepaid">Prepaid</option>
                <option value="COD">COD</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium">Staff Placed By (ID)</label>
              <input
                value={staffPlacedBy}
                onChange={(e) => setStaffPlacedBy(e.target.value)}
                className="w-full border px-3 py-2 rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Staff Incentive</label>
              <input
                type="number"
                value={staffIncentive}
                onChange={(e) => setStaffIncentive(e.target.value)}
                className="w-full border px-3 py-2 rounded"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium">Remarks</label>
              <textarea
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                className="w-full border px-3 py-2 rounded"
              />
            </div>
          </div>

          {/* Products Table */}
          <table className="w-full table-fixed border-collapse border border-gray-300 mb-4">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 p-2">S.No</th>
                <th className="border border-gray-300 p-2">Product ID</th>
                <th className="border border-gray-300 p-2">Quantity</th>
                <th className="border border-gray-300 p-2">Price</th>
                <th className="border border-gray-300 p-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p, i) => (
                <tr key={i} className="text-center">
                  <td className="border border-gray-300 p-2">{i + 1}</td>
                  <td className="border border-gray-300 p-2">
                    <input
                      type="text"
                      value={p.product}
                      onChange={(e) => updateProduct(i, "product", e.target.value)}
                      className="w-full px-2 py-1 border rounded"
                      required
                    />
                  </td>
                  <td className="border border-gray-300 p-2">
                    <input
                      type="number"
                      min="1"
                      value={p.quantity}
                      onChange={(e) => updateProduct(i, "quantity", e.target.value)}
                      className="w-full px-2 py-1 border rounded"
                      required
                    />
                  </td>
                  <td className="border border-gray-300 p-2">
                    <input
                      type="number"
                      min="0"
                      value={p.price}
                      onChange={(e) => updateProduct(i, "price", e.target.value)}
                      className="w-full px-2 py-1 border rounded"
                      required
                    />
                  </td>
                  <td className="border border-gray-300 p-2">
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
              ))}
              <tr>
                <td colSpan="5" className="text-left p-2">
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

// import React, { useState } from "react";
// import { useDispatch } from "react-redux";
// import { addOrder } from "../Slice/OrderSlice";
// import { useNavigate } from "react-router-dom";

// const branchPartners = {
//   "64f0abc123": ["Partner A1", "Partner A2"], // Chennai
//   "64f0def234": ["Partner B1", "Partner B2"], // Salem
//   "64f0ghi345": ["Partner C1"],               // Coimbatore
//   "64f0jkl456": ["Partner D1", "Partner D2"], // Vellore
// };

// const OrderForm = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const [customerName, setCustomerName] = useState("");
//   const [branch, setBranch] = useState("");
//   const [expectedDeliveryDate, setExpectedDeliveryDate] = useState("");
//   const [paymentType, setPaymentType] = useState("UPI");
//   const [deliveryCharge, setDeliveryCharge] = useState(0);
//   const [incentive, setIncentive] = useState(0);
//   const [deliveryPartner, setDeliveryPartner] = useState("");
//   const [staffName, setStaffName] = useState("");

//   // ✅ FIXED initial state: keys must match everywhere
//   const [products, setProducts] = useState([
//     { productName: "", price: "", qty: "", Gst: "" },
//   ]);

//   // Add new product row
//   const addProduct = () => {
//     setProducts([...products, { productName: "", price: "", qty: "", Gst: "" }]);
//   };

//   // Remove product row
//   const removeProduct = (index) => {
//     if (products.length > 1) {
//       const updated = [...products];
//       updated.splice(index, 1);
//       setProducts(updated);
//     }
//   };

//   // Update product fields
//   const updateProduct = (index, field, value) => {
//     const updated = [...products];
//     updated[index][field] = value === "" ? "" : value;
//     if (field !== "productName") {
//       updated[index][field] = value === "" ? "" : Number(value);
//     }
//     setProducts(updated);
//   };

//   // ✅ FIXED totals (use qty and Gst consistently)
//   const subtotal = products.reduce(
//     (sum, p) => sum + Number(p.price || 0) * Number(p.qty || 0),
//     0
//   );
//   const totalGST = products.reduce((sum, p) => sum + Number(p.Gst || 0), 0);
//   const totalAmount = subtotal + totalGST + Number(deliveryCharge || 0);
//   const totalItems = products.reduce((sum, p) => sum + Number(p.qty || 0), 0);
//   const itemsCount = products.length;

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     const cleanedProducts = products.map((p) => ({
//       productName: p.productName,
//       price: Number(p.price),
//       qty: Number(p.qty),
//       Gst: Number(p.Gst),
//     }));

//     const newOrder = {
//       customerName,
//       branch,
//       staffName,
//       expectedDeliveryDate,
//       products: cleanedProducts,
//       paymentType,
//       deliveryCharge: Number(deliveryCharge),
//       incentive: Number(incentive),
//       deliveryPartner,
//     };

//     dispatch(addOrder(newOrder));

//     // Reset form
//     setCustomerName("");
//     setBranch("");
//     setStaffName("");
//     setExpectedDeliveryDate("");
//     setPaymentType("UPI");
//     setDeliveryCharge(0);
//     setIncentive(0);
//     setDeliveryPartner("");
//     setProducts([{ productName: "", price: "", qty: "", Gst: "" }]); // ✅ fixed reset
//   };

//   return (
//     <div className="fixed inset-0 bg-opacity-0.5 backdrop-blur-sm flex items-center justify-center z-50">
//       <div className="bg-white rounded-lg shadow-lg w-full max-w-6xl p-6 max-h-[95vh] overflow-y-auto relative">
//         <form onSubmit={handleSubmit}>
//           <div className="grid grid-cols-3 gap-4 mb-4">
//             {/* Customer Name */}
//             <div>
//               <label className="block text-sm font-medium">Customer Name</label>
//               <input
//                 value={customerName}
//                 onChange={(e) => setCustomerName(e.target.value)}
//                 className="w-full border px-3 py-2 rounded"
//                 required
//               />
//             </div>

//             {/* Expected Delivery Date */}
//             <div>
//               <label className="block text-sm font-medium">
//                 Expected Delivery Date
//               </label>
//               <input
//                 type="date"
//                 value={expectedDeliveryDate}
//                 onChange={(e) => setExpectedDeliveryDate(e.target.value)}
//                 className="w-full border px-3 py-2 rounded"
//                 required
//               />
//             </div>

//             {/* Payment Type */}
//             <div>
//               <label className="block text-sm font-medium">Payment Type</label>
//               <select
//                 value={paymentType}
//                 onChange={(e) => setPaymentType(e.target.value)}
//                 className="w-full border px-3 py-2 rounded"
//                 required
//               >
//                 <option value="UPI">UPI</option>
//                 <option value="Card">Card</option>
//                 <option value="Cash">Cash</option>
//               </select>
//             </div>

//             {/* Delivery Charge */}
//             <div>
//               <label className="block text-sm font-medium">Delivery Charge</label>
//               <input
//                 type="number"
//                 value={deliveryCharge}
//                 onChange={(e) => setDeliveryCharge(e.target.value)}
//                 className="w-full border px-3 py-2 rounded"
//               />
//             </div>

//             {/* Staff Name */}
//             <div>
//               <label className="block text-sm font-medium">Staff Name</label>
//               <input
//                 value={staffName}
//                 onChange={(e) => setStaffName(e.target.value)}
//                 className="w-full border px-3 py-2 rounded"
//                 required
//               />
//             </div>

//             {/* Staff Incentive */}
//             <div>
//               <label className="block text-sm font-medium">Staff Incentive</label>
//               <input
//                 type="number"
//                 value={incentive}
//                 onChange={(e) => setIncentive(e.target.value)}
//                 className="w-full border px-3 py-2 rounded"
//               />
//             </div>

//             {/* Branch */}
//             <div>
//               <label className="block text-sm font-medium">Branch</label>
//               <select
//                 value={branch}
//                 onChange={(e) => {
//                   setBranch(e.target.value);
//                   setDeliveryPartner("");
//                 }}
//                 className="w-full border px-3 py-2 rounded"
//                 required
//               >
//                 <option value="">Select a branch</option>
//                 <option value="64f0abc123">Chennai</option>
//                 <option value="64f0def234">Salem</option>
//                 <option value="64f0ghi345">Coimbatore</option>
//                 <option value="64f0jkl456">Vellore</option>
//               </select>
//             </div>

//             {/* Delivery Partner */}
//             {branch && (
//               <div>
//                 <label className="block text-sm font-medium">Delivery Partner</label>
//                 <select
//                   value={deliveryPartner}
//                   onChange={(e) => setDeliveryPartner(e.target.value)}
//                   className="w-full border px-3 py-2 rounded"
//                   required
//                 >
//                   <option value="">Select a partner</option>
//                   {branchPartners[branch]?.map((partner, idx) => (
//                     <option key={idx} value={partner}>
//                       {partner}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//             )}
//           </div>

//           {/* ✅ Products Table */}
//           <table className="w-full table-fixed border-collapse border border-gray-300 mb-4">
//             <thead>
//               <tr className="bg-gray-100">
//                 <th className="border border-gray-300 p-2">S.No</th>
//                 <th className="border border-gray-300 p-2">Product Name</th>
//                 <th className="border border-gray-300 p-2">Price</th>
//                 <th className="border border-gray-300 p-2">Qty</th>
//                 <th className="border border-gray-300 p-2">GST</th>
//                 <th className="border border-gray-300 p-2">Subtotal</th>
//                 <th className="border border-gray-300 p-2">Total</th>
//                 <th className="border border-gray-300 p-2">Action</th>
//               </tr>
//             </thead>
//             <tbody>
//               {products.map((p, i) => {
//                 const subTotal = Number(p.price || 0) * Number(p.qty || 0);
//                 const total = subTotal + Number(p.Gst || 0);
//                 return (
//                   <tr key={i} className="text-center">
//                     <td className="border border-gray-300 p-2">{i + 1}</td>
//                     <td className="border border-gray-300 p-2">
//                       <input
//                         type="text"
//                         value={p.productName}
//                         onChange={(e) =>
//                           updateProduct(i, "productName", e.target.value)
//                         }
//                         className="w-full px-2 py-1 border rounded"
//                         required
//                       />
//                     </td>
//                     <td className="border border-gray-300 p-2">
//                       <input
//                         type="number"
//                         min="0"
//                         value={p.price === "" ? "" : p.price}
//                         placeholder="0"
//                         onChange={(e) => updateProduct(i, "price", e.target.value)}
//                         className="w-full px-2 py-1 border rounded"
//                         required
//                       />
//                     </td>
//                     <td className="border border-gray-300 p-2">
//                       <input
//                         type="number"
//                         min="1"
//                         value={p.qty === "" ? "" : p.qty}
//                         placeholder="0"
//                         onChange={(e) => updateProduct(i, "qty", e.target.value)}
//                         className="w-full px-2 py-1 border rounded"
//                         required
//                       />
//                     </td>
//                     <td className="border border-gray-300 p-2">
//                       <input
//                         type="number"
//                         min="0"
//                         value={p.Gst === "" ? "" : p.Gst}
//                         placeholder="0"
//                         onChange={(e) => updateProduct(i, "Gst", e.target.value)}
//                         className="w-full px-2 py-1 border rounded"
//                         required
//                       />
//                     </td>
//                     <td className="border border-gray-300 p-2">
//                       {subTotal.toFixed(2)}
//                     </td>
//                     <td className="border border-gray-300 p-2">
//                       {total.toFixed(2)}
//                     </td>
//                     <td className="border border-gray-300 p-2">
//                       <button
//                         type="button"
//                         onClick={() => removeProduct(i)}
//                         className="text-red-600 hover:underline"
//                         disabled={products.length === 1}
//                         title={
//                           products.length === 1
//                             ? "At least one product required"
//                             : "Remove product"
//                         }
//                       >
//                         Remove
//                       </button>
//                     </td>
//                   </tr>
//                 );
//               })}
//               <tr>
//                 <td colSpan="8" className="text-left p-2">
//                   <button
//                     type="button"
//                     onClick={addProduct}
//                     className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
//                   >
//                     Add Product
//                   </button>
//                 </td>
//               </tr>
//             </tbody>
//           </table>

//           {/* Totals */}
//           <div className="flex justify-between items-start mb-3 mt-5">
//             <div className="text-left space-y-1">
//               <p>Items Count: {itemsCount}</p>
//               <p>Total Quantity: {totalItems}</p>
//             </div>

//             <div className="text-right space-y-1">
//               <p>Subtotal: ₹{subtotal.toFixed(2)}</p>
//               <p>Tax (GST): ₹{totalGST.toFixed(2)}</p>
//               <p className="font-bold text-lg">
//                 Grand Total: ₹{totalAmount.toFixed(2)}
//               </p>
//             </div>
//           </div>

//           {/* Buttons */}
//           <div className="flex justify-end gap-4">
//             <button
//               type="button"
//               onClick={() => navigate("/")}
//               className="px-4 py-2 border rounded hover:bg-gray-200"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
//             >
//               Create Order
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default OrderForm;



// import React, { useState } from "react";
// import { useDispatch } from "react-redux";
// import { addOrder } from "../Slice/OrderSlice";
// import { useNavigate } from "react-router-dom";

// const OrderForm = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const [orderId, setOrderId] = useState("");
//   const [customerName, setCustomerName] = useState("");
//   const [paymentMode, setPaymentMode] = useState("Prepaid");
//   const [branch, setBranch] = useState("");
//   const [expectedDeliveryDate, setExpectedDeliveryDate] = useState("");
//   const [products, setProducts] = useState([
//     { productName: "", price: "", qty: "", Gst: "" },
//   ]);

//   // Add new product row
//   const addProduct = () => {
//     setProducts([
//       ...products,
//       { productName: "", price: "", qty: "", Gst: "" },
//     ]);
//   };

//   // Remove product row
//   const removeProduct = (index) => {
//     if (products.length > 1) {
//       const updated = [...products];
//       updated.splice(index, 1);
//       setProducts(updated);
//     }
//   };

//   // Update product fields
//   const updateProduct = (index, field, value) => {
//     const updated = [...products];
//     if (field === "productName") {
//       updated[index][field] = value;
//     } else {
//       updated[index][field] = value === "" ? "" : Number(value);
//     }
//     setProducts(updated);
//   };

//   // Totals
//   const subtotal = products.reduce(
//     (sum, p) => sum + Number(p.price || 0) * Number(p.qty || 0),
//     0
//   );
//   const totalGST = products.reduce((sum, p) => sum + Number(p.Gst || 0), 0);
//   const totalAmount = subtotal + totalGST;
//   const totalItems = products.reduce((sum, p) => sum + Number(p.qty || 0), 0); // total quantity
//   const itemsCount = products.length; // number of products


//   // Handle submit
//   const handleSubmit = (e) => {
//     e.preventDefault();

//     const now = new Date();
//     const formattedDate = now.toISOString().split("T")[0]; // YYYY-MM-DD
//     const formattedTime = now.toLocaleTimeString([], {
//       hour: "2-digit",
//       minute: "2-digit",
//       second: "2-digit",
//     });

//     const cleanedProducts = products.map((p) => ({
//       productName: p.productName,
//       price: Number(p.price),
//       qty: Number(p.qty),
//       Gst: Number(p.Gst),
//     }));

//     const newOrder = {
//       orderId,
//       customerName,
//       paymentMode,
//       branch,
//       expectedDeliveryDate,
//       orderDate: formattedDate,
//       orderTime: formattedTime,
//       status: "Draft",
//       quantity: totalItems,
//       unitPrice: subtotal, // total before GST
//       totalPrice: totalAmount,
//       products: cleanedProducts,
//     };

//     // Dispatch to Redux slice
//     dispatch(addOrder(newOrder));

//     // Reset form
//     setOrderId("");
//     setCustomerName("");
//     setPaymentMode("Prepaid");
//     setBranch("");
//     setExpectedDeliveryDate("");
//     setProducts([{ productName: "", price: "", qty: "", Gst: "" }]);
//   };

//   return (
//     <div className="fixed inset-0 bg-opacity-0.5 backdrop-blur-sm flex items-center justify-center z-50">
//       <div className="bg-white rounded-lg shadow-lg w-full max-w-6xl p-6 max-h-[95vh] overflow-y-auto relative">
//         <form onSubmit={handleSubmit}>
//           <div className="flex justify-between items-center mb-2">
//             <h2 className="text-xl font-semibold">Create Order</h2>
//           </div>

//           {/* Order Details */}
//           <div className="grid grid-cols-3 gap-4 mb-4">
//             <div>
//               <label
//                 htmlFor="orderId"
//                 className="block text-sm font-medium text-gray-700 mb-1"
//               >
//                 Order ID
//               </label>
//               <input
//                 id="orderId"
//                 placeholder="Order ID"
//                 value={orderId}
//                 onChange={(e) => setOrderId(e.target.value)}
//                 className="w-full border px-3 py-2 rounded"
//                 required
//               />
//             </div>

//             <div>
//               <label
//                 htmlFor="customerName"
//                 className="block text-sm font-medium text-gray-700 mb-1"
//               >
//                 Customer Name
//               </label>
//               <input
//                 id="customerName"
//                 placeholder="Customer Name"
//                 value={customerName}
//                 onChange={(e) => setCustomerName(e.target.value)}
//                 className="w-full border px-3 py-2 rounded"
//                 required
//               />
//             </div>

//             <div>
//               <label
//                 htmlFor="paymentMode"
//                 className="block text-sm font-medium text-gray-700 mb-1"
//               >
//                 Payment Type
//               </label>
//               <select
//                 id="paymentMode"
//                 value={paymentMode}
//                 onChange={(e) => setPaymentMode(e.target.value)}
//                 className="w-full border px-3 py-2 rounded"
//                 required
//               >
//                 <option value="Prepaid">Prepaid</option>
//                 <option value="COD with Advance">COD with Advance</option>
//               </select>
//             </div>

//             <div>
//               <label
//                 htmlFor="branch"
//                 className="block text-sm font-medium text-gray-700 mb-1"
//               >
//                 Branch
//               </label>
//               <select
//                 id="branch"
//                 value={branch}
//                 onChange={(e) => setBranch(e.target.value)}
//                 className="w-full border px-3 py-2 rounded"
//                 required
//               >
//                 <option value="">Select a branch</option>
//                 <option value="Chennai">Chennai</option>
//                 <option value="Salem">Salem</option>
//                 <option value="Coimbatore">Coimbatore</option>
//                 <option value="Vellore">Vellore</option>
//                 <option value="Thiruvallur">Thiruvallur</option>
//               </select>
//             </div>

//             <div>
//               <label
//                 htmlFor="expectedDeliveryDate"
//                 className="block text-sm font-medium text-gray-700 mb-1"
//               >
//                 Expected Delivery Date
//               </label>
//               <input
//                 id="expectedDeliveryDate"
//                 type="date"
//                 value={expectedDeliveryDate}
//                 onChange={(e) => setExpectedDeliveryDate(e.target.value)}
//                 className="w-full border px-3 py-2 rounded"
//                 required
//               />
//             </div>
//           </div>

//           {/* Products Table */}
//           <table className="w-full table-fixed border-collapse border border-gray-300 mb-4">
//             <thead>
//               <tr className="bg-gray-100">
//                 <th className="border border-gray-300 p-2">S.No</th>
//                 <th className="border border-gray-300 p-2">Product Name</th>
//                 <th className="border border-gray-300 p-2">Price</th>
//                 <th className="border border-gray-300 p-2">Qty</th>
//                 <th className="border border-gray-300 p-2">GST</th>
//                 <th className="border border-gray-300 p-2">Subtotal</th>
//                 <th className="border border-gray-300 p-2">Total</th>
//                 <th className="border border-gray-300 p-2">Action</th>
//               </tr>
//             </thead>
//             <tbody>
//               {products.map((p, i) => {
//                 const subTotal = Number(p.price || 0) * Number(p.qty || 0);
//                 const total = subTotal + Number(p.Gst || 0);
//                 return (
//                   <tr key={i} className="text-center">
//                     <td className="border border-gray-300 p-2">{i + 1}</td>
//                     <td className="border border-gray-300 p-2">
//                       <input
//                         type="text"
//                         value={p.productName}
//                         onChange={(e) =>
//                           updateProduct(i, "productName", e.target.value)
//                         }
//                         className="w-full px-2 py-1 border rounded"
//                         required
//                       />
//                     </td>
//                     <td className="border border-gray-300 p-2">
//                       <input
//                         type="number"
//                         min="0"
//                         value={p.price === "" ? "" : p.price}
//                         placeholder="0"
//                         onChange={(e) =>
//                           updateProduct(i, "price", e.target.value)
//                         }
//                         className="w-full px-2 py-1 border rounded"
//                         required
//                       />
//                     </td>
//                     <td className="border border-gray-300 p-2">
//                       <input
//                         type="number"
//                         min="1"
//                         value={p.qty === "" ? "" : p.qty}
//                         placeholder="0"
//                         onChange={(e) =>
//                           updateProduct(i, "qty", e.target.value)
//                         }
//                         className="w-full px-2 py-1 border rounded"
//                         required
//                       />
//                     </td>
//                     <td className="border border-gray-300 p-2">
//                       <input
//                         type="number"
//                         min="0"
//                         value={p.Gst === "" ? "" : p.Gst}
//                         placeholder="0"
//                         onChange={(e) =>
//                           updateProduct(i, "Gst", e.target.value)
//                         }
//                         className="w-full px-2 py-1 border rounded"
//                         required
//                       />
//                     </td>
//                     <td className="border border-gray-300 p-2">
//                       {subTotal.toFixed(2)}
//                     </td>
//                     <td className="border border-gray-300 p-2">
//                       {total.toFixed(2)}
//                     </td>
//                     <td className="border border-gray-300 p-2">
//                       <button
//                         type="button"
//                         onClick={() => removeProduct(i)}
//                         className="text-red-600 hover:underline"
//                         disabled={products.length === 1}
//                         title={
//                           products.length === 1
//                             ? "At least one product required"
//                             : "Remove product"
//                         }
//                       >
//                         Remove
//                       </button>
//                     </td>
//                   </tr>
//                 );
//               })}
//               <tr>
//                 <td colSpan="8" className="text-left p-2">
//                   <button
//                     type="button"
//                     onClick={addProduct}
//                     className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
//                   >
//                     Add Product
//                   </button>
//                 </td>
//               </tr>
//             </tbody>
//           </table>

//           {/* Totals */}
//           {/* Totals */}
//           <div className="flex justify-between items-start mb-3 mt-5">
//             {/* Left side */}
//             <div className="text-left space-y-1">
//               <p>Items Count: {itemsCount}</p>
//               <p>Total Quantity: {totalItems}</p>
//             </div>

//             {/* Right side */}
//             <div className="text-right space-y-1">
//               <p>Subtotal: ₹{subtotal.toFixed(2)}</p>
//               <p>Tax (GST): ₹{totalGST.toFixed(2)}</p>
//               <p className="font-bold text-lg">
//                 Grand Total: ₹{totalAmount.toFixed(2)}
//               </p>
//             </div>
//           </div>



//           {/* Buttons */}
//           <div className="flex justify-end gap-4">
//             <button
//               type="button"
//               onClick={() => navigate("/")}
//               className="px-4 py-2 border rounded hover:bg-gray-200"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
//             >
//               Create Order
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default OrderForm;