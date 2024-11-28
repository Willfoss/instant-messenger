import React, { useEffect, useState } from "react";
import { getAllChatsForLoggedInUser } from "../api";
import "./component-styling/chatList.css";
import { Plus } from "lucide-react";
import ChatCard from "./ChatCard";

export default function ChatList(props) {
  const { selectedChat, setSelectedChat, user, chats, setChats, showCreateGroup, setShowCreateGroup } = props;

  const [windowPixels, setWindowPixels] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  function openCreateGroupOptions() {
    setShowCreateGroup(true);
  }

  useState(() => {
    const authorisationConfig = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };

    getAllChatsForLoggedInUser(authorisationConfig).then(({ chats }) => {
      setChats(chats);
      console.log(chats);
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
