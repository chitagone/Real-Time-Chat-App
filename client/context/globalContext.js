import React from "react";

const GlobalContext = React.createContext();

export const GlobalProvider = ({ children }) => {
  const [currentView, setCurrentView] = React.useState("all-chats");
  const [showFriendProfile, setShowFirendProfile] = React.useState(false);
  const [showProfile, setShowProfile] = React.useState(false);

  const handleProfileToggle = (show) => {
    setShowProfile(show);
  };

  const handleViewChange = (view) => {
    setCurrentView(view);
  };

  const handleFriendProfile = (show) => {
    setShowFirendProfile(show);
  };

  return (
    <GlobalContext.Provider
      value={{
        currentView,
        handleViewChange,
        showProfile,
        handleProfileToggle,
        showFriendProfile,
        handleFriendProfile,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => {
  return React.useContext(GlobalContext);
};
