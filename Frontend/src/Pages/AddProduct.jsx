import React, { useState } from "react";
import { addProduct } from "../services/productService";
import { useNavigate } from "react-router-dom";
import "./AddProduct.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddProduct = () => {
  const [product, setProduct] = useState({
    productName: "",
    description: "",
    price: "",
    ratings: "",
    productImage: "",
    category: "",
    isFreeDelivery: false,
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProduct((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await addProduct(product);
      toast.success(res.data.msg || "Product added!");
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.msg || "Failed to add product");
      console.error(error);
    }
  };

  return (
    <form className="add-product-form" onSubmit={handleSubmit}>
  <h2 className="add-product-title">Add New Product</h2>

  <input
    className="add-product-input"
    type="text"
    name="productName"
    value={product.productName}
    onChange={handleChange}
    placeholder="Product Name"
  />

  <textarea
    className="add-product-textarea"
    name="description"
    value={product.description}
    onChange={handleChange}
    placeholder="Product Description"
  />

  <input
    className="add-product-input"
    type="number"
    name="price"
    value={product.price}
    onChange={handleChange}
    placeholder="Price"
  />

  <input
    className="add-product-input"
    type="number"
    name="ratings"
    value={product.ratings}
    onChange={handleChange}
    placeholder="Ratings"
  />

  <input
    className="add-product-input"
    type="text"
    name="productImage"
    value={product.productImage}
    onChange={handleChange}
    placeholder="Image URL"
  />

  <input
    className="add-product-input"
    type="text"
    name="category"
    value={product.category}
    onChange={handleChange}
    placeholder="Category"
  />

  <label className="add-product-checkbox-label">
    <input
      type="checkbox"
      name="isFreeDelivery"
      checked={product.isFreeDelivery}
      onChange={handleChange}
    />
    Free Delivery
  </label>

  <button className="add-product-button" type="submit">
    Add Product
  </button>
</form>
  );
};

export default AddProduct;