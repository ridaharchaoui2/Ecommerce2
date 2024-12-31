const express = require("express");
const {
  createProduct,
  showProduct,
  removeProduct,
  updateProduct,
  allProducts,
  relatedProducts,
  searchProduct,
  photoProduct,
} = require("../controllers/productController");
const { userById } = require("../middlewares/user");
const { productById } = require("../middlewares/product");
const { requireSignIn, isAuth, isAdmin } = require("../middlewares/auth");

const router = express.Router();

router.post("/create/:userId", requireSignIn, isAuth, isAdmin, createProduct);
router.get("/:productId", showProduct);
router.get("/", allProducts);
router.get("/related/:productId", relatedProducts);
router.post("/search", searchProduct);
router.get("/photo/:productId", photoProduct);
router.delete(
  "/:productId/:userId",
  requireSignIn,
  isAuth,
  isAdmin,
  removeProduct
);
router.put(
  "/:productId/:userId",
  requireSignIn,
  isAuth,
  isAdmin,
  updateProduct
);

router.param("userId", userById);
router.param("productId", productById);

module.exports = router;
