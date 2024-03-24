const User = require("../models/usersModel");
const bycript = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { TOKEN_KEY } = process.env;

require("dotenv").config();

exports.Register = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const existingUser = await User.findOne({
      email: email.toLowerCase(),
    });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bycript.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword });
    const newUser = await user.save();

    res.status(201).json({ user: newUser });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
// ! the procces of login logic
exports.Login = async (req, res) => {
  const { username, password } = req.body;

  try {
    let user = await User.findOne({
      username: req.body.username,
    });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    const isMatch = await bycript.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "password or email not match" });
    }
    const token = jwt.sign({ _id: user._id }, TOKEN_KEY, { expiresIn: "1d" });
    res.cookie("token", token, {
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });
    return res.status(200).json({
      userId: user._id,
      token: token,
      username: user.username,
      friends: user.friends,
      email: user.email,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: err.message });
  }
};

// ! get user by its id
exports.getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    // Find the post in the database by its ID
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // If the post is found, send it as a response
    res.status(200).json(user);
  } catch (error) {
    // If there's any error while fetching the post, return a 500 error
    res
      .status(500)
      .json({ error: "An error occurred while fetching the post" });
  }
};
// ! get all users without passwords
exports.getUsers = async (req, res) => {
  try {
    // Use projection to exclude the password field
    const users = await User.find({}, { password: 0 });
    // console.log(users);

    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while retrieving data" });
  }
};

//! edit a user by id

exports.updateUserByID = async (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;

  const update = { name, email };

  try {
    const user = await User.findByIdAndUpdate(id, update);
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    return res.status(200).json({ user });
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
  // follow user by id
};

/**
 * Add a user to the current user's friends list and vice-versa
 */
exports.followUser = async (req, res) => {
  // ID of the user being followed
  const { id } = req.params;
  // ID of the current user
  const { userId } = req.params;

  try {
    // Find the user being followed in the collection of friends
    const userBeingFollowed = await User.findById(id, {
      friends: 1,
    });

    if (!userBeingFollowed) {
      return res.status(404).json({ message: "User being followed not found" });
    }

    // Find the current user in the collection of friends
    const currentUser = await User.findById(userId, {
      friends: 1,
    });

    if (!currentUser) {
      return res.status(404).json({ message: "Current user not found" });
    }

    // Check if the user being followed is already a friend of the current user
    const isUserBeingFollowedFriend =
      userBeingFollowed.friends.includes(userId);
    // Check if the current user is already a friend of the user being followed
    const isCurrentUserFriend = currentUser.friends.includes(id);

    if (isUserBeingFollowedFriend && isCurrentUserFriend) {
      // If both users are already friends, return without making any changes
      return res
        .status(200)
        .json({ message: "Both users are already friends" });
    }

    // If the user being followed is not already a friend of the current user, add them as a friend
    if (!isUserBeingFollowedFriend) {
      userBeingFollowed.friends.push(userId);
    }

    // If the current user is not already a friend of the user being followed, add them as a friend
    if (!isCurrentUserFriend) {
      currentUser.friends.push(id);
    }

    // Save the changes to the user documents
    await Promise.all([userBeingFollowed.save(), currentUser.save()]);

    res.status(200).json({ message: "Users are now friends" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.unfollowUser = async (req, res) => {
  const { id } = req.params;
  const { userId } = req.params;

  try {
    const targetUser = await User.findById(userId);
    if (!targetUser) return res.status(404).json({ message: "User not found" });

    const currentUser = await User.findById(id);
    if (!currentUser)
      return res.status(404).json({ message: "Current user not found" });

    // Remove the target user from the current user's friends list
    currentUser.friends = currentUser.friends.filter(
      (friendId) => friendId.toString() !== userId
    );
    await currentUser.save();

    // Remove the current user from the target user's friends list
    targetUser.friends = targetUser.friends.filter(
      (friendId) => friendId.toString() !== id
    );
    await targetUser.save();

    res.status(200).json({ message: "User unfollowed successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};
