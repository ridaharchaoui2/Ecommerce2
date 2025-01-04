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
  'https://ecommerce2-cxnh.vercel.app',
  'https://ecommerce2-woad-phi.vercel.app',
  'https://ecommerce2-cxnh-43vk1ucv9-rayansamih46-gmailcoms-projects.vercel.app'
];
//Middlewares
app.use(express.json());
app.use(
  cors({
    origin: function(origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        return callback(new Error('CORS not allowed'));
      }
      return callback(null, true);
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept']
  })
);
app.use(cookieParser());

//Routes middleware
app.use("/api", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/product", productRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/payment", paymentRoutes);
