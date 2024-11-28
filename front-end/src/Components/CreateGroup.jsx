import React, { useState } from "react";
import "./component-styling/createGroup.css";
import { X } from "lucide-react";
import { searchForUser } from "../api";
import Loading from "./Loading";
import UserGroupSearch from "./UserGroupSearch";

export default function CreateGroup(props) {
  const { setShowCreateGroup, user } = props;

  const [groupChatName, setGroupChatName] = useState("");
  const [groupChatUsers, setGroupChatUsers] = useState([]);
  const [userSearch, setUserSearch] = useState("");
  const [searchedUsersResults, setSearchedUsersResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  function groupChatNameClick(event) {
    setGroupChatName(event.target.value);
  }

  function searchedUserClick(event) {
    setUserSearch(event.target.value);
    handleSearchRequest(event.target.value);
  }

  function handleSearchRequest(searchTerm) {
    if (!searchTerm) return;

    setIsLoading(true);

    const authorisationConfig = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };

    searchForUser(searchTerm, authorisationConfig)
      .then(({ users }) => {
        console.log(users);
        setSearchedUsersResults(users);
        setIsLoading(false);
      })
      .catch((error) => {
        setIsError(true);
        setErrorMessage(error.response.data.message);
        setIsLoading(false);
      });
  }

  return (
    <section id="create-group">
      <div className="group-modal-container">
        <div className="group-modal-header-container">
          <h2 className="group-modal-header">Create Group Chat</h2>
          <X className="close-group-modal" onClick={() => setShowCreateGroup(false)}></X>
        </div>
        <form className="create-group-form">
          <label htmlFor="group-name">
            <input
              className="chat-name-text"
              name="group-name"
              type="text"
              placeholder="Chat Name"
              value={groupChatName}
              onChange={groupChatNameClick}
            ></input>
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
          </label>
          <section className="user-search-list">
            {isLoading ? (
              <Loading skeletons={2} />
            ) : (
              searchedUsersResults.map((user) => {
                return <UserGroupSearch key={user._id} searchedUser={user} />;
              })
            )}
          </section>

          <button className="create-group-button">Create Group</button>
        </form>
      </div>
    </section>
  );
}
