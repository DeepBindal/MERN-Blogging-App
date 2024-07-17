const jwt = require("jsonwebtoken");
require('dotenv').config();

const secretKey = process.env.JWT_SECRET

function generateToken(user){
    const payload = {
        id: user._id,
        email: user.email,
    }

    return jwt.sign(payload, secretKey);

}

// function verifyToken(token){}

module.exports = {generateToken};