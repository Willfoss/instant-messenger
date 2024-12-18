import React, { useContext, useEffect, useRef, useState } from "react";
import { UserContext } from "../Context/UserContext";
import "./component-styling/individualChatMessageBox.css";
import { ArrowLeft, Settings, User } from "lucide-react";
import { getSender, getSenderFullDetails } from "../utils/chatLogic";
import buttonLoading from "../assets/loading-on-button.json";
import typing from "../assets/typing-animation";
import Lottie from "lottie-react";
import { SendHorizontal } from "lucide-react";
import { getAllMessagesForChat, sendNewMessage } from "../api";
import ChatMessages from "./ChatMessages";
import io from "socket.io-client";

const ENDPOINT = "https://instant-messenger-i820.onrender.com";
let socket, selectedChatCompare;

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
    notifications,
    setNotifications,
  } = props;
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isMessageSending, setIsMessageSending] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { loggedInUser } = useContext(UserContext);
  const [socketConnected, setSocketConnected] = useState(false);
  const [isUserTyping, setIsUserTyping] = useState(false);
  const [isLoggedInUserTyping, setIsLoggedInUserTyping] = useState(false);
  const [socketIoRoom, setSocketIoRoom] = useState(null);
  const [timer, setTimer] = useState(0);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", loggedInUser);
    socket.on("connected", () => {
      setSocketConnected(true);
    });
  }, []);

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

  useEffect(() => {
    getMessages();
    selectedChatCompare = selectedChat;
  }, [selectedChat, getChatsAgain]);

  useEffect(() => {
    socket.on("message received", (newMessageReceived) => {
      if (!selectedChatCompare || selectedChatCompare._id !== newMessageReceived.chat._id) {
        if (!notifications.includes(newMessageReceived)) {
          setNotifications([newMessageReceived, ...notifications]);
          setGetChatsAgain(!getChatsAgain);
        }
      } else {
        setMessages([...messages, newMessageReceived]);
      }
    });
    socket.on("typing", (chat) => {
      setSocketIoRoom(chat);
      setIsUserTyping(true);
    });
    socket.on("stop typing", () => {
      setIsUserTyping(false);
    });
  });

  function getMessages() {
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
        socket.emit("join chat", selectedChat._id);
      })
      .catch((error) => {
        setIsLoading(false);
        setIsError(true);
        setErrorMessage(error.response.data.message);
      });
  }

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
    }
  }, [messages, isUserTyping]);

  function handleButtonSendMessage() {
    setIsMessageSending(true);
    setIsError(false);
    socket.emit("stop typing", selectedChat._id);

    const authorisationConfig = {
      headers: {
        Authorization: `Bearer ${loggedInUser.token}`,
      },
    };

    sendNewMessage(selectedChat._id, newMessage, authorisationConfig)
      .then(({ message }) => {
        setNewMessage("");
        socket.emit("new message", message);
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

  function handleSendMessageChange(event) {
    setSocketIoRoom(selectedChat._id);
    setNewMessage(event.target.value);
    if (!socketConnected) return;
    if (!isLoggedInUserTyping) {
      setIsLoggedInUserTyping(true);
      socket.emit("typing", selectedChat._id);
    }

    if (timer) {
      clearTimeout(timer);
    }

    const typingTimer = setTimeout(() => {
      socket.emit("stop typing", selectedChat._id);
      setIsLoggedInUserTyping(false);
    }, 3000);

    setTimer(typingTimer);
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
            <div className="messages-container" ref={messagesEndRef}>
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
              <div ref={messagesEndRef}></div>
              {isUserTyping && socketIoRoom === selectedChat._id && (
                <div className="typing">
                  <Lottie className="typing-animation" animationData={typing} loop={true} />
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
