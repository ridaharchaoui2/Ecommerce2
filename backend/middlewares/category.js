const Category = require("../models/category");

exports.categoryId = async (req, res, next, id) => {
  try {
    const category = await Category.findById(id).exec();
    if (!category) {
      return res.status(404).json({
        error: "Category not found!",
      });
    }
    req.category = category;
    next();
  } catch (error) {
    return res.status(404).json({
      error: "Category not found!",
    });
  }
};
