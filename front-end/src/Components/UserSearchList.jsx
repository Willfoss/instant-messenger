import React, { useState } from "react";
import "./component-styling/userSearchList.css";
import { accessChat } from "../api";
import ErrorModal from "./ErrorModal";
import Lottie from "lottie-react";
import buttonLoading from "../assets/loading-on-button.json";

export default function UserSearchList(props) {
  const { searchedUser, user, setSelectedChat, toggleSearchMenu, chats, setChats } = props;
  const [isError, setIsError] = useState(false);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState();

  function getAccessToChat() {
    setIsChatLoading(true);
    setIsError(false);

    const authorisationConfig = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };

    accessChat(searchedUser._id, authorisationConfig)
      .then(({ chat }) => {
        if (!chats.find((individualChat) => chat._id === individualChat._id)) setChats([chat, ...chats]);
        setIsChatLoading(false);
        setSelectedChat(chat);
        toggleSearchMenu();
      })
      .catch((error) => {
        setIsChatLoading(false);
        setIsError(true);
        setErrorMessage(error.response.data.message);
      });
  }

  if (isError === true) {
    return <ErrorModal errorMessage={errorMessage} setIsError={setIsError} />;
  }

  return (
    <div className={`user-card ${isChatLoading && "center-loading"}`} onClick={getAccessToChat}>
      {isChatLoading && (
        <div className="add-user-loading">
          <Lottie className="chat-loading" animationData={buttonLoading} loop={true} />
        </div>
      )}
      <img className="user-profile-image" src={searchedUser.picture}></img>
      <div className="user-info-container">
        <p className="user-card-text bold username">{searchedUser.name}</p>
        <p className="user-card-text">
          <span className="bold">Email: </span>
          {searchedUser.email}
        </p>
      </div>
    </div>
  );
}
