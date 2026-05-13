import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import * as jwt_decode from "jwt-decode";
import "./SearchResults.css";

const SearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const searchQuery =
    queryParams.get("productName") || queryParams.get("query") || "";

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState(null);

  useEffect(() => {
    // Get user role from token
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwt_decode.default ? jwt_decode.default(token) : jwt_decode(token);
        setRole(decoded.role);
      } catch {
        setRole(null);
      }
    }
  }, []);

  useEffect(() => {
    const fetchResults = async () => {
      if (!searchQuery) return;

      try {
        setLoading(true);
        const res = await axios.get(
          `http://localhost:4000/getProductsByQuery?productName=${encodeURIComponent(
            searchQuery
          )}`
        );
        setResults(res.data.products || []);
      } catch (error) {
        console.error("Search error:", error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [searchQuery]);

  const handleAddToCart = async (productId) => {
    try {
      await axios.post(
        "http://localhost:4000/addToCart",
        { productId },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      alert("Added to cart");
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (id) => {
    navigate(`/update-product/${id}`);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await axios.delete(
        `http://localhost:4000/deleteProduct/${id}`,
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      setResults(results.filter((p) => p._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="search-results">
      <h2>Search Results for "{searchQuery}"</h2>
      {loading ? (
        <p>Loading...</p>
      ) : results.length > 0 ? (
        <div className="product-grid">
          {results.map((product) => (
            <div key={product._id} className="product-card">
              <img src={product.productImage} alt={product.productName} />
              <h3>{product.productName}</h3>
              <p>{product.description}</p>
              <p>₹{product.price}</p>
              {/* Role-based actions */}
              {role === "user" && (
                <button onClick={() => handleAddToCart(product._id)}>
                  Add to Cart
                </button>
              )}
              {role === "seller" && (
                <button onClick={() => handleEdit(product._id)}>
                  Edit
                </button>
              )}
              {role === "admin" && (
                <button onClick={() => handleDelete(product._id)}>
                  Delete
                </button>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p>No products found.</p>
      )}
    </div>
  );
};

export default SearchResults;
