import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import User from "../models/auth/UserModel.js";

// Protect middleware
export const protect = asyncHandler(async (req, res, next) => {
  try {
    // Check if user is logged in
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: "Not authorized, Please Login!" });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user details from the token --- exclude password
    const user = await User.findById(decoded.id).select("-password");

    // If user does not exist
    if (!user) {
      return res.status(404).json({ message: "User not Found!" });
    }

    // Set user details in the request object
    req.user = user;

    // Pass control to the next middleware
    next();
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

// Admin middleware
export const adminMiddleware = asyncHandler(async (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    // If user is admin, move to the next middleware/controller
    next();
  } else {
    // If not admin, send 403 forbidden
    return res.status(403).json({ message: "Only admins can do that!" });
  }
});

// Creator middleware
export const creatorMiddleware = asyncHandler(async (req, res, next) => {
  if (req.user && (req.user.role === "creator" || req.user.role === "admin")) {
    // If user is creator or admin, move to the next middleware/controller
    next();
  } else {
    // If not creator or admin, send 403 forbidden
    return res
      .status(403)
      .json({ message: "Only creators or admins can do that!" });
  }
});

// Verified middleware
export const verifiedMiddleware = asyncHandler(async (req, res, next) => {
  if (req.user && req.user.isVerified) {
    // If user is verified, move to the next middleware/controller
    next();
    return;
  } else {
    // If not verified, send 403 forbidden
    return res
      .status(403)
      .json({ message: "Please verify your email address" });
  }
});
