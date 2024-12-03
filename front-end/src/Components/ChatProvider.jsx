import React, { useContext, useState } from "react";
import { UserContext } from "../Context/UserContext";
import ChatList from "./ChatList";
import IndividualChat from "./IndividualChat";
import "./component-styling/chatPage.css";
import UserHeader from "./UserHeader";
import { useNavigate } from "react-router-dom";
import CreateGroup from "./CreateGroup";

export default function ChatProvider() {
  const user = JSON.parse(localStorage.getItem("user"));

  const [selectedChat, setSelectedChat] = useState();
  const [chats, setChats] = useState([]);
  const [showCreateGroup, setShowCreateGroup] = useState(true);
  const [getChatsAgain, setGetChatsAgain] = useState(false);

  const navigate = useNavigate;

  if (!user) navigate("/");

  return (
    <section className="chat-page">
      {showCreateGroup && <CreateGroup user={user} setShowCreateGroup={setShowCreateGroup} chats={chats} setChats={setChats} />}
      <UserHeader selectedChat={selectedChat} setSelectedChat={setSelectedChat} chats={chats} setChats={setChats} />
      <div className="chats-container">
        <ChatList
          selectedChat={selectedChat}
          setSelectedChat={setSelectedChat}
          user={user}
          chats={chats}
          setChats={setChats}
          showCreateGroup={showCreateGroup}
          setShowCreateGroup={setShowCreateGroup}
          getChatsAgain={getChatsAgain}
        />
        <IndividualChat
          selectedChat={selectedChat}
          setSelectedChat={setSelectedChat}
          getChatsAgain={getChatsAgain}
          setGetChatsAgain={setGetChatsAgain}
        />
      </div>
    </section>
  );
}
