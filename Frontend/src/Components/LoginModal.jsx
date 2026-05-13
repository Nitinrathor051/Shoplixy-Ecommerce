import React, { useState } from "react";
import { loginUser } from "../services/userService";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import icon from "../assets/icon.png";
import "react-toastify/dist/ReactToastify.css";
import "./Modal.css";

const LoginModal = ({ closeModal, openSignupModal }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await loginUser(formData);
      const token = res.data.token;

      // Save token
      localStorage.setItem("token", token);
      toast.success(res.data.msg);

      // Decode role from JWT
      const decoded = JSON.parse(atob(token.split(".")[1]));
      const role = decoded.role;

      // (Optional but recommended)
      localStorage.setItem("role", role);

      // Notify navbar
      window.dispatchEvent(new Event("tokenChanged"));

      // Close modal first
      closeModal();

      // Redirect AFTER modal is closed
      setTimeout(() => {
        if (role === "admin") {
          navigate("/admin", { replace: true });
        } else if (role === "seller") {
          navigate("/seller", { replace: true });
        } else {
          // Force reload home (important)
          window.location.href = "/";
        }
      }, 100);

    } catch (error) {
      toast.error(error.response?.data?.msg || "Login Failed");
    }
  };

  return (
    <div className="auth-modal-overlay">
      <div className="auth-modal-content">
        <span className="auth-close-button" onClick={closeModal}>
          &times;
        </span>
        <h2>
          Login to <img src={icon} alt="Logo" className="modal-icon" />
        </h2>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Enter Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Enter Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button type="submit">Login</button>
        </form>

        <p className="auth-switch-text">
          Don't have an account?{" "}
          <span
            style={{ color: "blue", cursor: "pointer" }}
            onClick={() => {
              closeModal();
              openSignupModal();
            }}
          >
            Create an Account
          </span>
        </p>
      </div>
    </div>
  );
};

export default LoginModal;
