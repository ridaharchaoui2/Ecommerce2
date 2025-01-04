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
app.use(
  cors({
    origin: [
      "https://ecommerce2-cxnh.vercel.app",
      "https://ecommerce2-cxnh-43vk1ucv9-rayansamih46-gmailcoms-projects.vercel.app",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
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
