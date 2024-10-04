import express from "express";
import User from "../models/User.js";
import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import { sendVerificationEmail } from "../middleware/sendVerificationEmail.js";
import { sendPasswordResetEmail } from "../middleware/sendPasswordResetEmail.js";
import { protectRoute } from "../middleware/authMiddleware.js";
import Order from "../models/Order.js";

const userRoutes = express.Router();

const genToken = (id) => {
  return jwt.sign({ id }, process.env.TOKEN_SECRET, {
    expiresIn: "60d",
  });
};

// login
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  // If the user was created with Google and has no password set
  if (user && !user.password) {
    return res
      .status(400)
      .json({ message: "Please use Google Sign-In for this account." });
  }

  if (user && (await user.matchPasswords(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      googleImage: user.googleImage,
      googleId: user.googleId,
      isAdmin: user.isAdmin,
      token: genToken(user._id),
      active: user.active,
      firstLogin: user.firstLogin,
      createdAt: user.createdAt,
    });
  } else {
    res.status(401).json({ message: "Invalid email or password" });
  }
});

// register
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // Check if the user already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400).send("User already exists");
    throw new Error("User already exists");
  }

  // Create a new user
  const user = await User.create({
    name,
    email,
    password: await bcrypt.hash(password, 10), // Hash the password before saving
  });

  const newToken = genToken(user._id);

  sendVerificationEmail(newToken, email, name);

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: genToken(user._id),
    });
  } else {
    res.status(400).send("Invalid user data");
    throw new Error("Invalid user data");
  }
});

// verify email
const verifyEmail = asyncHandler(async (req, res) => {
  const token = req.query.token;
  try {
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
    const user = await User.findById(decoded.id);

    if (user) {
      user.active = true;
      await user.save();
      res.send("Your email has been verified. You can now log in.");
    } else {
      res.status(404).send("User not found");
    }
  } catch (error) {
    res.status(401).send("Email verification failed.");
  }
});

// password reset request
const passwordResetRequest = asyncHandler(async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user) {
      const newToken = genToken(user._id);
      sendPasswordResetEmail(newToken, user.email, user.name, user._id);
      res.status(200).send(`We have sent a recovery email to ${email}`);
    }
  } catch (error) {
    res.status(401).send("There is no account with that email address");
  }
});

// password reset
const passwordReset = asyncHandler(async (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
    const user = await User.findById(decoded.id);

    if (user) {
      user.password = req.body.password;
      await user.save();
      res.json("Your password has been updated successfully.");
    } else {
      res.status(404).send("User not found.");
    }
  } catch (error) {
    res.status(401).send("Password reset failed.");
  }
});

// Google log in
export const googleLogin = async (req, res) => {
  const { googleId, email, name, picture } = req.body;

  try {
    // Log the received Google data
    console.log("Received Google User Data:", {
      googleId,
      email,
      name,
      picture,
    });

    // Check if a user already exists with the given email
    let user = await User.findOne({ email });
    console.log("Found User in DB:", user);

    if (user) {
      // If a user exists with the same email but without a Google ID, add the Google ID to the existing user
      if (!user.googleId) {
        user.googleId = googleId;
        user.profilePicture = picture; // Update the profile picture if needed
        await user.save();
        console.log("Updated Existing User with Google ID:", user);
      }
    } else {
      // If no user exists with this email, create a new user
      user = new User({
        googleId,
        email,
        name,
        profilePicture: picture,
        active: true, // Set as active since Google verified the user
      });
      await user.save();
      console.log("Created New User in DB:", user);
    }

    // Generate a JWT token for the user
    const token = jwt.sign({ id: user._id }, process.env.TOKEN_SECRET, {
      expiresIn: "7d",
    });
    console.log("Generated JWT Token:", token);

    // Respond with the user data and token
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      profilePicture: user.profilePicture,
      token,
    });
  } catch (error) {
    console.error("Error during Google login:", error);
    res.status(500).json({ message: "Server error during Google login" });
  }
};

const getUserOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.params.id });
  if (orders) {
    res.json(orders);
  } else {
    res.status(404);
    throw new Error("No orders found.");
  }
});

userRoutes.route("/login").post(loginUser);
userRoutes.route("/register").post(registerUser);
userRoutes.route("/verify-email").get(protectRoute, verifyEmail);
userRoutes.route("/password-reset-request").post(passwordResetRequest);
userRoutes.route("/password-reset").post(passwordReset);
userRoutes.route("/google-login").post(googleLogin);
userRoutes.route("/:id").get(protectRoute, getUserOrders);

export default userRoutes;
