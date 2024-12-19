import React, { useContext } from "react";
import "./component-styling/groupUserList.css";
import { X } from "lucide-react";
import { UserContext } from "../Context/UserContext";

export default function GroupUserList(props) {
  const { groupMember, removeUser, selectedChat, handleUpdateRemoveUser, areUpdatingChatUser } = props;

  const { loggedInUser } = useContext(UserContext);

  function handleRemoveUser() {
    areUpdatingChatUser ? handleUpdateRemoveUser(groupMember) : removeUser(groupMember._id);
  }

  return (
    <div className="user-list-container">
      <p>{groupMember.name}</p>
      {areUpdatingChatUser && selectedChat.groupAdmin._id === loggedInUser._id && groupMember._id !== loggedInUser._id && (
        <X className="remove-user" onClick={handleRemoveUser}></X>
      )}
      {!areUpdatingChatUser && <X className="remove-user" onClick={handleRemoveUser}></X>}
    </div>
  );
}
