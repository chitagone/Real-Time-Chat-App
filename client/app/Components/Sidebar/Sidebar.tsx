import React, { useEffect, useState } from "react";
import { useGlobalContext } from "@/context/globalContext";
import { useUserContext } from "@/context/userContext";
import { archive, inbox, group, moon, sun, chat } from "@/utils/icons";
import { gradientText } from "@/utils/TaiwindStyle";
import SearchInput from "../SearchInput/SearchInput";
import { useChatContext } from "@/context/chatContext";
import ChatItem from "../ChatItem/ChatItem";
import { IChat, IUser } from "@/types/type";

const navButtons = [
  {
    id: 0,
    name: "All Chats",
    icon: inbox,
    slug: "all-chats",
  },
  {
    id: 1,
    name: "Archived",
    icon: archive,
    slug: "archived",
  },
  {
    id: 2,
    name: "Request",
    icon: group,
    slug: "requests",
    notification: true,
  },
];

const Sidebar = () => {
  const { user, updateUser } = useUserContext();
  const { allChatsData, handleSelectedChat, selectedChat } = useChatContext();
  const {
    currentView,
    handleViewChange,
    showProfile,
    handleProfileToggle,
    showFriendProfile,
    handleFriendProfile,
  } = useGlobalContext();

  const { photo, friendRequests } = user;

  // active nav button
  const [activeNav, setActiveNav] = useState(navButtons[0].id);

  const lightTheme = () => {
    console.log("Switching to light theme");
    updateUser({ theme: "light" });
  };

  const darkTheme = () => {
    console.log("Switching to dark theme");
    updateUser({ theme: "dark" });
  };

  useEffect(() => {
    document.documentElement.className = user.theme;
  }, [user.theme]);

  return (
    <div className="w-[25rem] flex border-r-2 border-white dark:border-[#3c3c3c]/60">
      <div className="p-4 flex flex-col justify-between items-center border-r-2 border-white dark:border-[#3c3c3c]/60">
        <div className="profile flex flex-col items-center">
          <img
            src={photo}
            alt="profile"
            width={50}
            height={50}
            className="aspect-square rounded-full object-cover border-2 border-white dark:border-[#3C3C3C]/65
                cursor-pointer hover:scale-105 transition-transform duration-300 ease-in-out shadow-sm select-text"
          />
        </div>
        <div className="w-full relative py-4 flex flex-col items-center gap-8 border-2 border-white dark:border-[#3c3c3c3c]/65 rounded-[30px] shadow-sm ">
          {navButtons.map((btn) => (
            <button
              key={btn.id}
              className={`relative p-1 flex items-center text-[#454e56] dark:text-white/65 ${
                activeNav === btn.id ? "active-nav" : ""
              }`}
              onClick={() => {
                setActiveNav(btn.id);
                handleViewChange(btn.slug);
                handleProfileToggle(false);
              }}
            >
              {btn.icon}
              {btn.notification && (
                <span className="absolute -top-2 right-0 w-4 h-4 bg-[#f00] text-white text-xs rounded-full flex items-center justify-center">
                  {friendRequests?.length > 0 ? friendRequests.length : "0"}
                </span>
              )}
            </button>
          ))}
        </div>
        <div className="flex flex-col gap-2 p-2 text-xl text-[#454e56] border-2 border-white rounded-[30px] shadow-sm dark:border-[#3C3C3C]/65 dark:text-white/65">
          <button
            className={
              user?.theme === "light"
                ? `inline-block bg-clip-text text-transparent bg-gradient-to-r from-[#7263f3] to-[#f56693]`
                : ""
            }
            onClick={() => lightTheme()}
          >
            {sun}
          </button>

          <span className="w-full h-[2px] bg-white dark:bg-[#3C3C3C]/60"></span>

          <button
            className={user?.theme === "dark" ? "text-white" : ""}
            onClick={() => darkTheme()}
          >
            {moon}
          </button>
        </div>
      </div>

      <div className=" pb-4 flex-1">
        <h2
          className={`px-4 mt-2 font-bold text-2xl ${gradientText} dark:text-white`}
        >
          Messages
        </h2>
        <div className="px-4 mt-2">
          <SearchInput />
        </div>
        {currentView === "all-chats" && (
          <div className="mt-8">
            <h4
              className={`px-4 grid grid-cols-[22px_1fr] items-center font-bold ${gradientText} dark:text-white`}
            >
              {chat}
              <span>All Chats</span>
            </h4>

            <div className="mt-2">
              {allChatsData.map((chat: IChat) => (
                <React.Fragment key={chat._id}>
                  {chat?.participantsData?.map((participant: IUser) => (
                    <div key={participant._id}>
                      <ChatItem
                        user={participant}
                        active={!showProfile && selectedChat?._id === chat._id}
                        chatId={chat._id}
                        onClick={() => {
                          handleProfileToggle(false);
                          handleSelectedChat(chat);
                          console.log({ selectedChat });
                        }}
                      />
                    </div>
                  ))}
                </React.Fragment>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
