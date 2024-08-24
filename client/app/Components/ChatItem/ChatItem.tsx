import React, { useCallback, useEffect, useState } from "react";
import { useChatContext } from "@/context/chatContext";
import { useUserContext } from "@/context/userContext";
import { IMessage, IUser } from "@/types/type";
import { formatDateBasedOnTime } from "@/types/dates";
import { readReceipts } from "@/utils/icons";

interface ChatItemProps {
  user: IUser;
  active: boolean;
  onClick: () => void;
  chatId: string;
}

function ChatItem({ user, active, onClick, chatId }: ChatItemProps) {
  const { fetchAllMessages, onlineUsers } = useChatContext();
  const { photo } = user;

  const userId = useUserContext().user._id;

  // Local state to store messages
  const [messages, setMessages] = useState<IMessage[]>([]);

  // Memoized function to fetch messages
  const allMessages = useCallback(async () => {
    const res = await fetchAllMessages(chatId);
    if (res) {
      setMessages(res);
    }
  }, [fetchAllMessages, chatId]);

  // Fetch messages when chatId changes or when the component mounts
  useEffect(() => {
    allMessages();
  }, [chatId, allMessages]);

  // Get the last message for the chat
  const lastMessage = messages[messages.length - 1];

  // Determine if the user is online
  const isUserOnline = onlineUsers?.find(
    (onlineUser: IUser) => onlineUser._id === user._id
  );

  return (
    <div
      className={`px-4 py-3 flex gap-2 items-center border-b-2 border-white dark:border-[#3C3C3C]/65 cursor-pointer ${
        active ? "bg-blue-100 dark:bg-white/5" : ""
      }`}
      onClick={onClick}
    >
      <div className="relative inline-block">
        <img
          src={photo}
          alt="Profile Picture"
          width={50}
          height={50}
          className="rounded-full aspect-square object-cover border-2 border-[white] dark:border-[#3C3C3C]/65 cursor-pointer
            hover:scale-105 transition-transform duration-300 ease-in-out"
        />
        <div
          className={`absolute bottom-0 right-0 w-[13px] h-[13px] rounded-full border-white border-2
            ${isUserOnline ? "bg-green-500" : "bg-red-500"}
        `}
        ></div>
      </div>
      <div className="flex-1 flex flex-col">
        <div className="flex justify-between items-center">
          <h4 className="font-medium">{user.name}</h4>
          <p className="text-[#aaa] text-sm">
            {formatDateBasedOnTime(lastMessage?.createdAt)}
          </p>
        </div>
        <div className="flex justify-between items-center">
          <p className=" text-sm text-[#aaa]">
            {lastMessage?.sender === userId
              ? "You: " +
                (lastMessage?.content.length > 20
                  ? lastMessage?.content.substring(0, 20) + "..."
                  : lastMessage?.content)
              : lastMessage?.content.length > 25
              ? lastMessage?.content.substring(0, 25) + "..."
              : lastMessage?.content || "No Messages"}
          </p>

          {lastMessage?.sender === userId ? (
            <div className="text-[#7263f3]">{readReceipts}</div>
          ) : (
            <div className="flex items-center justify-center w-[4px] h-[4px] bg-red-500 rounded-full"></div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ChatItem;
