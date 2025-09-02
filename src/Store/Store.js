import { configureStore } from '@reduxjs/toolkit';
import orderReducer from '../Slice/OrderSlice';

export const store = configureStore({
  reducer: {
    orders: orderReducer,
  },
});
