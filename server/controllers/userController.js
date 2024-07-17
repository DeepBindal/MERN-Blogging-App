const connectToDB = require("../utils/db");
const User = require("../models/user");
const Blog = require("../models/blog");
const bcrypt = require("bcrypt");
const { jwtDecode } = require("jwt-decode");
const { generateToken } = require("../utils/jwt");

const signupUser = async (req, res) => {
  await connectToDB();
  const { email, firstName, lastName, password, username, isGoogle, image } =
    req.body;
  console.log(firstName);

  const existUser = await User.find({ email });

  if (existUser.length > 0) {
    return res
      .status(201)
      .json({ message: "User already exists", user: existUser });
  }

  if (!email) {
    throw new Error("Missing field Email");
  }
  if (!password) {
    throw new Error("Missing field Password");
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({
    email,
    firstName,
    username,
    lastName,
    password: hashedPassword,
    image,
  });

  const result = await user.save();
  return res.status(200).json({ message: "USERSIGNEDUP", user: result });
};

const loginUser = async (req, res) => {
  await connectToDB();
  const { email, password } = req.body;
  if (!email) {
    throw new Error("Missing field Email");
  }
  if (!password) {
    throw new Error("Missing field Password");
  }

  const user = await User.findOne({ email: email });

  if (!user) throw new Error("User does not exist");

  const compare = await bcrypt.compare(password, user.password);

  if (!compare) throw new Error("Password's do not match");

  const token = generateToken(user);
  console.log(token);
  res
    .status(201)
    .cookie("acess_token", token, {
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      httpOnly: true,
    })
    .json({
      success: true,
      message: "USERLOGGED",
      user: user,
      token: token,
    });
};

const handleGoogle = async (req, res) => {
  await connectToDB();
  const { token } = req.body;
  const result = jwtDecode(token);
  const username = result.name;
  const firstName = result.given_name;
  const lastName = result.family_name;
  const image = result.picture;
  const email = result.email;
  // const data = { username, firstName, lastName, email, image };
  const existUser = await User.find({ email, isGoogle: true });

  if (existUser.length > 0) {
    const genToken = generateToken(existUser[0]);
    return res.status(201).json({
      message: "User already exists. Use a different email",
      user: existUser[0],
      token: genToken,
    });
  }

  const user = new User({
    email,
    firstName,
    username,
    lastName,
    image,
    isGoogle: true,
  });
  const savedUser = await user.save();
  const genToken = generateToken(savedUser);
  console.log(genToken);
  return res
    .status(200)
    .json({ message: "USERSIGNEDUP", user: savedUser, token: genToken });
};

const fetchUser = async (req, res) => {
  await connectToDB();

  const { userId } = req.params;

  const Blogs = await User.findById(userId)
    .populate({
      path: "blogs",
      model: "Blog",
      populate: [
        {
          path: "author",
          model: "User",
        },
        {
          path: "children",
          model: "Blog",
          populate: {
            path: "author",
            model: "User",
            select: "username image _id", // Select the "username", "image", and "_id" fields from the "User" model
          },
        },
      ],
    })
    .exec();

  res.json(Blogs);
};

const searchUser = async (req, res) => {
  await connectToDB();

  const {
    userId,
    searchString = "",
    pageNumber = 1,
    pageSize = 20,
    sortBy = "desc",
  } = req.body;

  // Calculate the number of users to skip based on the page number and page size.
  const skipAmount = (pageNumber - 1) * pageSize;

  // Create a case-insensitive regular expression for the provided search string.
  const regex = new RegExp(searchString, "i");

  // Create an initial query object to filter users.
  const query = {
    id: { $ne: userId }, // Exclude the current user from the results.
  };

  // If the search string is not empty, add the $or operator to match either username or name fields.
  if (searchString.trim() !== "") {
    query.$or = [
      { username: { $regex: regex } },
      { firstName: { $regex: regex } },
      { lastName: { $regex: regex } },
    ];
  } else {
    // If the search string is empty, return an empty result set.
    return res.json({ users: [], isNext: false });
  }

  // Define the sort options for the fetched users based on createdAt field and provided sort order.
  // const sortOptions = { createdAt: sortBy };

  const usersQuery = User.find(query)
    // .sort(sortOptions)
    .skip(skipAmount)
    .limit(pageSize);

  // Count the total number of users that match the search criteria (without pagination).
  const totalUsersCount = await User.countDocuments(query);

  const users = await usersQuery.exec();

  // Check if there are more users beyond the current page.
  const isNext = totalUsersCount > skipAmount + users.length;

  res.json({ users: users, isNext: isNext });
};


module.exports = {
  signupUser,
  loginUser,
  fetchUser,
  handleGoogle,
  searchUser,
};
