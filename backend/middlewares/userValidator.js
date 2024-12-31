const { check, validationResult } = require("express-validator");

exports.userSignupValidator = [
  check("name", "Name is required").notEmpty(),
  check("email", "Email is required")
    .notEmpty()
    .bail()
    .isEmail()
    .withMessage("Invalid email format"),
  check("password", "Password is required")
    .notEmpty()
    .bail()
    .isLength({ min: 6, max: 12 })
    .withMessage("Password must be between 6 and 12 characters"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array()[0].msg });
    }
    next();
  },
];
