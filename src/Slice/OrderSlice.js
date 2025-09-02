import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  orders: [],
};

// Order status flow
const statusFlow = [
  "Draft",
  "Confirmed",
  "Picked",
  "Dispatched",
  "Delivered",
  "Closed",
];

export const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    // Add new order
    addOrder: (state, action) => {
      const { quantity, unitPrice, ...rest } = action.payload;

      const order = {
        ...rest,
        quantity: Number(quantity) || 1,
        unitPrice: Number(unitPrice) || 0,
        totalPrice: (Number(quantity) || 1) * (Number(unitPrice) || 0),
      };

      state.orders.push(order);
    },

    // Move order to next status in flow
    advanceStatus: (state, action) => {
      const order = state.orders.find(o => o.orderId === action.payload);
      if (order) {
        const currentIndex = statusFlow.indexOf(order.status);
        if (currentIndex >= 0 && currentIndex < statusFlow.length - 1) {
          order.status = statusFlow[currentIndex + 1];
        } else {
          order.status = "Closed";
        }
      }
    },

    // Mark order as returned
    returnOrder: (state, action) => {
      const { orderId, reason } = action.payload;
      const order = state.orders.find(o => o.orderId === orderId);
      if (order) {
        order.status = "Returned";
        order.returnReason = reason;
      }
    },

    // Cancel return and reset status
    cancelReturn: (state, action) => {
      const orderId = action.payload;
      const order = state.orders.find(o => o.orderId === orderId);
      if (order) {
        order.status = "Confirmed"; // You can choose to reset to "Draft" or other status
        order.returnReason = null;
      }
    },
  },
});

export const {
  addOrder,
  advanceStatus,
  returnOrder,
  cancelReturn,
} = orderSlice.actions;

export default orderSlice.reducer;
