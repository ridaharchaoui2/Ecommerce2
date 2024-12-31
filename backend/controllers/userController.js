const User = require("../models/user");

exports.getOneUser = (req, res) => {
  req.profile.hashed_password = undefined;
  req.profile.salt = undefined;
  res.json({
    user: req.profile,
  });
};

exports.updateOneUser = async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { _id: req.profile._id },
      { $set: req.body },
      { new: true }
    );
    user.hashed_password = undefined;
    user.salt = undefined;
    res.json({ user });
  } catch (error) {
    return res.status(400).json({ error });
  }
};
