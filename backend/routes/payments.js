const express = require("express");
const router = express.Router();
const { requireSignIn, isAuth } = require("../middlewares/auth");
const { userById } = require("../middlewares/user");
const { stripePayment } = require("../controllers/paymentController");

router.post("/stripe/:userId", requireSignIn, isAuth, stripePayment);

router.param("userId", userById);

module.exports = router;
