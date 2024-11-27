import React, { useState } from "react";
import "./component-styling/userSearchList.css";
import { accessChat } from "../api";

export default function UserSearchList(props) {
  const { searchedUser, user, setIsChatLoading, setSelectedChat } = props;
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState();

  function getAccessToChat() {
    console.dir(user);
    setIsChatLoading(true);

    const authorisationConfig = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };

    accessChat(searchedUser._id, authorisationConfig)
      .then(({ data }) => {
        console.log(data);
        console.log(data.chat._id);
        setIsChatLoading(false);
        setSelectedChat(data.chat._id);
      })
      .catch((error) => {
        setIsChatLoading(false);
        setIsError(true);
        setErrorMessage(error.response.data.message);
      });
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
