import React, { Fragment, useContext } from "react";
import "./component-styling/chatMessages.css";
import ScrollableFeed from "react-scrollable-feed";
import { UserContext } from "../Context/UserContext";
import { isLastMessageOfUser, isSameSender, isFirstMessageOfUser, getTimeFromMessage, returnDate, hasDateChanged } from "../utils/chatLogic";

export default function ChatMessages(props) {
  const { messages, selectedChat, setShowProfileModal, setChattingWithUser } = props;
  const { loggedInUser } = useContext(UserContext);

  function viewUserProfileClick(message) {
    setChattingWithUser(message.sender);
    setShowProfileModal(true);
  }

  return (
    <section id="messages">
      {messages &&
        messages.map((message, index) => {
          return (
            <Fragment key={message._id}>
              {hasDateChanged(messages, index, message.createdAt) && <h3 className="chat-date">{returnDate(message.createdAt)}</h3>}
              <div
                className={` ${
                  message.sender._id === loggedInUser._id ? "individual-message-container-you-sent-message" : "individual-message-container"
                }`}
              >
                {selectedChat.isGroupChat &&
                (isSameSender(messages, message, index, loggedInUser._id) || isLastMessageOfUser(messages, index, loggedInUser._id)) ? (
                  <img className="in-chat-picture" src={message.sender.picture} onClick={() => viewUserProfileClick(message)}></img>
                ) : (
                  loggedInUser._id !== message.sender._id && <div className="space-holder-for-picture"></div>
                )}
                <div
                  className={`${
                    message.sender._id === loggedInUser._id ? "group-chat-loggedInUser-message-container" : "group-chat-member-message-container"
                  }`}
                >
                  {selectedChat.isGroupChat && isFirstMessageOfUser(messages, index, loggedInUser._id) && (
                    <h4 className="group-chat-member-name">{message.sender.name}</h4>
                  )}
                  <p className="message-text">{message.content}</p>
                  <p className="message-time">{getTimeFromMessage(message.createdAt)}</p>
                </div>
              </div>
            </Fragment>
          );
        })}
    </section>
  );
}
