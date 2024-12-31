const Product = require("../models/product");

exports.decreaseQuantity = async (req, res, next) => {
  try {
    // Validate product quantities
    for (let item of req.body.products) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res
          .status(400)
          .json({ error: `Product ${item.product} not found` });
      }
      if (product.quantity < item.count) {
        return res
          .status(400)
          .json({
            error: `Insufficient quantity for ${product.name}. Available: ${product.quantity}`,
          });
      }
    }

    // Update product quantities
    let bulkOps = req.body.products.map((item) => {
      return {
        updateOne: {
          filter: { _id: item.product },
          update: {
            $inc: {
              quantity: -item.count,
              sold: +item.count,
            },
          },
        },
      };
    });

    await Product.bulkWrite(bulkOps, {});
    next();
  } catch (error) {
    console.error("decreaseQuantity error:", error);
    return res.status(400).json({
      error: "Could not update product quantity!",
    });
  }
};

exports.productById = async (req, res, next, id) => {
  try {
    const product = await Product.findById(id).populate("category").exec();
    if (!product) {
      return res.status(404).json({
        error: "Product not fount",
      });
    }
    req.product = product;
    next();
  } catch (error) {
    return res.status(404).json({
      error: "Product not found!",
    });
  }
};
