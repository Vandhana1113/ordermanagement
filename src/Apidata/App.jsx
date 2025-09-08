import React from 'react'
import OrderForm from './Orderform'
import OrderList from './Orderlist'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<OrderList />} />
        <Route path="/create" element={<OrderForm />} />
      </Routes>
    </Router>
  )
}

export default App
