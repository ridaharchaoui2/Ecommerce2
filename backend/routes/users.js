const express = require("express");
const { requireSignIn, isAuth } = require("../middlewares/auth");
const { getOneUser, updateOneUser } = require("../controllers/userController");
const { userById } = require("../middlewares/user");

const router = express.Router();

router.get("/:userId", requireSignIn, isAuth, getOneUser);
router.put("/:userId", requireSignIn, isAuth, updateOneUser);

router.param("userId", userById);

module.exports = router;
