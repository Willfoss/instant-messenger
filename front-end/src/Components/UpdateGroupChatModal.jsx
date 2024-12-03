import React, { useState } from "react";
import { X } from "lucide-react";
import "./component-styling/updateGroupChatModal.css";
import GroupUserList from "./GroupUserList";
import Loading from "./Loading";
import NotFoundError from "./NotFoundError";
import UserGroupSearch from "./UserGroupSearch";
import { searchForUser, updateGroupChatName } from "../api";
import Lottie from "lottie-react";
import buttonLoading from "../assets/loading-on-button.json";
import ErrorModal from "./ErrorModal";

export default function UpdateGroupChatModal(props) {
  const { user, setSelectedChat, selectedChat, getChatsAgain, setGetChatsAgain, setShowUpdateGroupChat } = props;
  const [groupChatName, setGroupChatName] = useState(selectedChat.chatName);
  const [groupChatMembers, setGroupChatMembers] = useState(selectedChat.users);
  const [userSearch, setUserSearch] = useState("");
  const [searchedUsersResults, setSearchedUsersResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isNameChangeSubmitting, setIsNameChangeSubmitting] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isGroupNameError, setIsGroupNameError] = useState(false);
  const [isGroupMemberError, setIsGroupMemberError] = useState(false);
  const [isNotFoundError, setIsNotFoundError] = useState(false);

  function handleGroupNameChange(event) {
    setGroupChatName(event.target.value);
    setIsGroupNameError(false);
  }

  function removeUser(user_id) {
    const listWithoutUser = groupChatMembers.filter((groupMember) => {
      return groupMember._id !== user_id;
    });
    setGroupChatMembers(listWithoutUser);
  }

  function handleModalClose() {
    setShowUpdateGroupChat(false);
  }

  function searchedUserChange(event) {
    setUserSearch(event.target.value);
    handleSearchRequest(event.target.value);
  }

  function handleSearchRequest(searchTerm) {
    if (!searchTerm) return;

    setIsLoading(true);
    setIsGroupMemberError(false);
    setIsNotFoundError(false);
    setIsError(false);

    const authorisationConfig = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };

    searchForUser(searchTerm, authorisationConfig)
      .then(({ users }) => {
        setSearchedUsersResults(users);
        setIsLoading(false);
      })
      .catch((error) => {
        if (error.response.status === 404) {
          setIsNotFoundError(true);
        } else {
          setIsError(true);
        }
        setErrorMessage(error.response.data.message);
        setIsLoading(false);
      });
  }

  function handleUpdateName() {
    if (!groupChatName) {
      setIsGroupNameError(true);
      return;
    }
    setIsNameChangeSubmitting(true);
    setIsError(false);

    const authorisationConfig = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };

    updateGroupChatName(selectedChat._id, groupChatName, authorisationConfig)
      .then(({ groupChat }) => {
        console.log(groupChat);
        setIsNameChangeSubmitting(false);
        setSelectedChat(groupChat);
        setGetChatsAgain(!getChatsAgain);
      })
      .catch((error) => {
        console.log(error);
        setIsNameChangeSubmitting(false);
        setIsError(true);
        setErrorMessage(error.response.data.message);
      });
  }

  return (
    <section id="create-group">
      <div className="update-group-modal-container">
        <div className="update-group-modal-header-container">
          <h2 className="update-group-modal-header">{selectedChat.chatName} Settings</h2>
          <X className="close-update-group-modal" onClick={handleModalClose}></X>
        </div>
        <section className="group-members">
          {groupChatMembers.map((groupMember) => {
            return <GroupUserList key={groupMember._id} groupMember={groupMember} removeUser={removeUser} />;
          })}
        </section>
        {isError && <ErrorModal errorMessage={errorMessage} setIsError={setIsError} />}
        <form className="create-group-form">
          <label htmlFor="group-name">
            <p className="update-group-chat-label">Chat Name</p>
            <div className="update-chat-name-container">
              <input className="chat-name-text" name="group-name" type="text" value={groupChatName} onChange={handleGroupNameChange}></input>
              {isNameChangeSubmitting ? (
                <div className="update-name-button-loading">
                  <Lottie className="create-group-loading-animation " animationData={buttonLoading} loop={true} />
                </div>
              ) : (
                <button className="update-group-button" onClick={handleUpdateName}>
                  Update
                </button>
              )}
              {isGroupNameError && <p className="group-error-text ">You must provide a group name</p>}
            </div>
          </label>

          <label htmlFor="search-users">
            <p className="update-group-chat-label">Add users</p>
            <input
              className="search-users-text"
              name="search-users"
              type="text"
              placeholder="Search For Users"
              value={userSearch}
              onChange={searchedUserChange}
            ></input>
          </label>
          <section className="user-search-list">
            {isLoading ? (
              <Loading skeletons={2} />
            ) : isNotFoundError ? (
              <NotFoundError errorMessage={errorMessage} />
            ) : (
              searchedUsersResults.slice(0, 5).map((user) => {
                return (
                  <UserGroupSearch key={user._id} searchedUser={user} setGroupChatMembers={setGroupChatMembers} groupChatMembers={groupChatMembers} />
                );
              })
            )}
          </section>
        </form>
      </div>
    </section>
  );
}
