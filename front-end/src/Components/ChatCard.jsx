import React from "react";
import { getSender } from "../utils/chatLogic";
import "./component-styling/chatCard.css";

export default function ChatCard(props) {
  const { chat, selectedChat, setSelectedChat, user } = props;

  function selectChat() {
    setSelectedChat(chat);
  }

  return (
    <div className={`chat-card ${selectedChat === chat && "selected-chat"}`} onClick={selectChat}>
      <p>{!chat.isGroupChat ? getSender(user, chat.users) : chat.chatName}</p>
    </div>
  );
}
