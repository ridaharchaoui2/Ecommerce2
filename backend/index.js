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
const allowedOrigins = [
  "https://ecommerce2-cxnh.vercel.app",
  "https://ecommerce2-cxnh-rayansamih46-gmailcoms-projects.vercel.app",
  "http://localhost:5173",
  "http://localhost:3000",
  "https://localhost:3000",
];
//Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    optionsSuccessStatus: 200,
  })
);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    status: "error",
    message: err.message || "Internal Server Error",
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
