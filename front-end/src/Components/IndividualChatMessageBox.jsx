import React, { useContext } from "react";
import { UserContext } from "../Context/UserContext";
import "./component-styling/individualChatMessageBox.css";
import { ArrowLeft, Settings, User } from "lucide-react";
import { getSender, getSenderFullDetails } from "../utils/chatLogic";

export default function IndividualChatMessageBox(props) {
  const { selectedChat, getChatsAgain, setGetChatsAgain, setSelectedChat, widthPixels, setShowProfileModal, setChattingWithUser } = props;
  const { loggedInUser } = useContext(UserContext);

  function handleBackArrowClick() {
    setSelectedChat("");
  }

  function handleUserClick() {
    const chattingWith = getSenderFullDetails(loggedInUser, selectedChat.users);
    setChattingWithUser(chattingWith);
    setShowProfileModal(true);
  }

  return (
    <section id="single-chat">
      {selectedChat ? (
        <div className="chat-box-container">
          <div className="chat-box-heading-icon-container">
            <div className={widthPixels >= 768 ? "hide-icon" : "chat-box-button-container"} onClick={handleBackArrowClick}>
              <ArrowLeft className="back-to-chat-list-button" />
            </div>
            {selectedChat.isGroupChat ? (
              <>
                <h2 className="chat-name">{selectedChat.chatName}</h2>
                <div className="chat-box-button-container">
                  <Settings className="settings-button" />
                </div>
              </>
            ) : (
              <>
                <h2 className="chat-name">{getSender(loggedInUser, selectedChat.users)}</h2>
                <div className="chat-box-button-container">
                  <User className="users-button" onClick={handleUserClick} />
                </div>
              </>
            )}
          </div>
          <div className="messages-container"></div>
        </div>
      ) : (
        <div className="no-chat-selected-box">
          <p className="no-chat-selected-text">Select a user to start chatting</p>
        </div>
      )}
    </section>
  );
}
