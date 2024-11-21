import React, { useContext } from "react";
import { UserContext } from "../Context/UserContext";
import ChatList from "./ChatList";
import IndividualChat from "./IndividualChat";
import "./component-styling/chatPage.css";
import UserHeader from "./UserHeader";
import { useNavigate } from "react-router-dom";

export default function ChatPage() {
  const { loggedInUser } = useContext(UserContext);
  const navigate = useNavigate;

  if (!loggedInUser) navigate("/");

  return (
    <section className="chat-page">
      <UserHeader />
      <div className="chats-container">
        <ChatList />
        <IndividualChat />
      </div>
    </section>
  );
}
