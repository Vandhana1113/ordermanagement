import React from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useSelector } from "react-redux";

const BillingModal = ({ order, onClose }) => {
  // const orders = useSelector((state) => state.orders.orders);

  const handleDownloadPDF = () => {
    const doc = new jsPDF();

    // Title
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("Invoice", 105, 20, { align: "center" });

    // Meta Information
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.text(`Order ID: ${order.orderId}`, 14, 32);
    doc.text(`Customer: ${order.customerName}`, 14, 40);
    doc.text(`Branch: ${order.branch}`, 14, 48);
    doc.text(`Payment Mode: ${order.paymentMode}`, 14, 56);
    doc.text(`Status: ${order.status}`, 14, 64);
    doc.text(`Order Date: ${order.orderDate} ${order.orderTime}`, 14, 72);
    doc.text(`Expected Delivery: ${order.expectedDeliveryDate}`, 14, 80);

    // Products Table
    const columns = ["Product Name", "Price", "Qty", "GST", "Subtotal", "Total"];
    const rows = order.products.map((p) => {
      const subTotal = (p.price || 0) * (p.qty || 0);
      const total = subTotal + (p.Gst || 0);
      return [
        p.productName,
        (p.price || 0).toFixed(2),
        String(p.qty || 0),
        (p.Gst || 0).toFixed(2),
        subTotal.toFixed(2),
        total.toFixed(2),
      ];
    });

    autoTable(doc, {
      startY: 90,
      head: [columns],
      body: rows,
      theme: "grid",
      headStyles: {
        fillColor: [173, 216, 230],
        textColor: [0, 0, 0],
        fontStyle: "bold",
      },
      bodyStyles: {
        textColor: [0, 0, 0],
        fontSize: 12,
      },
      styles: { fontSize: 12 },
      columnStyles: {
        1: { halign: "center" },
        2: { halign: "center" },
        3: { halign: "center" },
        4: { halign: "center" },
        5: { halign: "center" },
      },
    });

    // ✅ Totals
    const finalY = doc.lastAutoTable?.finalY || 90;
    const subtotal = order.products.reduce(
      (sum, p) => sum + (p.price || 0) * (p.qty || 0),
      0
    );
    const totalGST = order.products.reduce((sum, p) => sum + (p.Gst || 0), 0);
    const grandTotal = subtotal + totalGST;

    doc.setFontSize(14);
    doc.text(`Subtotal: ${subtotal.toFixed(2)}`, 14, finalY + 10);
    doc.text(`GST: ${totalGST.toFixed(2)}`, 14, finalY + 18);
    doc.text(`Grand Total: ${grandTotal.toFixed(2)}`, 14, finalY + 26);

    // Save PDF & Navigate
    doc.save(`Invoice_${order.orderId}.pdf`);
    onClose();
     // ✅ after saving, redirect to Order Dashboard
  };

  return (
    <div className="fixed inset-0 bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-lg max-w-3xl w-full relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 text-2xl"
        >
          ×
        </button>

        {/* Order Details */}
        <div className="text-sm space-y-1 mb-4">
          <p><strong>Order ID:</strong> {order.orderId}</p>
          <p><strong>Customer:</strong> {order.customerName}</p>
          <p><strong>Staff:</strong> {order.staffName}</p>
          <p><strong>Branch:</strong> {order.branch}</p>
          <p><strong>Delivery Partner:</strong> {order.deliveryPartner}</p>
          <p><strong>Payment Mode:</strong> {order.paymentMode}</p>
          <p><strong>Status:</strong> {order.status}</p>
          <p><strong>Order Date:</strong> {order.orderDate} {order.orderTime}</p>
          <p><strong>Expected Delivery:</strong> {order.expectedDeliveryDate}</p>
          <p><strong>Staff Incentive:</strong> ₹{order.incentive}</p>
          <p><strong>Total Items:</strong> {order.products?.length}</p>
          <p><strong>Grand Total:</strong> ₹{order.totalAmount}</p>
        </div>

        {/* Products Table */}
        <div>
          <h3 className="font-semibold mb-2">Products</h3>
          <table className="w-full border border-gray-300 text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2">Name</th>
                <th className="border p-2">Price</th>
                <th className="border p-2">Qty</th>
                <th className="border p-2">GST</th>
                <th className="border p-2">Subtotal</th>
                <th className="border p-2">Total</th>
              </tr>
            </thead>
            <tbody>
              {order.products?.map((p, i) => {
                const subTotal = (p.price || 0) * (p.qty || 0);
                const total = subTotal + (p.Gst || 0);
                return (
                  <tr key={i} className="text-center">
                    <td className="border p-2">{p.productName}</td>
                    <td className="border p-2">₹{p.price?.toFixed(2)}</td>
                    <td className="border p-2">{p.qty}</td>
                    <td className="border p-2">₹{p.Gst?.toFixed(2)}</td>
                    <td className="border p-2">₹{subTotal.toFixed(2)}</td>
                    <td className="border p-2">₹{total.toFixed(2)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Download Button */}
        <button
          onClick={handleDownloadPDF}
          className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Download Invoice
        </button>
      </div>
    </div>
  );
};

export default BillingModal;
