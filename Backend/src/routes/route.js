const express = require("express");
const Route = express.Router();

const {
  addUsers,
  getUsers,
  getUserProfile, 
  updateUser,
  deleteUser,
  loginUser,
} = require("../controllers/userController");

const {
  addProducts,
  getAllProducts,
  getProductById,
  getProductsByQuery,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

const {
  addToCart,
  getCart,
  updateCart,
  removeItemFromCart,
  clearCart,
} = require("../controllers/cartController");

const {
  placeOrder,
  getMyOrder,
  cancelOrder,
} = require("../controllers/orderController");

// Middlewares
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

// Optional seller middleware if needed
const sellerMiddleware = require("../middleware/sellerMiddleware");

// ====================== USER ======================
Route.post("/addUser", addUsers);
Route.post("/login", loginUser);

Route.get("/getMyProfile", authMiddleware, getUserProfile);
Route.put("/updateUser/:id", authMiddleware, updateUser);
Route.delete("/deleteUser/:id", authMiddleware, deleteUser);

// Admin-only route
Route.get("/getAllUsers", authMiddleware, adminMiddleware, getUsers);

// ====================== PRODUCTS ======================
// Seller/Admin can add/update/delete products
Route.post("/addProducts", authMiddleware, sellerMiddleware, addProducts);
Route.put("/updateProduct/:id", authMiddleware, sellerMiddleware, updateProduct);
Route.delete("/deleteProduct/:id", authMiddleware, sellerMiddleware, deleteProduct);

// Public Product Access
Route.get("/getAllProducts", getAllProducts);
Route.get("/getProductById/:id", getProductById);
Route.get("/getProductsByQuery", getProductsByQuery);

// ====================== CART ======================
Route.post("/addToCart", authMiddleware, addToCart);
Route.get("/getCart", authMiddleware, getCart);
Route.put("/updateCart", authMiddleware, updateCart);
Route.delete("/removeItem/:productId", authMiddleware, removeItemFromCart);
Route.delete("/clearCart", authMiddleware, clearCart);

// ====================== ORDER ======================
Route.post("/placeOrder", authMiddleware, placeOrder);
Route.get("/getMyOrder", authMiddleware, getMyOrder);
Route.delete("/cancelOrder/:id", authMiddleware, cancelOrder);

module.exports = Route;
