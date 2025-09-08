// toastMiddleware.js
import { toast } from "react-toastify";
import { 
  addOrder, 
  editOrder, 
  deleteOrder, 
  advanceStatus, 
  returnOrder, 
  cancelReturn 
} from "./OrderSlice";

const toastMiddleware = store => next => action => {
  const result = next(action);

  switch (action.type) {
    case addOrder.type: {
      const { orderId } = action.payload;
      toast.success(`Order #${orderId} added successfully!`);
      break;
    }

    case editOrder.type: {
      const { orderId } = action.payload;
      toast.info(`Order #${orderId} updated successfully!`);
      break;
    }

    case deleteOrder.type: {
      const orderId = action.payload;
      toast.error(`Order #${orderId} deleted successfully!`);
      break;
    }

    case advanceStatus.type: {
      const orderId = action.payload;
      const order = store.getState().orders.orders.find(o => o.orderId === orderId);
      if (order) {
        toast.info(`Order #${orderId} moved to "${order.status}"`);
      }
      break;
    }

    case returnOrder.type: {
      const { orderId, reason } = action.payload;
      toast.warn(`Order #${orderId} marked as Returned. Reason: ${reason}`);
      break;
    }

    case cancelReturn.type: {
      const orderId = action.payload;
      toast.success(`Return for Order #${orderId} has been cancelled!`);
      break;
    }

    default:
      break;
  }

  return result;
};

export default toastMiddleware;
