import React from "react";
import "./component-styling/groupUserList.css";
import { X } from "lucide-react";

export default function GroupUserList(props) {
  const { groupMember, removeUser } = props;

  function handleRemoveUser() {
    removeUser(groupMember._id);
  }

  return (
    <div className="user-list-container">
      <p>{groupMember.name}</p>
      <X className="remove-user" onClick={handleRemoveUser}></X>
    </div>
  );
}
