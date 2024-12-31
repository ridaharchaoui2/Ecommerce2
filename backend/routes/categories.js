const express = require("express");
const { categoryId } = require("../middlewares/category");
const { userById } = require("../middlewares/user");
const {
  createCategory,
  showCategory,
  allCategories,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");
const { requireSignIn, isAuth, isAdmin } = require("../middlewares/auth");

const router = express.Router();

router.post(
  "/create/:userId",
  [requireSignIn, isAuth, isAdmin],
  createCategory
);

router.get("/:categoryId", showCategory);
router.get("/", allCategories);
router.put(
  "/:categoryId/:userId",
  requireSignIn,
  isAuth,
  isAdmin,
  updateCategory
);
router.delete(
  "/:categoryId/:userId",
  requireSignIn,
  isAuth,
  isAdmin,
  deleteCategory
);
router.param("userId", userById);
router.param("categoryId", categoryId);

module.exports = router;
