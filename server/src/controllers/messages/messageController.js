import expressAsyncHandler from "express-async-handler";
import Chat from "../../models/messages/Chat.js";
import Message from "../../models/messages/MessageModel.js";
import User from "../../models/auth/UserModel.js";

export const createChat = expressAsyncHandler(async (req, res) => {
  try {
    const newChat = new Chat({
      participants: [req.body.senderId, req.body.receiverId],
    });
    const chat = await newChat.save();
    res.status(200).json(chat);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export const getAllUserChats = expressAsyncHandler(async (req, res) => {
  try {
    const chat = await Chat.find({
      // find all chat where the user is participant in
      participants: { $in: [req.params.userId] },
    }).sort({ lastModified: -1 });
    res.status(200).json(chat);
  } catch (error) {
    console.log("Error get All user chat", error);
    res.status(500).json({ message: error.message });
  }
});

export const createMessage = expressAsyncHandler(async (req, res) => {
  try {
    const newMessage = new Message(req.body);
    const message = await newMessage.save();

    // update the last modify date of chat
    await Chat.findByIdAndUpdate(req.body.chatId, {
      lastModified: Date.now(),
    });

    res.status(200).json(message);
  } catch (error) {
    console.log("Error create message", error.message);
    res.status(500).json({ message: error.message });
  }
});

export const getChatMessages = expressAsyncHandler(async (req, res) => {
  //   const { limit, offset } = req.query;
  //   const limitNumber = parseInt(limit, 10) || 20;
  //   const offsetNumber = parseInt(offset, 10) || 0;
  try {
    const messages = await Message.find({ chatId: req.params.chatId });
    //   .sort({
    //     createdAt: -1,
    //   })
    //   .limit(limitNumber)
    //   .skip(offsetNumber);
    res.status(200).json(messages);
  } catch (error) {
    console.log("Error get Chat message", error.message);
    res.status(500).json({ message: error.message });
  }
});

export const getUserById = expressAsyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      res.status(404).json({ message: "User Not Found" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.log("Error Get User BY ID", error.message);
    res.status(500).json({ message: error.message });
  }
});
