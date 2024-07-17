const express = require("express");
const asyncHandler = require("../utils/WrapAsync.js");
const {
  createBlog,
  fetchBlogs,
  fetchBlogById,
  addCommentToBlog,
  updateBlogById,
  deleteBlogById,
} = require("../controllers/blogController.js");
const router = express.Router();
const verifyToken = require("../middlewares");
router.route("/create-blog").post(verifyToken, asyncHandler(createBlog));

router.route("/getblogs").post(asyncHandler(fetchBlogs));

router
  .route("/blog/:blogId")
  .get(asyncHandler(fetchBlogById))
  .put(verifyToken, asyncHandler(updateBlogById))
  .delete(verifyToken, asyncHandler(deleteBlogById));

router.route("/blog/addComment").post(verifyToken, asyncHandler(addCommentToBlog));

module.exports = router;
