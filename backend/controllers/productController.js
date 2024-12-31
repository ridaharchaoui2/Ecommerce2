const formidable = require("formidable");
const Product = require("../models/product");
const Joi = require("joi");
const fs = require("fs");
const _ = require("lodash");

exports.createProduct = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;

  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: "Image could not be uploaded",
      });
    }

    // Ensure fields are strings and handle arrays
    const name = Array.isArray(fields.name) ? fields.name[0] : fields.name;
    const description = Array.isArray(fields.description)
      ? fields.description[0]
      : fields.description;
    const price = Array.isArray(fields.price) ? fields.price[0] : fields.price;
    const quantity = Array.isArray(fields.quantity)
      ? fields.quantity[0]
      : fields.quantity;
    const category = Array.isArray(fields.category)
      ? fields.category[0]
      : fields.category;
    const shipping = Array.isArray(fields.shipping)
      ? fields.shipping[0]
      : fields.shipping;

    // Handle empty or invalid fields
    if (!name || !description || !price || !quantity) {
      return res.status(400).json({
        error: "All fields are required",
      });
    }

    let product = new Product({
      name: name,
      description: description,
      price: parseFloat(price),
      quantity: parseInt(quantity),
      category: category, // Assuming category is a required field
      shipping: shipping === "true", // Assuming shipping is a boolean
      // ... other fields (e.g., brand, color, size, etc.)
    });

    // Check if a photo was uploaded and handle it
    if (files.photo && files.photo.length > 0) {
      const photo = files.photo[0]; // Get the first file from the array

      if (photo.size > Math.pow(10, 6)) {
        return res.status(400).json({
          error: "Image should be less than 1mb in size",
        });
      }

      if (photo.filepath) {
        try {
          product.photo.data = fs.readFileSync(photo.filepath);
          product.photo.contentType = photo.mimetype;
        } catch (err) {
          console.error("Error reading file:", err);
          return res.status(500).json({
            error:
              "An error occurred while processing the image. Please try again later.",
          });
        }
      } else {
        console.log("No photo uploaded or filepath is undefined");
      }
    }

    product
      .save()
      .then((savedProduct) => {
        res.json({ product: savedProduct });
      })
      .catch((err) => {
        console.error(err);
        return res.status(400).json({
          err: err.message || "Product not saved",
        });
      });
  });
};

exports.showProduct = (req, res) => {
  req.product.photo = undefined;
  res.json({
    product: req.product,
  });
};

exports.removeProduct = async (req, res) => {
  const product = req.product;
  if (!product) {
    return res.status(404).json({
      error: "Product not found!",
    });
  }
  try {
    await Product.findByIdAndDelete(product._id);
    res.status(204).json({ message: "Product deleted successsfully" });
  } catch (error) {
    return res.status(500).json({
      error: "Error removing Product!",
      details: error.message,
    });
  }
};

exports.updateProduct = async (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: "Image could not be uploaded!",
      });
    }
    // Convert fields to strings
    const name = String(fields.name || "");
    const description = String(fields.description || "");
    const price = String(fields.price || "");
    const quantity = String(fields.quantity || "");
    const category = String(fields.category || "");

    // Reassign fields with the string-converted values
    fields.name = name;
    fields.description = description;
    fields.price = price;
    fields.quantity = quantity;
    fields.category = category;

    let product = req.product;

    product = _.extend(product, fields);

    if (files.photo && files.photo.length > 0) {
      const photo = files.photo[0];

      if (photo.size > Math.pow(10, 6)) {
        return res.status(400).json({
          error: "Image should be less than 1mb in size!",
        });
      }

      if (photo.path) {
        try {
          product.photo.data = fs.readFileSync(photo.path);
          product.photo.contentType = photo.type;
        } catch (err) {
          console.error("Error reading file:", err);
          return res.status(500).json({
            error:
              "An error occurred while processing the image. Please try again later.",
          });
        }
      }
    }

    const schema = Joi.object({
      name: Joi.string().required(),
      description: Joi.string().required(),
      price: Joi.required(),
      quantity: Joi.required(),
      category: Joi.required(),
    });

    const { error } = schema.validate(fields);

    if (error) {
      return res.status(400).json({
        error: error.details[0].message,
      });
    }

    try {
      const updatedProduct = await product.save();
      res.json({ product: updatedProduct });
    } catch (err) {
      console.error(err);
      return res.status(400).json({
        err: "Product not updated",
      });
    }
  });
};

exports.allProducts = async (req, res) => {
  let sortBy = req.query.sortBy ? req.query.sortBy : "_id";
  let order = req.query.order ? req.query.order : "asc";
  let limit = req.query.limit ? parseInt(req.query.limit) : 100;
  let query = {};

  let { search, category } = req.query;

  if (search) {
    query.name = { $regex: search, $options: "i" };
  }
  if (category) {
    query.category = category;
  }
  try {
    const products = await Product.find(query)
      .select("-photo")
      .populate("category")
      .sort([[sortBy, order]])
      .limit(limit)
      .exec();
    res.json({
      products,
    });
  } catch (error) {
    return res.status(404).json({
      error: "Products not founs !",
    });
  }
};

exports.relatedProducts = async (req, res) => {
  let limit = req.query.limit ? parseInt(req.query.limit) : 4;
  try {
    const products = await Product.find({
      category: req.product.category,
      _id: { $ne: req.product._id },
    })
      .limit(limit)
      .populate("category", "_id name")
      .exec();
    res.json({
      products,
    });
  } catch (error) {
    return res.status(404).json({
      error: "Products not found !",
    });
  }
};

exports.searchProduct = async (req, res) => {
  let sortBy = req.query.sortBy ? req.query.sortBy : "_id";
  let order = req.query.order ? req.query.order : "asc";
  let limit = req.body.limit ? parseInt(req.body.limit) : 100;
  let skip = parseInt(req.body.skip);
  let findArgs = {};

  try {
    for (let key in req.body.filters) {
      if (req.body.filters[key].length > 0) {
        if (key === "price") {
          // gte -  greater than price [0-10]
          // lte - less than
          findArgs[key] = {
            $gte: req.body.filters[key][0],
            $lte: req.body.filters[key][1],
          };
        } else {
          findArgs[key] = req.body.filters[key];
        }
      }
    }
    const products = await Product.find(findArgs)
      .select("-photo")
      .populate("category")
      .sort([[sortBy, order]])
      .limit(limit)
      .skip(skip)
      .exec();

    res.json({
      products,
    });
  } catch (error) {
    return res.status(404).json({
      error: "Products not founs !",
    });
  }
};

exports.photoProduct = (req, res) => {
  const { data, contentType } = req.product.photo;

  if (data) {
    res.set("Content-Type", contentType);

    return res.send(data);
  }
};
