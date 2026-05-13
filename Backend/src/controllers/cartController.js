// src/controllers/cartController.js

const mongoose     = require("mongoose");
const cartModel    = require("../models/cartModel");
const productModel = require("../models/productModel");
const { isValid }  = require("./validator");

// Add To Cart
const addToCart = async (req, res) => {
  try {
    const userId     = req.user.userId;
    const { productId, quantity } = req.body;

    // ProductId Validation
    if (!isValid(productId) || !mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ msg: "Valid ProductId is Required" });
    }
    // Quantity Validation
    if (
      !isValid(quantity) ||
      typeof quantity !== "number" ||
      quantity < 1 ||
      !Number.isInteger(quantity)
    ) {
      return res.status(400).json({ msg: "Valid Quantity is Required" });
    }

    const product = await productModel.findById(productId);
    if (!product) {
      return res.status(404).json({ msg: "Product Not Found" });
    }

    let cart = await cartModel.findOne({ userId });
    if (!cart) {
      cart = await cartModel.create({
        userId,
        items: [{ productId, quantity }],
        totalItems: 1,
        totalPrice: product.price * quantity,
      });
    } else {
      let found = false;
      cart.items = cart.items.map(item => {
        if (item.productId.toString() === productId) {
          found = true;
          item.quantity += quantity;
        }
        return item;
      });
      if (!found) {
        cart.items.push({ productId, quantity });
      }
      cart.totalItems = cart.items.length;

      // populate & safe recalc
      const populated = await cart.populate("items.productId", "price");
      const validItems = populated.items.filter(it => it.productId);
      cart.totalPrice = validItems.reduce(
        (sum, it) => sum + it.productId.price * it.quantity,
        0
      );
    }

    await cart.save();
    return res.status(200).json({ msg: "Item Added To Cart", cart });
  } catch (error) {
    console.error("🚨 addToCart error:", error);
    return res.status(500).json({ msg: "Internal Server Error", error: error.message });
  }
};

// Get Cart
const getCart = async (req, res) => {
  try {
    const userId = req.user.userId;
    const cart = await cartModel
      .findOne({ userId })
      .populate("items.productId", "productName productImage price");

    if (!cart) {
      return res.status(404).json({ msg: "Cart is Empty" });
    }
    return res.status(200).json({ msg: "Cart Fetched Successfully", cart });
  } catch (error) {
    console.error("🚨 getCart error:", error);
    return res.status(500).json({ msg: "Internal Server Error", error: error.message });
  }
};

// Update Cart
const updateCart = async (req, res) => {
  try {
    const userId   = req.user.userId;
    const { productId, quantity } = req.body;

    // Validations
    if (!isValid(productId) || !mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ msg: "Valid ProductId is Required" });
    }
    if (
      !isValid(quantity) ||
      typeof quantity !== "number" ||
      quantity < 1 ||
      !Number.isInteger(quantity)
    ) {
      return res.status(400).json({ msg: "Valid Quantity is Required" });
    }

    const cart = await cartModel.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ msg: "Cart Not Found" });
    }

    const idx = cart.items.findIndex(item => item.productId.toString() === productId);
    if (idx === -1) {
      return res.status(404).json({ msg: "Product Not Found in Cart" });
    }

    // adjust or remove
    if (quantity === 0) {
      cart.items.splice(idx, 1);
    } else {
      cart.items[idx].quantity = quantity;
    }
    cart.totalItems = cart.items.length;

    // populate & safe recalc
    const populated  = await cart.populate("items.productId", "price");
    const validItems = populated.items.filter(it => it.productId);
    cart.totalPrice = validItems.reduce(
      (sum, it) => sum + it.productId.price * it.quantity,
      0
    );

    await cart.save();
    return res.status(200).json({ msg: "Cart Updated Successfully", cart });
  } catch (error) {
    console.error("🚨 updateCart error:", error);
    return res.status(500).json({ msg: "Internal Server Error", error: error.message });
  }
};

// Remove a Item From Cart
const removeItemFromCart = async (req, res) => {
  try {
    const userId    = req.user?.userId;
    const productId = req.params.productId;

    console.log("removeItemFromCart →", { userId, productId });

    if (!userId) {
      return res.status(401).json({ msg: "Unauthorized" });
    }
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ msg: "Valid ProductId is Required" });
    }

    const cart = await cartModel.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ msg: "Cart Not Found" });
    }

    const beforeCount = cart.items.length;
    cart.items = cart.items.filter(
      item => item.productId.toString() !== productId
    );
    if (cart.items.length === beforeCount) {
      return res.status(404).json({ msg: "Product Not Found In Cart" });
    }

    cart.totalItems = cart.items.length;
    const populated  = await cart.populate("items.productId", "price");
    const validItems = populated.items.filter(it => it.productId);
    cart.totalPrice = validItems.reduce(
      (sum, it) => sum + it.productId.price * it.quantity,
      0
    );

    await cart.save();
    return res.status(200).json({
      msg:  "Product Removed From Cart Successfully",
      cart,
    });
  } catch (error) {
    console.error("🚨 removeItemFromCart error:", error);
    return res.status(500).json({ msg: "Internal Server Error", error: error.message });
  }
};

// Clear Cart
const clearCart = async (req, res) => {
  try {
    const userId = req.user.userId;
    const cart   = await cartModel.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ msg: "Cart Not Found" });
    }

    cart.items      = [];
    cart.totalItems = 0;
    cart.totalPrice = 0;
    await cart.save();

    return res.status(200).json({ msg: "Cart Cleared Successfully", cart });
  } catch (error) {
    console.error("🚨 clearCart error:", error);
    return res.status(500).json({ msg: "Internal Server Error", error: error.message });
  }
};

module.exports = {
  addToCart,
  getCart,
  updateCart,
  removeItemFromCart,
  clearCart,
};