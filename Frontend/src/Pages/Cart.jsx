import React, { useEffect, useState } from "react";
import {
  getCart,
  removeItem,
  clearCart,
  updateCart,
} from "../services/cartService";
import { createOrder } from "../services/orderService";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import OrderModal from "../Components/orderModal"; // ✅ Importing modal
import "react-toastify/dist/ReactToastify.css";
import "./Cart.css";

const Cart = () => {
  const [cart, setCart] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const res = await getCart();
      setCart(res.data.cart);
    } catch (error) {
      toast.error(error.response?.data?.msg || "Failed to load cart");
    }
  };

  const handleRemove = async (productId) => {
    try {
      await removeItem(productId);
      toast.success("Item Removed");
      fetchCart();
    } catch (error) {
      toast.error(error.response?.data?.msg || "Failed to remove item");
    }
  };

  const handleClearCart = async () => {
    try {
      await clearCart();
      toast.success("Cart Cleared");
      fetchCart();
    } catch (error) {
      toast.error(error.response?.data?.msg || "Failed to clear cart");
    }
  };

  const handleQuantityChange = async (productId, newQuantity) => {
    if (newQuantity < 1) {
      toast.warning("Quantity cannot be less than 1");
      return;
    }
    try {
      await updateCart({ productId, quantity: newQuantity });
      toast.success("Quantity Updated");
      fetchCart();
    } catch (error) {
      toast.error(error.response?.data?.msg || "Failed to update quantity");
    }
  };

  const handlePlaceOrder = async (shippingAddress) => {
    try {
      const res = await createOrder({ shippingAddress });
      toast.success(res.data.msg);
      setShowOrderModal(false);
      fetchCart(); // clear updated cart
      navigate("/myorders");
    } catch (error) {
      toast.error(error.response?.data?.msg || "Failed to place order");
    }
  };

  if (!cart) return <h3>Loading Cart...</h3>;
  if (cart.items.length === 0) return <h3>Your Cart is Empty 🛒</h3>;

  return (
    <div className="cart-container">
      <h2>My Cart</h2>

      {cart.items
        .filter((item) => item.productId)
        .map((item) => (
          <div key={item.productId._id} className="cart-item">
            <img
              src={item.productId.productImage}
              alt={item.productId.productName}
            />
            <div>
              <h4>{item.productId.productName}</h4>
              <p>Price: ₹{item.productId.price}</p>
              <div className="quantity-control">
                <button
                  onClick={() =>
                    handleQuantityChange(item.productId._id, item.quantity - 1)
                  }
                >
                  -
                </button>
                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) =>
                    handleQuantityChange(
                      item.productId._id,
                      Number(e.target.value)
                    )
                  }
                />
                <button
                  onClick={() =>
                    handleQuantityChange(item.productId._id, item.quantity + 1)
                  }
                >
                  +
                </button>
              </div>
            </div>
            <button
              onClick={() => handleRemove(item.productId._id)}
              className="remove-btn"
            >
              Remove
            </button>
          </div>
        ))}

      <h3>Total Price: ₹{cart.totalPrice}</h3>

      <button onClick={handleClearCart} className="clear-btn">
        Clear Cart
      </button>

      <button onClick={() => setShowOrderModal(true)} className="order-btn">
        Order Now
      </button>

      {showOrderModal && (
        <OrderModal
          onClose={() => setShowOrderModal(false)}
          onSubmit={handlePlaceOrder}
        />
      )}
    </div>
  );
};

export default Cart;
