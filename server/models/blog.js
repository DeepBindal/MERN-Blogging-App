const mongoose = require('mongoose')

const blogSchema = new mongoose.Schema({
  blog: {
    type: String,
    required: true,
  },
  title: {
    type: String,
  },
  image: {
    type: String,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  parentId: {
    type: String,
  },
  children: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Blog",
    },
  ],
});

const Blog = mongoose.models.Blog || mongoose.model("Blog", blogSchema);

module.exports =  Blog;
