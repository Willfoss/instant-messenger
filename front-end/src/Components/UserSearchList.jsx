import React, { useState } from "react";
import "./component-styling/userSearchList.css";
import { accessChat } from "../api";
import ErrorModal from "./ErrorModal";

export default function UserSearchList(props) {
  const { searchedUser, user, setIsChatLoading, setSelectedChat, toggleSearchMenu, chats, setChats } = props;
  const [isError, setIsError] = useState(false);
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
        console.log(chat);
        if (!chats.find((individualChat) => chat._id === individualChat._id)) setChats([chat, ...chats]);
        setIsChatLoading(false);
        setSelectedChat(chat._id);
        toggleSearchMenu();
      })
      .catch((error) => {
        setIsChatLoading(false);
        setIsError(true);
        console.log(error);
        setErrorMessage(error.response);
      });
  }

  if (isError === true) {
    return <ErrorModal errorMessage={errorMessage} setIsError={setIsError} />;
  }

  return (
    <div className="user-card" onClick={getAccessToChat}>
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
