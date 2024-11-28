import React from "react";
import "./component-styling/individualChat.css";

export default function IndividualChat(props) {
  const { selectedChat } = props;
  return (
    <div id="chat-content" className={`${selectedChat ? "show-chat" : "hide-chat"}`}>
      IndividualChat
    </div>
  );
}
