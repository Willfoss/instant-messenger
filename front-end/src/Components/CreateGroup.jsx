import React, { useState } from "react";
import "./component-styling/createGroup.css";
import { X } from "lucide-react";
import { createNewGroupChat, searchForUser } from "../api";
import Loading from "./Loading";
import UserGroupSearch from "./UserGroupSearch";
import GroupUserList from "./GroupUserList";
import Lottie from "lottie-react";
import buttonLoading from "../assets/loading-on-button.json";
import ErrorModal from "./ErrorModal";
import NotFoundError from "./NotFoundError";
export default function CreateGroup(props) {
  const { setShowCreateGroup, user, chats, setChats, setSelectedChat } = props;

  const [groupChatName, setGroupChatName] = useState("");
  const [groupChatMembers, setGroupChatMembers] = useState([]);
  const [userSearch, setUserSearch] = useState("");
  const [searchedUsersResults, setSearchedUsersResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isGroupNameError, setIsGroupNameError] = useState(false);
  const [isGroupMemberError, setIsGroupMemberError] = useState(false);
  const [isNotFoundError, setIsNotFoundError] = useState(false);

  function groupChatNameClick(event) {
    setGroupChatName(event.target.value);
    setIsGroupNameError(false);
  }

  function searchedUserClick(event) {
    setUserSearch(event.target.value);
    handleSearchRequest(event.target.value);
  }

  function removeUser(user_id) {
    const listWithoutUser = groupChatMembers.filter((groupMember) => {
      return groupMember._id !== user_id;
    });
    setGroupChatMembers(listWithoutUser);
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

  function handleCreateGroupSubmit(event) {
    event.preventDefault();
    if (!groupChatName) {
      setIsGroupNameError(true);
    }
    if (groupChatMembers.length < 2) {
      setIsGroupMemberError(true);
    }

    if (isGroupMemberError || isGroupNameError) return;

    setIsFormSubmitting(true);
    setIsError(false);

    const authorisationConfig = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };

    const userIds = groupChatMembers.map((member) => member._id);

    createNewGroupChat(groupChatName, userIds, authorisationConfig)
      .then(({ groupChat }) => {
        setIsFormSubmitting(false);
        setChats([groupChat, ...chats]);
        setSelectedChat(groupChat);
        setShowCreateGroup(false);
      })
      .catch((error) => {
        console.log(error);
        setIsError(true);
        setIsFormSubmitting(false);
        setErrorMessage(error.response.data.message);
      });
  }

  return (
    <section id="create-group">
      <div className="group-modal-container">
        <div className="group-modal-header-container">
          <h2 className="group-modal-header">Create Group Chat</h2>
          <X className="close-group-modal" onClick={() => setShowCreateGroup(false)}></X>
        </div>
        {isError && <ErrorModal errorMessage={errorMessage} setIsError={setIsError} />}
        <form className="create-group-form" onSubmit={handleCreateGroupSubmit}>
          <label htmlFor="group-name">
            <input
              className="chat-name-text"
              name="group-name"
              type="text"
              placeholder="Chat Name"
              value={groupChatName}
              onChange={groupChatNameClick}
            ></input>
            {isGroupNameError && <p className="group-error-text ">You must provide a group name</p>}
          </label>
          <label htmlFor="search-users">
            <input
              className="search-users-text"
              name="search-users"
              type="text"
              placeholder="Search For Users"
              value={userSearch}
              onChange={searchedUserClick}
            ></input>
            {isGroupMemberError && <p className="group-error-text ">You must provide at least 2 users to add to the group chat</p>}
          </label>
          <section className="selected-group-members">
            {groupChatMembers.map((groupMember) => {
              return <GroupUserList key={groupMember._id} groupMember={groupMember} removeUser={removeUser} />;
            })}
          </section>
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
          {isFormSubmitting === true ? (
            <div className="create-group-button-loading">
              <Lottie className="create-group-loading-animation " animationData={buttonLoading} loop={true} />
            </div>
          ) : (
            <button className="create-group-button">Create Group</button>
          )}
        </form>
      </div>
    </section>
  );
}
