import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../Context/UserContext";
import "./component-styling/individualChatMessageBox.css";
import { ArrowLeft, Settings, User } from "lucide-react";
import { getSender, getSenderFullDetails } from "../utils/chatLogic";
import buttonLoading from "../assets/loading-on-button.json";
import Lottie from "lottie-react";
import { SendHorizontal } from "lucide-react";
import { getAllMessagesForChat, sendNewMessage } from "../api";
import ChatMessages from "./ChatMessages";

export default function IndividualChatMessageBox(props) {
  const {
    selectedChat,
    getChatsAgain,
    setGetChatsAgain,
    setSelectedChat,
    widthPixels,
    setShowProfileModal,
    setChattingWithUser,
    setShowUpdateGroupChat,
  } = props;
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isMessageSending, setIsMessageSending] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { loggedInUser } = useContext(UserContext);

  function handleBackArrowClick() {
    setSelectedChat("");
  }

  function handleUserClick() {
    const chattingWith = getSenderFullDetails(loggedInUser, selectedChat.users);
    setChattingWithUser(chattingWith);
    setShowProfileModal(true);
  }

  function handleGroupSettingsClick() {
    setShowUpdateGroupChat(true);
  }

  function handleSendMessageChange(event) {
    setNewMessage(event.target.value);
  }

  useEffect(() => {
    if (!selectedChat) return;

    setIsLoading(true);
    setIsError(false);

    const authorisationConfig = {
      headers: {
        Authorization: `Bearer ${loggedInUser.token}`,
      },
    };

    getAllMessagesForChat(selectedChat._id, authorisationConfig)
      .then(({ messages }) => {
        setMessages(messages);
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
        setIsError(true);
        setErrorMessage(error.response.data.message);
      });
  }, [selectedChat, getChatsAgain]);

  function handleButtonSendMessage() {
    setIsMessageSending(true);
    setIsError(false);

    const authorisationConfig = {
      headers: {
        Authorization: `Bearer ${loggedInUser.token}`,
      },
    };

    sendNewMessage(selectedChat._id, newMessage, authorisationConfig)
      .then(({ message }) => {
        setNewMessage("");
        setMessages([...messages, message]);
        setIsMessageSending(false);
      })
      .catch((error) => {
        setIsMessageSending(false);
        setIsError(true);
        setErrorMessage(error.response.data.message);
      });
  }

  function handleKeyPressSendMessage(event) {
    if (event.key === "Enter" && newMessage) {
      event.preventDefault();
      handleButtonSendMessage();
    }
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
                  <Settings className="settings-button" onClick={handleGroupSettingsClick} />
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
          <div className="messaging-container">
            <div className="messages-container">
              {isLoading ? (
                <Lottie className="load-chat-animation" animationData={buttonLoading} loop={true} />
              ) : (
                <div className="messages">
                  <ChatMessages
                    messages={messages}
                    selectedChat={selectedChat}
                    setShowProfileModal={setShowProfileModal}
                    setChattingWithUser={setChattingWithUser}
                  />
                </div>
              )}
            </div>
            <form id="send-message-form">
              <label className="send-message-label" htmlFor="type-message" aria-label="Enter a message">
                <input
                  className="send-message"
                  type="text"
                  name="type-message"
                  placeholder="Enter a message"
                  value={newMessage}
                  onKeyDown={handleKeyPressSendMessage}
                  onChange={handleSendMessageChange}
                ></input>
                {!newMessage ? (
                  <div className="send-icon-container-disabled">
                    <SendHorizontal className="send-icon-disabled" />
                  </div>
                ) : (
                  <div className="send-icon-container" onClick={handleButtonSendMessage}>
                    {isMessageSending ? (
                      <Lottie className="message-sending-animation" animationData={buttonLoading} loop={true} />
                    ) : (
                      <SendHorizontal className="send-icon" />
                    )}
                  </div>
                )}
              </label>
            </form>
          </div>
        </div>
      ) : (
        <div className="no-chat-selected-box">
          <p className="no-chat-selected-text">Select a user to start chatting</p>
        </div>
      )}
    </section>
  );
}
