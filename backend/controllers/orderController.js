const mongoose = require("mongoose");
const Product = require("../models/product");
const Order = require("../models/order");

exports.create = async (req, res) => {
  try {
    const order = new Order({
      ...req.body,
      user: req.profile._id,
    });

    const savedOrder = await order.save();
    res.json(savedOrder);
  } catch (err) {
    console.error("Order creation error:", err);
    res.status(400).json({ error: err.message });
  }
};

exports.listOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "_id name email")
      .sort("-createdAt")
      .exec();
    res.json({ orders });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

exports.getStatus = (req, res) => {
  res.json({ status: Order.schema.path("status").enumValues });
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    console.log("Order ID:", orderId);
    console.log("Status:", status);

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    order.status = status;
    const updatedOrder = await order.save();

    res.json(updatedOrder);
  } catch (err) {
    console.error("Update order status error:", err);
    return res.status(500).json({ error: "Failed to update order status" });
  }
};

exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.profile._id })
      .populate("products.product", " name email")
      .sort("-createdAt")
      .exec();
    res.json({ orders });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};
