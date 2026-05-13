import React, { useState } from "react";
import "./orderModal.css";

const OrderModal = ({ onClose, onSubmit }) => {
  const [address, setAddress] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!address.trim()) return alert("Shipping address is required");
    onSubmit(address);
  };

  return (
    <div className="order-modal-overlay">
      <div className="order-modal-content">
        <span className="order-close-button" onClick={onClose}>
          &times;
        </span>
        <h3>Enter Shipping Address</h3>
        <form onSubmit={handleSubmit}>
          <textarea
            placeholder="Enter full shipping address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          <button type="submit">Place Order</button>
        </form>
      </div>
    </div>
  );
};

export default OrderModal;
