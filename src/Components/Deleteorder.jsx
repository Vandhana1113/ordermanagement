import { useDispatch,useSelector } from "react-redux";
import { deleteOrder } from "../Slice/OrderSlice";
import { useNavigate, useParams } from "react-router-dom";


const OrderRow = ({navigate }) => {
    const { orderId } = useParams();
  const dispatch = useDispatch();

    const order = useSelector((state) =>
      state.orders.orders.find((o) => o.orderId === orderId)
    );
  

  const handleDelete = () => {
    const confirmed = window.confirm(
      `Are you sure you want to delete order ${order.orderId}?`
    );
    if (confirmed) {
      dispatch(deleteOrder(order.orderId));
    }
  };

  return (
    <tr>
      <td className="border px-4 py-2">{order.orderId}</td>
      <td className="border px-4 py-2">{order.customerName}</td>
      <td className="border px-4 py-2">{order.branch}</td>
      <td className="border px-4 py-2">{order.status}</td>
      <td className="border px-4 py-2 space-x-2">
        <button
          className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
          onClick={() => navigate(`/edit/${order.orderId}`)}
        >
          Edit
        </button>
        <button
          className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
          onClick={handleDelete}
        >
          Delete
        </button>
      </td>
    </tr>
  );
};

export default OrderRow;
