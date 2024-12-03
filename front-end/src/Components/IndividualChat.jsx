import React, { useContext, useEffect, useState } from "react";
import "./component-styling/individualChat.css";
import IndividualChatMessageBox from "./IndividualChatMessageBox";
import { UserContext } from "../Context/UserContext";

export default function IndividualChat(props) {
  const { selectedChat, getChatsAgain, setGetChatsAgain, setSelectedChat, setShowProfileModal, setChattingWithUser } = props;
  const { loggedInUser } = useContext(UserContext);
  const [windowPixels, setWindowPixels] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    function handleResize() {
      setWindowPixels({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div id="chat-content" className={`${!selectedChat && windowPixels.width <= 768 ? "hide-chat" : "show-chat"}`}>
      <IndividualChatMessageBox
        getChatsAgain={getChatsAgain}
        setGetChatsAgain={setGetChatsAgain}
        selectedChat={selectedChat}
        setSelectedChat={setSelectedChat}
        widthPixels={windowPixels.width}
        setShowProfileModal={setShowProfileModal}
        setChattingWithUser={setChattingWithUser}
      />
    </div>
  );
}
