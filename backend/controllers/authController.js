const User = require("../models/user");
const jwt = require("jsonwebtoken");

exports.signup = async (req, res) => {
  try {
    const user = new User(req.body);
    const result = await user.save();
    result.hashed_password = undefined;
    result.salt = undefined;
    res.status(200).json({
      user: result,
    });
  } catch (error) {
    res.status(200).json({
      error: error.message,
    });
  }
};

exports.signin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        error: "User not found, Please SignUp!",
      });
    }
    if (!user.authenticate(password)) {
      return res.status(401).json({
        error: "Email and password don't match",
      });
    }
    const token = jwt.sign(
      { _id: user._id, role: user.role },
      process.env.JWT_SECRET
    );
    res.cookie("token", token, { expire: new Date() + 8062000 });

    const { _id, name, role } = user;
    return res.json({
      token,
      user: { _id, name, email, role },
    });
  } catch (error) {
    console.error("Error during signin:", error);
    res.status(500).json({
      error: "Internal server error",
    });
  }
};

exports.signout = (req, res) => {
  res.clearCookie("token");
  res.json({
    message: "User Signout",
  });
};
