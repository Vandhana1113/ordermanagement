import React, { useState } from "react";
import {
    TruckIcon,
    ArrowUturnLeftIcon,
    CurrencyRupeeIcon,
    PlusIcon,
    ShoppingCartIcon,
    EyeIcon,
    PaperAirplaneIcon,
    PencilSquareIcon,
    TrashIcon,
} from "@heroicons/react/24/solid";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { advanceStatus, deleteOrder } from "../Slice/OrderSlice";
import BillingModal from "./BillingModel";
import Deletepopup from "../Pages/Deletepopup";
import ConfirmModal from "../Pages/Statusconfirm";

const OrdersDashboard = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { orders, statusFlow } = useSelector((state) => state.orders);

    // ✅ Search & Filter
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");

    const filteredOrders = orders.filter((order) => {
        const lowerSearch = searchTerm.toLowerCase();

        const matchesSearch =
            order.orderId.toString().toLowerCase().includes(lowerSearch) ||
            order.customerName.toLowerCase().includes(lowerSearch) ||
            order.branch.toLowerCase().includes(lowerSearch) ||
            order.paymentMode.toLowerCase().includes(lowerSearch);

        const matchesStatus =
            statusFilter === "All" ? true : order.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    // ✅ Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 10;

    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentOrders = filteredOrders.slice(indexOfFirstRow, indexOfLastRow);

    const totalPages = Math.ceil(filteredOrders.length / rowsPerPage);

    // ✅ Summary
    const totalOrders = filteredOrders.length;
    const deliveredCount = filteredOrders.filter((o) => o.status === "Delivered").length;
    const returnedCount = filteredOrders.filter((o) => o.status === "Returned").length;
    const totalValue = filteredOrders.reduce((sum, o) => sum + o.totalAmount, 0);

    const summary = [
        {
            label: "Total Orders",
            value: totalOrders,
            gradient: "from-blue-500 to-blue-700",
            iconBg: "bg-blue-100",
            icon: <ShoppingCartIcon className="h-5 w-5 text-blue-600" />,
        },
        {
            label: "Delivered",
            value: deliveredCount,
            gradient: "from-green-500 to-green-700",
            iconBg: "bg-green-100",
            icon: <TruckIcon className="h-5 w-5 text-green-600" />,
        },
        {
            label: "Returned",
            value: returnedCount,
            gradient: "from-yellow-400 to-yellow-600",
            iconBg: "bg-yellow-100",
            icon: <ArrowUturnLeftIcon className="h-5 w-5 text-yellow-600" />,
        },
        {
            label: "Total Value",
            value: `₹${totalValue.toLocaleString()}`,
            gradient: "from-purple-500 to-purple-700",
            iconBg: "bg-purple-100",
            icon: <CurrencyRupeeIcon className="h-5 w-5 text-purple-600" />,
        },
    ];

    // ✅ Modals
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [orderToDelete, setOrderToDelete] = useState(null);
    const [orderToAdvance, setOrderToAdvance] = useState(null);

    const handleDeleteConfirm = () => {
        if (orderToDelete) {
            dispatch(deleteOrder(orderToDelete.orderId));
            setOrderToDelete(null);
        }
    };

    const handleAdvanceConfirm = () => {
        if (orderToAdvance) {
            dispatch(advanceStatus(orderToAdvance.orderId));
            setOrderToAdvance(null);
        }
    };

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-3 pb-2">
                    <span className="inline-block w-2 h-8 bg-blue-600 rounded"></span>
                    Order Management
                </h2>

                <button
                    className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-5 py-2 rounded-lg shadow-md hover:from-blue-600 hover:to-indigo-700 transition-all duration-300"
                    onClick={() => navigate("/create")}
                >
                    <PlusIcon className="h-5 w-5" />
                    New Order
                </button>
            </div>

            {/* Summary Boxes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {summary.map((item, idx) => (
                    <div
                        key={idx}
                        className={`p-5 rounded-2xl shadow-lg bg-gradient-to-r ${item.gradient} transform hover:scale-105 transition duration-300`}
                    >
                        <div className="flex items-center justify-between">
                            <div className={`p-3 rounded-full ${item.iconBg} shadow-md`}>
                                {item.icon}
                            </div>
                            <div className="text-right text-white">
                                <p className="text-sm font-medium opacity-90">{item.label}</p>
                                <p className="text-2xl font-bold">{item.value}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4 items-center ">
                <input
                    type="text"
                    placeholder="Search by Order ID, Customer, Branch, or Payment..."
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setCurrentPage(1); // reset to page 1 when filtering
                    }}
                    className="px-4 py-2 border rounded w-full md:w-1/3 bg-white"
                />
                <select
                    value={statusFilter}
                    onChange={(e) => {
                        setStatusFilter(e.target.value);
                        setCurrentPage(1); // reset page
                    }}
                    className="px-4 py-2 border rounded bg-white"
                >
                    <option value="All">All Status</option>
                    {statusFlow.map((status) => (
                        <option key={status} value={status}>
                            {status}
                        </option>
                    ))}
                    <option value="Returned">Returned</option>
                </select>
                <button
                    onClick={() => {
                        setSearchTerm("");
                        setStatusFilter("All");
                        setCurrentPage(1);
                    }}
                    className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                >
                    Clear Filters
                </button>
            </div>

            {/* Orders Table */}
            <div className="mt-3 bg-white rounded-lg">
                <h3 className="text-xl font-semibold mb-4">Orders</h3>

                {filteredOrders.length === 0 ? (
                    <p className="text-gray-500 text-center">No orders yet.</p>
                ) : (
                    <>
                        <div className="overflow-x-auto w-full">
                            <table className="w-full bg-white rounded shadow-md border border-gray-200">
                                <thead>
                                    <tr className="bg-gray-100 text-gray-600 text-sm">
                                        <th className="py-3 px-6 text-left">Order ID</th>
                                        <th className="py-3 px-6 text-left">Order Date</th>
                                        <th className="py-3 px-6 text-left">Customer</th>
                                        <th className="py-3 px-6 text-left">Branch</th>
                                        <th className="py-3 px-6 text-left">₹ Total</th>
                                        <th className="py-3 px-6 text-left">Payment Type</th>
                                        <th className="py-3 px-6 text-left">Status</th>
                                        <th className="py-3 px-6 text-left">Delivery Date</th>
                                        <th className="py-3 px-6 text-center">Actions</th>
                                        <th className="py-3 px-6 text-center">Options</th>
                                        <th className="py-3 px-6 text-center">Download</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm">
                                    {currentOrders.map((order) => (
                                        <tr key={order.orderId} className="border-b hover:bg-gray-50">
                                            <td className="py-2 px-4">{order.orderId}</td>
                                            <td className="py-2 px-4">
                                                {order.orderDate} <br />
                                                <span className="text-xs text-gray-500">{order.orderTime}</span>
                                            </td>
                                            <td className="py-2 px-4">{order.customerName}</td>
                                            <td className="py-2 px-4">{order.branch}</td>
                                            <td className="py-2 px-4">₹{order.totalAmount.toFixed(2)}</td>
                                            <td className="py-2 px-4">{order.paymentMode}</td>
                                            <td className="py-3 px-6 text-left">
                                                <span
                                                    className={`px-3 py-1 rounded-full text-xs font-semibold 
                                                        ${order.status === "Draft"
                                                            ? "bg-gray-200 text-gray-800"
                                                            : order.status === "Returned"
                                                                ? "bg-red-200 text-red-800"
                                                                : order.status === "Confirmed"
                                                                    ? "bg-yellow-200 text-yellow-800"
                                                                    : order.status === "Delivered"
                                                                        ? "bg-green-200 text-green-800"
                                                                        : "bg-blue-200 text-blue-800"
                                                        }`}
                                                >
                                                    {order.status}
                                                </span>
                                                {order.status === "Returned" && order.returnReason && (
                                                    <p className="text-red-500 mt-1 text-xs italic">
                                                        {order.returnReason}
                                                    </p>
                                                )}
                                            </td>
                                            <td className="py-2 px-4">{order.expectedDeliveryDate}</td>

                                            <td className="py-2 px-4 text-center space-x-2">
                                                {order.status !== "Closed" && order.status !== "Returned" && (
                                                    <button
                                                        onClick={() => setOrderToAdvance(order)}
                                                        disabled={order.status === "Delivered"}
                                                        className={`px-3 py-1 rounded-md text-sm transition ${order.status === "Delivered"
                                                            ? "bg-gray-400 text-white cursor-not-allowed"
                                                            : "bg-green-600 text-white hover:bg-green-700"
                                                            }`}
                                                    >
                                                        <PaperAirplaneIcon className="h-4 w-4" />
                                                    </button>
                                                )}

                                                {order.status === "Returned" && (
                                                    <button
                                                        disabled
                                                        className="px-3 py-1 rounded-md text-sm bg-gray-400 text-white cursor-not-allowed"
                                                    >
                                                        <PaperAirplaneIcon className="h-4 w-4" />
                                                    </button>
                                                )}
                                            </td>

                                            <td className="py-3 px-6 text-center">
                                                <div className="flex justify-center gap-2">
                                                    <button
                                                        className="bg-blue-600 text-white px-2 py-1 rounded-md text-sm hover:bg-blue-700 transition"
                                                        onClick={() => navigate(`/view/${order.orderId}`)}
                                                    >
                                                        <EyeIcon className="h-4 w-4" />
                                                    </button>

                                                    <button
                                                        className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                                                        onClick={() => navigate(`/edit/${order.orderId}`)}
                                                    >
                                                        <PencilSquareIcon className="h-4 w-4" />
                                                    </button>

                                                    <button
                                                        className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
                                                        onClick={() => setOrderToDelete(order)}
                                                    >
                                                        <TrashIcon className="h-4 w-4" />
                                                    </button>

                                                    <button
                                                        className="bg-purple-600 text-white px-2 py-1 rounded hover:bg-purple-700"
                                                        onClick={() => navigate(`/return/${order.orderId}`)}
                                                    >
                                                        <ArrowUturnLeftIcon className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </td>

                                            <td className="py-3 px-6 text-center">
                                                <button
                                                    onClick={() => setSelectedOrder(order)}
                                                    className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition"
                                                >
                                                    Invoice
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination Controls */}
                        <div className="flex justify-center items-center gap-2 mt-4">
                            <button
                                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                                disabled={currentPage === 1}
                                className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                            >
                                Prev
                            </button>
                            <span className="px-2 text-sm">
                                Page {currentPage} of {totalPages}
                            </span>
                            <button
                                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                            >
                                Next
                            </button>
                        </div>
                    </>
                )}
            </div>

            {/* Modals */}
            {selectedOrder && (
                <BillingModal
                    order={selectedOrder}
                    onClose={() => setSelectedOrder(null)}
                />
            )}

            <Deletepopup
                isOpen={orderToDelete !== null}
                onClose={() => setOrderToDelete(null)}
                onConfirm={handleDeleteConfirm}
                itemName={
                    orderToDelete
                        ? `Order #${orderToDelete.orderId} (${orderToDelete.customerName})`
                        : ""
                }
                title="Delete Order?"
                message="This will permanently delete"
            />

            <ConfirmModal
                isOpen={orderToAdvance !== null}
                onClose={() => setOrderToAdvance(null)}
                onConfirm={handleAdvanceConfirm}
                title="Advance Order Status?"
                message={
                    orderToAdvance
                        ? `Are you sure you want to move order (${orderToAdvance.orderId}) from status "${orderToAdvance.status}" to the next status?`
                        : ""
                }
            />
        </div>
    );
};

export default OrdersDashboard;
