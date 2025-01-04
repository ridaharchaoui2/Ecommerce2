const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const { ExpressValidator } = require("express-validator");
const cookieParser = require("cookie-parser");

//Import Routes
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const categoryRoutes = require("./routes/categories");
const productRoutes = require("./routes/products");
const orderRoutes = require("./routes/orders");
const paymentRoutes = require("./routes/payments");

//Config app
const app = express();
require("dotenv").config();

//DATABASE
mongoose
  .connect(process.env.DATABASE)
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log("App is running on port 8000");
    });
  })
  .catch((error) => console.log(error));

//Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
<<<<<<< HEAD
    origin: ["https://ecommerce2-cxnh.vercel.app", "http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
=======
    origin: "*", // Allow all origins
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true, // Remove this if using `*` for origin
>>>>>>> 14296b2010765ba4949b3059d639d7209c3c768e
  })
);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    status: "error",
    message: err.message,
  });
});

// Routes with error catching
app.use("/api", (req, res, next) => {
  try {
    authRoutes(req, res, next);
  } catch (err) {
    next(err);
  }
});
//Routes middleware
app.use("/api", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/product", productRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/payment", paymentRoutes);
