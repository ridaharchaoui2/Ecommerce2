const Category = require("../models/category");

exports.createCategory = async (req, res) => {
  try {
    const category = new Category(req.body);
    const savedCategory = await category.save();
    res.json({ category: savedCategory });
  } catch (error) {
    res.status(400).json({
      error: "Bad Requist!",
    });
  }
};

exports.showCategory = (req, res) => {
  const category = req.category;
  res.json({
    category,
  });
};

exports.allCategories = async (req, res) => {
  try {
    const categories = await Category.find().exec();
    res.json({
      categories,
    });
  } catch (error) {
    return res.status(500).json({
      error,
    });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    let category = req.category;
    category.name = req.body.name;
    const categoryUpdated = await category.save();
    res.json({
      categoryUpdated,
      message: "Category updated",
    });
  } catch (error) {
    return res.status(400).json({
      error: "Bad Requist!",
    });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    let category = req.category;
    if (!category) {
      return res.status(404).json({
        error: "Category not found!",
      });
    }
    await category.constructor.deleteOne({ _id: category._id });
    return res.status(204).json({
      message: "Category deleted",
    });
  } catch (error) {
    return res.status(404).json({
      error: "Category not found!",
    });
  }
};
