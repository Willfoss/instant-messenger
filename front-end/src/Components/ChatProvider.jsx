import React, { useContext, useState } from "react";
import { UserContext } from "../Context/UserContext";
import ChatList from "./ChatList";
import IndividualChat from "./IndividualChat";
import "./component-styling/chatPage.css";
import UserHeader from "./UserHeader";
import { useNavigate } from "react-router-dom";

export default function ChatProvider() {
  const user = JSON.parse(localStorage.getItem("user"));

  const [selectedChat, setSelectedChat] = useState();
  const [chats, setChats] = useState([]);

  const navigate = useNavigate;

  if (!user) navigate("/");

  return (
    <section className="chat-page">
      <UserHeader selectedChat={selectedChat} setSelectedChat={setSelectedChat} chats={chats} setChats={setChats} />
      <div className="chats-container">
        <ChatList selectedChat={selectedChat} setSelectedChat={setSelectedChat} user={user} chats={chats} setChats={setChats} />
        <IndividualChat />
      </div>
    </section>
  );
}
