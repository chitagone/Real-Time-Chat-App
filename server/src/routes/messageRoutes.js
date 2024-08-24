import express from "express";
import {
  createChat,
  createMessage,
  getAllUserChats,
  getChatMessages,
  getUserById,
} from "../controllers/messages/messageController.js";
import { protect } from "../middleware/authMiddleware.js";
const router = express.Router();

// chat
router.post("/chats", protect, createChat);
router.get("/chats/:userId", protect, getAllUserChats);

//message
router.post("/message", protect, createMessage);
router.get("/messages/:chatId", protect, getChatMessages);

// get user By ID

router.get("/user/:id", protect, getUserById);

export default router;
