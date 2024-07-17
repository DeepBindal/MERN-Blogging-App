const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "Email is required"],
    },
    firstName: {
        type: String,
        required: [true, "First Name is required"],
    },
    username: {
        type: String,
        // required: [true, "Username is required"],
    },
    lastName: {
        type: String,
        required: [true, "Last Name is required"],
    },

    password: {
        type: String,
    },
    image:{
        type: String
    },
    isGoogle: {
        type: Boolean,
        default: false
    },
    blogs: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Blog",
        },
      ],
})

const User = mongoose.models.User || new mongoose.model("User", userSchema);

module.exports = User;