const express = require("express");
const {
  registerUser,
  loginUser,
  logoutUser,
  getUser,
  deleteUser
} = require("../controllers/userController");

const router = express.Router();

// Define routes for user operations
router.post("/register", registerUser); 
router.post("/login", loginUser); 
router.post("/logout", logoutUser); 
router.get("/getuser", getUser); 
router.delete("/deleteuser/:id", deleteUser);

module.exports = router;
