const orderModel = require("../models/orderModel");
const cartModel = require("../models/cartModel");
const mongoose = require("mongoose");
const { isValid } = require("./validator");

// ✅ Place Order
const placeOrder = async (req, res) => {
  try {
    const userId = req.user.userId;

    const cart = await cartModel
      .findOne({ userId })
      .populate("items.productId", "productName price");

    if (!cart || cart.items.length === 0) {
      return res.status(404).json({ msg: "Cart is Empty" });
    }

    const { totalItems, totalPrice } = cart;
    const { shippingAddress } = req.body;

    if (!isValid(shippingAddress)) {
      return res.status(400).json({ msg: "Shipping Address is Required" });
    }

    const validItems = cart.items
      .filter((item) => item.productId)
      .map((item) => ({
        productId: item.productId._id,
        quantity: item.quantity,
      }));

    if (validItems.length === 0) {
      return res.status(400).json({ msg: "No valid items to place order" });
    }

    const orderData = {
      userId,
      items: validItems,
      totalItems,
      totalPrice,
      shippingAddress,
      orderStatus: "pending",
    };

    console.log("Creating order with data:", orderData);

    const newOrder = await orderModel.create(orderData);

    cart.items = [];
    cart.totalItems = 0;
    cart.totalPrice = 0;
    await cart.save();

    return res
      .status(201)
      .json({ msg: "Order Placed Successfully", newOrder });
  } catch (error) {
    console.error("PlaceOrder ERROR →", error);
    return res
      .status(500)
      .json({ msg: "Internal Server Error", error: error.message });
  }
};

// ✅ Get My Orders
const getMyOrder = async (req, res) => {
  try {
    const userId = req.user.userId;

    const orders = await orderModel
      .find({ userId })
      .populate("items.productId", "productImage productName price");

    if (!orders || orders.length === 0) {
      return res.status(404).json({ msg: "No Orders Found" });
    }

    return res.status(200).json({ msg: "Your Orders", orders });
  } catch (error) {
    console.error("GetMyOrder ERROR →", error);
    return res
      .status(500)
      .json({ msg: "Internal Server Error", error: error.message });
  }
};

// ✅ Cancel Order
const cancelOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    const userId = req.user.userId;

    if (!isValid(orderId) || !mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({ msg: "Valid orderId is Required" });
    }

    const order = await orderModel.findOne({ _id: orderId, userId });

    if (!order) {
      return res.status(404).json({ msg: "Order Not Found" });
    }

    if (order.orderStatus !== "pending") {
      return res.status(400).json({ msg: "Only Pending orders can be cancelled" });
    }

    order.orderStatus = "cancelled";
    await order.save();

    return res.status(200).json({ msg: "Order Cancelled Successfully", order });
  } catch (error) {
    console.error("CancelOrder ERROR →", error);
    return res
      .status(500)
      .json({ msg: "Internal Server Error", error: error.message });
  }
};

module.exports = { placeOrder, getMyOrder, cancelOrder };
