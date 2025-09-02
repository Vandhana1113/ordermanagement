import React from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";

const BillingModal = ({ order, onClose }) => {
  if (!order) return null;

  const handleDownloadPDF = () => {
   const doc = new jsPDF();

doc.setFontSize(18);
doc.setFont("helvetica", "bold"); 
doc.text("Invoice", 100, 22);

doc.setFontSize(12);
doc.text(`Order ID: ${order.orderId}`, 14, 32);
doc.text(`Customer: ${order.customerName}`, 14, 40);
doc.text(`Branch: ${order.branch}`, 14, 48);
doc.text(`Payment Mode: ${order.paymentMode}`, 14, 56);
doc.text(`Status: ${order.status}`, 14, 64);

doc.setFont("helvetica", "normal"); 
const columns = ["Item", "Qty", "Unit Price", "Total"];
const rows = [
  [
    "Product / Service",
    order.quantity ? order.quantity.toString() : "0",
    `${order.unitPrice ? order.unitPrice.toFixed(2) : "0.00"}`, // Removed ₹
    `${order.totalPrice ? order.totalPrice.toFixed(2) : "0.00"}`, // Removed ₹
  ],
];

doc.autoTable({
  startY: 75,
  head: [columns],
  body: rows,
  theme: "grid",
  headStyles: {
    fillColor: [173, 216, 230], // Light blue
    textColor: [0, 0, 0],       // Black text
    fontStyle: 'bold',
  },
   bodyStyles: {
    textColor: [0, 0, 0],       // Black text for table rows
  },
  styles: {
    fontSize: 12,
  },
  columnStyles: {
    1: { halign: "center" },
    2: { halign: "center" },
    3: { halign: "center" },
  },
});

const finalY = doc.lastAutoTable.finalY || 75;
doc.setFontSize(14);
doc.text(
  `Grand Total: ${order.totalPrice ? order.totalPrice.toFixed(2) : "0.00"}`,
  14,
  finalY + 15
);

doc.save(`Invoice_${order.orderId}.pdf`);
  };

  return (
    <div className="fixed inset-0 bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-lg max-w-xl w-full relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500  text-2xl"
          aria-label="Close modal"
        >
          ×
        </button>
        <h2 className="text-xl font-bold mb-4 text-center">
          Invoice - {order.orderId}
        </h2>
        <div className="text-sm space-y-1">
          <p>
            <strong>Customer:</strong> {order.customerName}
          </p>
          <p>
            <strong>Branch:</strong> {order.branch}
          </p>
          <p>
            <strong>Payment Mode:</strong> {order.paymentMode}
          </p>
          <p>
            <strong>Status:</strong> {order.status}
          </p>
          <p>
            <strong>Quantity:</strong> {order.quantity}
          </p>
          <p>
            <strong>Unit Price:</strong> ₹{order.unitPrice?.toFixed(2)}
          </p>
          <p>
            <strong>Total Price:</strong> ₹{order.totalPrice?.toFixed(2)}
          </p>
        </div>
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
