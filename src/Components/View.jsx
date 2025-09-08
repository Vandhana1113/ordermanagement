import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { XMarkIcon } from "@heroicons/react/24/solid";

const View = () => {
  const navigate = useNavigate();
  const { orderId } = useParams();

  const order = useSelector((state) =>
    state.orders.orders.find((o) => o.orderId === orderId)
  );

  if (!order) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-xl shadow-lg max-w-md w-full text-center">
          <p className="text-red-500 font-medium text-lg">⚠️ Order not found</p>
          <button
            onClick={() => navigate("/")}
            className="mt-4 px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0  bg-opacity-0.5 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl p-6 relative animate-fadeIn">
        {/* Close Button */}
        <button
          onClick={() => navigate("/")}
          className="absolute top-3 right-3 text-gray-500 hover:text-red-600 transition"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>

        {/* Header */}
        <h2 className="text-xl font-semibold mb-4 border-b pb-2 text-gray-700">
          🧾 Order Details
        </h2>

        {/* Order Info */}
        <div className="grid grid-cols-2 gap-4 text-sm mb-6">
          <p><strong>Order ID:</strong> {order.orderId}</p>
          <p><strong>Status:</strong> <span className="px-2 py-1 rounded text-white bg-green-600">{order.status}</span></p>
          <p><strong>Customer:</strong> {order.customerName}</p>
          <p><strong>Staff:</strong> {order.staffName}</p>
          <p><strong>Branch:</strong> {order.branch}</p>
          <p><strong>Delivery Partner:</strong> {order.deliveryPartner}</p>
          <p><strong>Payment Mode:</strong> {order.paymentType}</p>
          <p><strong>Order Date:</strong> {order.orderDate} {order.orderTime}</p>
          <p><strong>Expected Delivery:</strong> {order.expectedDeliveryDate}</p>
          <p><strong>Staff Incentive:</strong> ₹{order.incentive?.toFixed(2)}</p>
          <p><strong>Total Items:</strong> {order.products?.length}</p>
          <p className="font-bold text-lg text-green-700">
            Grand Total: ₹{order.totalAmount?.toFixed(2)}
          </p>
        </div>

        {/* Products */}
        <div>
          <h3 className="font-semibold mb-3 text-gray-700">📦 Products</h3>
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-200 text-sm rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-gray-100 text-gray-700">
                  <th className="border p-2">#</th>
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
                    <tr key={i} className="text-center hover:bg-gray-50">
                      <td className="border p-2">{i + 1}</td>
                      <td className="border p-2 font-medium">{p.productName}</td>
                      <td className="border p-2">₹{p.price?.toFixed(2)}</td>
                      <td className="border p-2">{p.qty}</td>
                      <td className="border p-2">₹{p.Gst?.toFixed(2)}</td>
                      <td className="border p-2">₹{subTotal.toFixed(2)}</td>
                      <td className="border p-2 font-semibold text-green-700">₹{total.toFixed(2)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer Button */}
        <div className="flex justify-end mt-6">
          <button
            onClick={() => navigate("/")}
            className="px-5 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default View;
