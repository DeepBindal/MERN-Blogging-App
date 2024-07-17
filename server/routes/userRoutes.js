const express = require("express");
const asyncHandler = require('../utils/WrapAsync.js');
const router = express.Router();
const { signupUser, loginUser, fetchUser, handleGoogle, searchUser} = require("../controllers/userController");

router.route("/signup").post(asyncHandler(signupUser));
router.route("/login").post(asyncHandler(loginUser));
router.route("/google").post(asyncHandler(handleGoogle));
router.route("/user/:userId").get(asyncHandler(fetchUser));
router.route("/search/user").post(asyncHandler(searchUser));

module.exports = router