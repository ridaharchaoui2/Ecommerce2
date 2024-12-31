const express = require("express");
const { userById, addProductsToUserHistory } = require("../middlewares/user");
const { orderById } = require("../middlewares/order");
const { requireSignIn, isAuth, isAdmin } = require("../middlewares/auth");
const { decreaseQuantity } = require("../middlewares/product");
const {
  create,
  listOrders,
  getStatus,
  updateOrderStatus,
  getUserOrders,
} = require("../controllers/orderController");

const router = express.Router();

router.post(
  "/create/:userId",
  requireSignIn,
  isAuth,
  // addProductsToUserHistory,
  decreaseQuantity,
  create
);
router.get("/:userId", requireSignIn, isAuth, isAdmin, listOrders);
router.get("/user/:userId", requireSignIn, isAuth, getUserOrders);
router.get("/status/:userId", requireSignIn, isAuth, isAdmin, getStatus);
router.patch(
  "/:orderId/status/:userId",
  requireSignIn,
  isAuth,
  isAdmin,
  updateOrderStatus
);

router.param("userId", userById);
router.param("orderId", orderById);

module.exports = router;
