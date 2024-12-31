const Order = require("../models/order");

exports.orderById = async (req, resizeBy, next, id) => {
  try {
    const order = await Order.findById(id).exec();
    if (!order) {
      return resizeBy.status(404).json({ error: "Order not found" });
    }
    req.order = order;
    next();
  } catch (err) {
    return resizeBy.status(500).json({ error: err.message });
  }
};
