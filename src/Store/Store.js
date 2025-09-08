import { configureStore } from '@reduxjs/toolkit';
import orderReducer from '../Slice/OrderSlice';
import toastMiddleware from "../Slice/ToastMiddleware";

export const store = configureStore({
  reducer: {
    orders: orderReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(toastMiddleware),
});

// store.js


