import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../models/User.js";

const protectRoute = asyncHandler(async (req, res, next) => {
  let token;

  console.log("Authorization Header:", req.headers.authorization);

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
      req.user = await User.findById(decoded.id);

      console.log("Decoded user ID from token:", decoded.id);
      next();
    } catch (error) {
      console.log("Token verification failed:", error.message);
      res.status(401).json({ message: "Not authorized, token failed." });
    }
  } else {
    console.log("No token found in request.");
    res.status(401).json({ message: "Not authorized, no token provided." });
  }
});

const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401);
    throw new Error();
  }
};

export { protectRoute, admin };
