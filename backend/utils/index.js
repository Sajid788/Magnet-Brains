const jwt = require('jsonwebtoken');
require('dotenv').config();
const createJWT = (res, userId) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
      expiresIn: "1d", // expires in a day 
    });
  
    res.cookie("token", token, {
      httpOnly: true, // protect 
      // secure: false,
      secure: process.env.NODE_ENV !== "development",
      maxAge: 1000 * 60 * 60 * 24 * 1, //1 day
      sameSite: "strict", //prevent csrf attack  cross-site request forgery 
      // sameSite: "none",
    });
};

module.exports = { createJWT };
