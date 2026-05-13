import React, { useEffect, useState } from "react";
import { getMyOrders, cancelOrder } from "../services/orderService";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Order.css";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await getMyOrders();
      setOrders(res.data.orders);
    } catch (error) {
      toast.error(error.response?.data?.msg || "Failed to fetch orders");
    }
  };

  const handleCancel = async (orderId) => {
    try {
      await cancelOrder(orderId);
      toast.success("Order Cancelled");
      fetchOrders(); // Refresh orders
    } catch (error) {
      toast.error(error.response?.data?.msg || "Failed to cancel order");
    }
  };

  if (!orders.length) return <h3 style={{ textAlign: "center" }}>No Orders Found</h3>;

  return (
    <div className="orders-container">
      <h2>My Orders</h2>
      {orders.map((order) => (
        <div key={order._id} className="order-card">
          <div className="order-details">
            <h4>Shipping Address: {order.shippingAddress}</h4>
            <p>Total Items: {order.totalItems}</p>
            <p>Total Price: ₹{order.totalPrice}</p>
            <p>
              Order Status:{" "}
              <span className={`status-badge ${order.orderStatus}`}>
                {order.orderStatus}
              </span>
            </p>
          </div>

          <div className="order-items">
            {order.items.map((item) => (
              <div key={item.productId._id} className="order-item">
                <img
                  src={item.productId.productImage}
                  alt={item.productId.productName}
                />
                <div>
                  <h5>{item.productId.productName}</h5>
                  <p>Price: ₹{item.productId.price}</p>
                  <p>Qty: {item.quantity}</p>
                </div>
              </div>
            ))}
          </div>

          {order.orderStatus === "pending" && (
            <button
              className="cancel-btn"
              onClick={() => handleCancel(order._id)}
            >
              Cancel Order
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default MyOrders;
