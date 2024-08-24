import asyncHandler from "express-async-handler";
import User from "../../models/auth/UserModel.js";

export const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // attemp to find and delete the user

  try {
    const user = await User.findByIdAndDelete(id);

    // check if user eixits
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    // delete user

    res.status(200).json({ message: "User delete successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Can not delete User" });
  }
});

export const getAllUser = asyncHandler(async (req, res) => {
  try {
    const users = await User.find({});

    if (!users) {
      return res.status(404).json({ message: "No user found" });
    }
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ message: "Cannot get users" });
  }
});
