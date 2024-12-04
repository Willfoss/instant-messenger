import React, { useContext, useState } from "react";
import "./component-styling/userGroupSearch.css";
import { addUserToExistinGroupChat } from "../api";
import { UserContext } from "../Context/UserContext";

export default function UserGroupSearch(props) {
  const {
    searchedUser,
    setGroupChatMembers,
    groupChatMembers,
    setIsError,
    setErrorMessage,
    selectedChat,
    areUpdatingChatUser,
    setSelectedChat,
    getChatsAgain,
    setGetChatsAgain,
    setIsUserBeingAltered,
  } = props;
  const { loggedInUser } = useContext(UserContext);

  function handleAddUserToGroupChat() {
    if (!groupChatMembers.includes(searchedUser)) {
      setGroupChatMembers([...groupChatMembers, searchedUser]);
    }
  }

  function handleUpdateAddUserGroupChat() {
    if (selectedChat.users.find((user) => user._id === searchedUser._id)) {
      setIsError(true);
      setErrorMessage("This user is already in the group");
      return;
    }
    setIsUserBeingAltered(true);
    setIsError(false);

    const authorisationConfig = {
      headers: {
        Authorization: `Bearer ${loggedInUser.token}`,
      },
    };

    addUserToExistinGroupChat(selectedChat._id, searchedUser._id, authorisationConfig)
      .then(({ groupChat }) => {
        setSelectedChat(groupChat);
        setGetChatsAgain(!getChatsAgain);
        setIsUserBeingAltered(false);
      })
      .catch((error) => {
        setIsUserBeingAltered(false);
        setIsError(true);
        setErrorMessage(error.response.data.message);
      });
  }

  return (
    <div className="user-card" onClick={areUpdatingChatUser ? handleUpdateAddUserGroupChat : handleAddUserToGroupChat}>
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
