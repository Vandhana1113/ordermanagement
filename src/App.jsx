import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import OrderForm from "./Components/OrderForm";
import OrderList from "./Components/OrderList";
import ReturnForm from "./Components/ReturnForm";
import Breadcrumbs from "./Components/Breadcrumbs";



const App = () => {
return (
  <Router>
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="w-full max-w-6xl bg-white p-10 rounded shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-center">Order Management</h1>
        <Breadcrumbs />
        <div className="mt-6">
          <Routes>
            <Route path="/" element={<Navigate to="/create" />} />
            <Route path="/create" element={<OrderForm />} />
            <Route path="/return" element={<ReturnForm />} />
            <Route path="/orders" element={<OrderList />} />
            <Route
              path="*"
              element={
                <div className="text-center text-red-500">Page Not Found</div>
              }
            />
          </Routes>
        </div>
      </div>
    </div>
  </Router>
);

};

export default App;

