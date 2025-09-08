import React, { useMemo,useState } from "react";
import {
    TruckIcon,
    ArrowUturnLeftIcon,
    CurrencyRupeeIcon,
    PlusIcon,
    ShoppingCartIcon,
} from '@heroicons/react/24/solid';
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import OrderList from "./OrderList";

const Summary = () => {
    const { orders, statusFlow } = useSelector((state) => state.orders);
    const navigate = useNavigate();

    // 🔹 Search & Filter state
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");

    // 🔹 Filter orders
    const filteredOrders = orders.filter((order) => {
        const matchesSearch =
            order.orderId.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.customerName.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus =
            statusFilter === "All" ? true : order.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    // 🔹 Summary values based on filteredOrders
    const totalOrders = filteredOrders.length;
    const deliveredCount = filteredOrders.filter(
        (o) => o.status === "Delivered"
    ).length;
    const returnedCount = filteredOrders.filter(
        (o) => o.status === "Returned"
    ).length;
    const totalValue = filteredOrders.reduce((sum, o) => sum + o.totalAmount, 0);

    const summary = [
        {
            label: "Total Orders",
            value: totalOrders,
            color: "bg-blue-200",
            icon: <ShoppingCartIcon className="h-5 w-5 text-blue-600" />
        },
        {
            label: "Delivered",
            value: deliveredCount,
            color: "bg-green-100",
            icon: <TruckIcon className="h-5 w-5 text-green-600" />,
        },
        {
            label: "Returned",
            value: returnedCount,
            color: "bg-yellow-100",
            icon: < ArrowUturnLeftIcon className="h-5 w-5 text-yellow-600" />,
        },
        {
            label: "Total Value",
            value: `₹${totalValue.toLocaleString()}`,
            color: "bg-purple-100",
            icon: <CurrencyRupeeIcon className="h-5 w-5 text-purple-600" />,
        },
    ];

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-3 pb-2">
                    <span className="inline-block w-2 h-8 bg-blue-600 rounded"></span>
                    Order Management
                </h2>

                <button
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    onClick={() => navigate("/create")}
                >
                    <PlusIcon className="h-5 w-5" />
                    New Order
                </button>
            </div>

            {/* Summary Boxes */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {summary.map((item, idx) => (
                    <div
                        key={idx}
                        className={`p-4 rounded shadow ${item.color} flex items-center justify-between`}
                    >
                        <div>
                            <p className="text-sm text-gray-600">{item.label}</p>
                            <p className="text-lg font-bold">{item.value}</p>
                        </div>
                        {item.icon}
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4 items-center ">
                <input
                    type="text"
                    placeholder="Search by Order ID or Customer..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="px-4 py-2 border rounded w-full md:w-1/3 bg-white"
                />
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
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
                    }}
                    className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                >
                    Clear Filters
                </button>
            </div>

            {/* Order List with filteredOrders */}
            <OrderList orders={filteredOrders} />
        </div>
    );
};

export default Summary;
