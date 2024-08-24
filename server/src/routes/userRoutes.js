import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  getUser,
  updateUser,
  userLoginStatus,
  verifyEmail,
  verifyUser,
  forgetPassword,
  resetPassword,
  changePassword,
} from "../controllers/auth/userController.js";
import {
  adminMiddleware,
  creatorMiddleware,
  protect,
} from "../middleware/authMiddleware.js";
import { deleteUser, getAllUser } from "../controllers/auth/adminController.js";
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/logout", logoutUser);
router.get("/user", protect, getUser);
router.patch("/user", protect, updateUser);

// admin route
router.delete("/admin/users/:id", protect, adminMiddleware, deleteUser);

//get all user
router.get("/admin/users", protect, creatorMiddleware, getAllUser);

// Login status
router.get("/login-status", userLoginStatus);

// verify email
router.post("/verify-email/", protect, verifyEmail);

// verify user ---> email verification
router.post("/verify-user/:verificationToken", verifyUser);

// forget password
router.post("/forget-password", forgetPassword);

// reset password
router.post("/reset-password/:resetPasswordToken", resetPassword);

// update password ---> user must be logged in
router.patch("/change-password", protect, changePassword);

export default router;
