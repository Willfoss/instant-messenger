import React, { useContext, useEffect, useState } from "react";
import { getSender, returnDate } from "../utils/chatLogic";
import "./component-styling/chatCard.css";
import { NotificationsContext } from "../Context/NotificationsContext";
import { UserContext } from "../Context/UserContext";

export default function ChatCard(props) {
  const { chat, selectedChat, setSelectedChat, user } = props;
  const [notificationsForChat, setNotificationsForChat] = useState();
  const { loggedInUser } = useContext(UserContext);

  const { notifications, setNotifications } = useContext(NotificationsContext);

  function selectChat() {
    setSelectedChat(chat);
    setNotifications(
      notifications.filter((notification) => {
        return notification.chat._id !== chat._id;
      })
    );
    setNotificationsForChat(0);
  }

  function getGroupChatSender() {
    if (chat.isGroupChat && chat.latestMessage) {
      return chat.latestMessage.sender;
    }
  }

  useEffect(() => {
    const notificationsForChat = notifications.filter((notification) => {
      return notification.chat._id === chat._id;
    });
    setNotificationsForChat(notificationsForChat.length);
  }, [notifications]);

  return (
    <div className={`chat-card ${selectedChat && selectedChat._id === chat._id && "selected-chat"}`} onClick={selectChat}>
      <div className="chat-card-heading">
        <p className="class-list-name">{!chat.isGroupChat ? getSender(user, chat.users) : chat.chatName}</p>
        <p className="time">{chat.latestMessage && returnDate(chat.latestMessage.createdAt)}</p>
      </div>
      <div className="chat-card-content">
        <p className="latest-message">
          {getGroupChatSender()
            ? `${chat.latestMessage.sender.name}:  ${chat.latestMessage && chat.latestMessage.content}`
            : chat.latestMessage && chat.latestMessage.content}
        </p>
        {notificationsForChat !== 0 && <p className="notifications">{notificationsForChat}</p>}
      </div>
    </div>
  );
}
