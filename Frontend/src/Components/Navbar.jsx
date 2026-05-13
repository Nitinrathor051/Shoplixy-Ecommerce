import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";
import { FaShoppingCart, FaUser } from "react-icons/fa";
import { toast } from "react-toastify";
import icon from "../assets/icon.png";
import "react-toastify/dist/ReactToastify.css";

function Navbar({ openLogin }) {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [role, setRole] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const updateRoleFromToken = () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const decoded = JSON.parse(atob(token.split(".")[1]));
          setRole(decoded.role);
        } catch {
          setRole(null);
        }
      } else {
        setRole(null);
      }
    };

    updateRoleFromToken();
    window.addEventListener("tokenChanged", updateRoleFromToken);
    return () => window.removeEventListener("tokenChanged", updateRoleFromToken);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("Logged Out Successfully");
    setMenuOpen(false);
    setRole(null);
    window.dispatchEvent(new Event("tokenChanged"));
    navigate("/");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?query=${searchQuery}`);
      setSearchQuery("");
      setMenuOpen(false);
    }
  };

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <img src={icon} alt="Logo" />
      </div>

      <form onSubmit={handleSearch} className="search-form desktop-search">
        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
      </form>

      <div className="menu-toggle" onClick={toggleMenu}>
        <span></span>
        <span></span>
        <span></span>
      </div>

      <ul className={`navbar-links ${menuOpen ? "active" : ""}`}>
        <form onSubmit={handleSearch} className="search-form mobile-search">
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </form>

        <li><Link to="/" onClick={closeMenu}>Home</Link></li>
        <li><Link to="/about" onClick={closeMenu}>About</Link></li>
        <li><Link to="/contact" onClick={closeMenu}>Contact</Link></li>

        {role === "user" && (
          <>
            <li><Link to="/cart" onClick={closeMenu}><FaShoppingCart /></Link></li>
            <li><Link to="/orders" onClick={closeMenu}>My Orders</Link></li>
            <li><Link to="/profile" onClick={closeMenu}><FaUser /></Link></li>
          </>
        )}

        {role === "seller" && (
          <>
            <li><Link to="/add-product" onClick={closeMenu}>Add Product</Link></li>
            <li><Link to="/profile" onClick={closeMenu}><FaUser /></Link></li>
          </>
        )}

        {role === "admin" && (
          <li><Link to="/admin" onClick={closeMenu}>Admin Dashboard</Link></li>
        )}

        <li>
          {role ? (
            <button onClick={handleLogout} className="logout-btn">Logout</button>
          ) : (
            <button onClick={() => { openLogin(); closeMenu(); }} className="login-btn">Login</button>
          )}
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
