const User = require("../models/user");

exports.userById = (req, res, next, id) => {
  User.findById(id)
    .exec()
    .then((user) => {
      if (!user) {
        return res.status(400).json({
          error: "User not found",
        });
      }
      req.profile = user;
      next();
    })
    .catch((err) => {
      return res.status(404).json({
        error: "User not found",
      });
    });
};

// exports.addProductsToUserHistory = async (req, res, next) => {
//   const history = req.body.products.map((product) => ({
//     productId: product._id,
//     name: product.name,
//     quantity: product.count,
//     amount: req.body.amount,
//     transaction_id: req.body.transaction_id,
//     status: req.body.status,
//     address: req.body.address,
//   }));

//   if (history.length) {
//     try {
//       await User.findOneAndUpdate(
//         { _id: req.profile._id },
//         { $push: { history: { $each: history } } },
//         { new: true }
//       );
//     } catch (error) {
//       return res.status(400).json({ error: "Could not update user History!" });
//     }
//   }
//   next();
// };
