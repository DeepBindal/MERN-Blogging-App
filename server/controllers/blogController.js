const Blog = require("../models/blog");
const connectToDB = require("../utils/db");
const User = require("../models/user");
const ExpressError = require("../utils/ExpressError")

const createBlog = async (req, res) => {
  await connectToDB();
  const { blog, title, image, author } = req.body;

  const createdBlog = await Blog.create({
    blog,
    title,
    image,
    author,
  });

  // Update User model
  await User.findByIdAndUpdate(author, {
    $push: { blogs: createdBlog._id },
  });

  res.status(200).json({ message: "BLOGCREATED" });
};

const fetchBlogs = async (req, res) => {
  await connectToDB();

  const { pageNumber } = req.body;
  const pageSize = 20;
  const skipAmount = (pageNumber - 1) * pageSize;

  const postsQuery = Blog.find({ parentId: { $in: [null, undefined] } })
    .sort({ createdAt: "desc" })
    .skip(skipAmount)
    .limit(pageSize)
    .populate({
      path: "author",
      model: User,
    })
    .populate({
      path: "children", // Populate the children field
      populate: {
        path: "author", // Populate the author field within children
        model: User,
        select: "_id username firstName lastName parentId image", // Select only _id and username fields of the author
      },
    });

  const totalPostsCount = await Blog.countDocuments({
    parentId: { $in: [null, undefined] },
  }); // Get the total count of posts

  const posts = await postsQuery.exec();

  const isNext = totalPostsCount > skipAmount + posts.length;

  res.json({ posts, isNext }).status(200);
};

const fetchBlogById = async (req, res) => {
  await connectToDB();
  const { blogId } = req.params;

  const blog = await Blog.findById(blogId)
    .populate({
      path: "author",
      model: User,
      select: "_id  username firstName lastName image",
    }) // Populate the author field with _id and username
    .populate({
      path: "children", // Populate the children field
      populate: [
        {
          path: "author", // Populate the author field within children
          model: User,
          select: "_id id username firstName lastName parentId image", // Select only _id and username fields of the author
        },
        {
          path: "children", // Populate the children field within children
          model: Blog, // The model of the nested children (assuming it's the same "Blog" model)
          populate: {
            path: "author", // Populate the author field within nested children
            model: User,
            select: "_id id username firstName lastName parentId image", // Select only _id and username fields of the author
          },
        },
      ],
    })
    .exec();

  res.json({blog})
};



async function addCommentToBlog(req, res) {
  await connectToDB();

  const {blogId, userId, commentText} = req.body;
  console.log(blogId)
    // Find the original Blog by its ID
    const originalBlog = await Blog.findById(blogId);

    if (!originalBlog) {
      throw new Error("Blog not found");
    }

    // Create the new comment Blog
    const commentBlog = new Blog({
      blog: commentText,
      author: userId,
      parentId: blogId, // Set the parentId to the original Blog's ID
    });

    // Save the comment Blog to the database
    const savedCommentBlog = await commentBlog.save();

    // Add the comment Blog's ID to the original Blog's children array
    originalBlog.children.push(savedCommentBlog._id);

    // Save the updated original Blog to the database
    await originalBlog.save();
    res.json({message: "COMMENTADDED"}).status(200);
}

const updateBlogById = async (req, res) => {
  await connectToDB();
  const {blogId} = req.params
  const {image, title, blog, userId} = req.body;

  if(req.user.id !== userId){
    return new ExpressError(404, "Not authorized to update the blog");
  }

  const updatedBlog = await Blog.findByIdAndUpdate(
    blogId, 
    { $set: { title, blog, image } }, 
    { new: true } // This option returns the updated document
  );
  
  if(!blog) return new ExpressError(404, "Blog not found");

  return res.json({message: "BlogUpdated", blog: updatedBlog});

}

const deleteBlogById = async (req, res) => {
  await connectToDB();
  const {blogId} = req.params;

  const blog = await Blog.findByIdAndDelete(blogId);

  return res.json({message: "BLOGDELETED"}).status(200);
}

module.exports = { createBlog, fetchBlogs, fetchBlogById, addCommentToBlog, updateBlogById, deleteBlogById };
