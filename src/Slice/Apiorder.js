import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API_URL = "https://herbnas-erp-backend-server.onrender.com";

// 🔹 Fetch all orders
export const fetchOrders = createAsyncThunk("orders/fetchOrders", async () => {
  const res = await fetch(`${API_URL}/api/orders`);
  if (!res.ok) throw new Error("Failed to fetch orders");
  return await res.json();
});

// 🔹 Add new order
export const addOrder = createAsyncThunk("orders/addOrder", async (newOrder) => {
  const res = await fetch(`${API_URL}/api/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newOrder),
  });
  if (!res.ok) throw new Error("Failed to add order");
  return await res.json();
});

// 🔹 Edit order
export const editOrder = createAsyncThunk(
  "orders/editOrder",
  async ({ orderId, updatedData }) => {
    const res = await fetch(`${API_URL}/api/orders/${orderId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedData),
    });
    if (!res.ok) throw new Error("Failed to edit order");
    return await res.json();
  }
);

// 🔹 Delete order
export const deleteOrder = createAsyncThunk(
  "orders/deleteOrder",
  async (orderId) => {
    const res = await fetch(`${API_URL}/orders/${orderId}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to delete order");
    return orderId;
  }
);

const statusFlow = ["Draft", "Confirmed", "Dispatched", "Delivered", "Closed"];

const orderSlice = createSlice({
  name: "orders",
  initialState: {
    orders: [],
    statusFlow,
    loading: false,
    error: null,
  },
  reducers: {
    // Local-only reducers (return/cancel return etc.)
    advanceStatus: (state, action) => {
      const order = state.orders.find((o) => o.orderId === action.payload);
      if (order) {
        const currentIndex = statusFlow.indexOf(order.status);
        if (currentIndex >= 0 && currentIndex < statusFlow.length - 1) {
          order.status = statusFlow[currentIndex + 1];
        } else {
          order.status = "Closed";
        }
      }
    },
    returnOrder: (state, action) => {
      const { orderId, reason } = action.payload;
      const order = state.orders.find((o) => o.orderId === orderId);
      if (order) {
        order.status = "Returned";
        order.returnReason = reason;
      }
    },
    cancelReturn: (state, action) => {
      const orderId = action.payload;
      const order = state.orders.find((o) => o.orderId === orderId);
      if (order) {
        order.status = "Confirmed";
        order.returnReason = null;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch orders
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Add order
      .addCase(addOrder.fulfilled, (state, action) => {
        state.orders.push(action.payload);
      })

      // Edit order
      .addCase(editOrder.fulfilled, (state, action) => {
        const index = state.orders.findIndex(
          (o) => o.orderId === action.payload.orderId
        );
        if (index !== -1) {
          state.orders[index] = action.payload;
        }
      })

      // Delete order
      .addCase(deleteOrder.fulfilled, (state, action) => {
        state.orders = state.orders.filter((o) => o.orderId !== action.payload);
      });
  },
});

export const { advanceStatus, returnOrder, cancelReturn } = orderSlice.actions;
export default orderSlice.reducer;
