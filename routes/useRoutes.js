const express = require("express");
const router = express.Router();
const {
  Login,
  Register,
  getUserById,
  getUsers,
  updateUserByID,
  followUser,
  unfollowUser,
} = require("../controllers/userController"); // Import the user controller
// const { authurizer } = require("../middleWare/authorizeUser");
const User = require("../models/usersModel");

const authurizer = require("../middleware/middleWare");
router.post("/register", Register); // Use the register function from the imported controller
router.post("/login", Login); // Use the login function from the imported controller

// router.get("/", authurizer, async (req, res) => {
//   try {
//     const user = await User.findById(req.user._id).select("-password");
//     return res.json(user);
//   } catch (error) {
//     console.log(error);
//   }
// });
// !get the user by its id
router.get("/users/:id", getUserById);
// ! update the user informations
router.put("/update/:id", updateUserByID);

// !follow a user
router.post("/follow/:userId/:id", followUser);
// !unfollow a user
router.post("/unfollow/:userId/:id", unfollowUser);

//! get all users
router.get("/allUsers", getUsers);

//! check if the user is authenticatedrouter.get("/token", authurizer, async (req, res) => {
router.get("/token", authurizer, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");

    return res.json(user);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});
module.exports = router;
