import React from "react";
import "./component-styling/userGroupSearch.css";

export default function UserGroupSearch(props) {
  const { searchedUser } = props;

  return (
    <div className="user-card">
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
