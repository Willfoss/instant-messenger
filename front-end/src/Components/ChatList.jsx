import React, { useEffect, useState } from "react";
import { getAllChatsForLoggedInUser } from "../api";
import "./component-styling/chatList.css";
import { Plus } from "lucide-react";
import ChatCard from "./ChatCard";

export default function ChatList(props) {
  const { selectedChat, setSelectedChat, user, chats, setChats, showCreateGroup, setShowCreateGroup } = props;
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  function openCreateGroupOptions() {
    setShowCreateGroup(true);
  }

  useState(() => {
    const authorisationConfig = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };
    setIsLoading(true);
    setIsError(false);
    getAllChatsForLoggedInUser(authorisationConfig)
      .then(({ chats }) => {
        setIsLoading(false);
        setChats(chats);
      })
      .catch((error) => {
        setIsLoading(false);
        setIsError(true);
        setErrorMessage(error.response.data.message);
      });
  }, []);

  return (
    <section id="chat-list" className={`${selectedChat ? "hide-chat-list" : "show-chat-list"}`}>
      <div className="chat-header-container">
        <div className="chat-heading">Chats</div>
        <div className="group-chat" onClick={openCreateGroupOptions}>
          New Group Chat <Plus className="add" />
        </div>
      </div>
      <div className="chat-list-container">
        {chats.map((chat) => {
          return <ChatCard key={chat._id} chat={chat} selectedChat={selectedChat} setSelectedChat={setSelectedChat} user={user}></ChatCard>;
        })}
      </div>
    </section>
  );
}
