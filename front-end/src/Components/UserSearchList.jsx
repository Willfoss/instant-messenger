import React from "react";
import "./component-styling/userSearchList.css";

export default function UserSearchList(props) {
  const { searchResults } = props;

  function getAccessToChat(user_id) {}

  return (
    <section id="user-search-list">
      {searchResults.map((user) => {
        return (
          <div className="user-card" key={user._id} onClick={getAccessToChat}>
            <img className="user-profile-image" src={user.pictre}></img>
            <div className="user-info-container">
              <p className="user-card-text bold username">{user.name}</p>
              <p className="user-card-text">
                <span className="bold">Email: </span>
                {user.email}
              </p>
            </div>
          </div>
        );
      })}
    </section>
  );
}
