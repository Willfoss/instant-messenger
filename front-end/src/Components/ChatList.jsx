import React, { useEffect, useState } from "react";
import { getAllChatsForLoggedInUser } from "../api";
import "./component-styling/chatList.css";
import { Plus } from "lucide-react";
import ChatCard from "./ChatCard";

export default function ChatList(props) {
  const { selectedChat, setSelectedChat, user, chats, setChats } = props;
  const [loggedInUser, setLoggedInUser] = useState();
  const [windowPixels, setWindowPixels] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

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
    <section
      id="chat-list"
      className={`${
        (selectedChat && windowPixels.width) <= 768 ? "hide-chat-list" : windowPixels.width > 768 ? "show-list-and-chat" : "show-chat-list"
      }`}
    >
      <div className="chat-header-container">
        <div className="chat-heading">Chats</div>
        <div className="group-chat">
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
