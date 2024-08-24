import axios, { all } from "axios";
import React, { useEffect } from "react";
import { useUserContext } from "./userContext";

const ChatContext = React.createContext();

const serverUrl = "http://localhost:5000";

export const ChatProvider = ({ children }) => {
  const { user } = useUserContext();

  const userId = user?._id;

  //state
  const [chats, setChats] = React.useState([]);
  const [messages, setMessages] = React.useState([]);
  const [allChatsData, setAllChatsData] = React.useState([]);
  const [selectedChat, setSelectedChat] = React.useState(null);

  const getUserById = async (id) => {
    try {
      if (!id) return;

      const res = await axios.get(`${serverUrl}/api/v1/user/${id}`);
      return res.data;
    } catch (error) {
      console.log("Error in getUserById", error.message);
    }
  };

  //fetch users chats
  const fetchChats = async () => {
    if (!userId) return;

    try {
      const res = await axios.get(`${serverUrl}/api/v1/chats/${userId}`);

      setChats(res.data);
    } catch (error) {
      console.log("Error in fetchChats", error.message);
    }
  };

  // fetch messages for chat
  const fetchMessages = async (chatId, limit = 15, offset = 0) => {
    try {
      const res = await axios.get(`${serverUrl}/api/v1/messages/${chatId}`, {
        params: { limit, offset },
      });

      // set messages
      setMessages(res.data);
    } catch (error) {
      console.log("Error in fetcMessages", error.message);
    }
  };

  const fetchAllMessages = async (chatId) => {
    if (!chatId) return;
    try {
      const res = await axios.get(`${serverUrl}/api/v1/messages/${chatId}`);

      return res.data;
    } catch (error) {
      console.log("Error in fetchAllMessages", error.message);
    }
  };

  // fetch all chats data
  const getAllChatsData = async () => {
    try {
      const updatedChats = await Promise.all(
        chats.map(async (chat) => {
          const participantsData = await Promise.all(
            // fetch user data for each participant
            chat.participants
              .filter((participant) => participant !== userId)
              .map(async (participant) => {
                const user = await getUserById(participant);
                return user;
              })
          );

          return {
            ...chat,
            participantsData,
          };
        })
      );

      //udate state with the new data
      setAllChatsData(updatedChats);
    } catch (error) {
      console.log("Error in getAllChatsData", error.message);
    }
  };

  //handle selected chat
  const handleSelectedChat = async (chat) => {
    setSelectedChat(chat);
  };

  useEffect(() => {
    fetchChats();
  }, [userId]);

  useEffect(() => {
    if (chats && user) {
      getAllChatsData();
    }
  }, [chats, user]);

  return (
    <ChatContext.Provider
      value={{
        chats,
        messages,
        getUserById,
        allChatsData,
        selectedChat,
        handleSelectedChat,
        fetchAllMessages,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChatContext = () => {
  return React.useContext(ChatContext);
};
