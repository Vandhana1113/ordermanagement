import React from "react";
import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import OrderForm from "./Components/OrderForm";
import ReturnForm from "./Components/ReturnForm";
import Breadcrumbs from "./Components/Breadcrumbs";
import View from "./Components/View"
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import EditOrderForm from "./Components/Editorder";
import OrdersDashboard from "./Components/Orderdashboard";



const Approutes = () => {
  return (
    <Router>
      <ToastContainer position="top-right" autoClose={1500} />
      <div className="min-h-screen  p-5">
        <div className="w-full h-screen bg-blue-50 p-1 rounded shadow-lg">
          <Breadcrumbs />
          <div className="mt-6">
            <Routes>
              <Route path="/" element={<OrdersDashboard />} />
              <Route path="/create" element={<OrderForm />} />
              <Route path="/return/:orderId" element={<ReturnForm />} />
              <Route path="/view/:orderId" element={<View />} />
              <Route path="/edit/:orderId" element={<EditOrderForm />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
};

export default Approutes;


