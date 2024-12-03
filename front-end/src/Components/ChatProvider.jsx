import React, { useContext, useState } from "react";
import { UserContext } from "../Context/UserContext";
import ChatList from "./ChatList";
import IndividualChat from "./IndividualChat";
import "./component-styling/chatPage.css";
import UserHeader from "./UserHeader";
import { useNavigate } from "react-router-dom";
import CreateGroup from "./CreateGroup";
import ProfileModal from "./ProfileModal";

export default function ChatProvider() {
  const user = JSON.parse(localStorage.getItem("user"));

  const [selectedChat, setSelectedChat] = useState();
  const [chats, setChats] = useState([]);
  const [showCreateGroup, setShowCreateGroup] = useState(true);
  const [getChatsAgain, setGetChatsAgain] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(true);
  const [chattingWithUser, setChattingWithUser] = useState({});

  const navigate = useNavigate;

  if (!user) navigate("/");

  return (
    <section className="chat-page">
      {showCreateGroup && <CreateGroup user={user} setShowCreateGroup={setShowCreateGroup} chats={chats} setChats={setChats} />}
      {showProfileModal && <ProfileModal setShowProfileModal={setShowProfileModal} user={chattingWithUser.name ? chattingWithUser : user} />}
      <UserHeader
        selectedChat={selectedChat}
        setSelectedChat={setSelectedChat}
        chats={chats}
        setChats={setChats}
        setShowProfileModal={setShowProfileModal}
        setChattingWithUser={setChattingWithUser}
      />
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
          setShowProfileModal={setShowProfileModal}
          setChattingWithUser={setChattingWithUser}
        />
      </div>
    </section>
  );
}
