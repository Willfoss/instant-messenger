import React from "react";
import "./component-styling/userGroupSearch.css";

export default function UserGroupSearch(props) {
  const { searchedUser, setGroupChatMembers, groupChatMembers } = props;

  function handleAddUserToGroupChat() {
    if (!groupChatMembers.includes(searchedUser)) {
      setGroupChatMembers([...groupChatMembers, searchedUser]);
    }
  }

  return (
    <div className="user-card" onClick={handleAddUserToGroupChat}>
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
