const express = require("express");
const userRouter = require("./routes/userRoutes");
const blogRouter = require("./routes/blogRoutes");

const cors = require("cors");
const bodyParser = require("body-parser");
const verifyToken = require("./middlewares");
// const verifyToken = require("./middleware");
require('dotenv').config()
const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log("Listening at port 5000");
});

app.use("/auth", userRouter);
app.use("/api", blogRouter)

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong " } = err;
  res.status(statusCode).json({ message });
});

app.get('/protected', verifyToken, (req, res) => {
  console.log(req.user);
  res.json({ message: 'This is a protected route', user: req.user });
});

app.get("/", (req, res, next) => {
  res.send("hello world!")
});
