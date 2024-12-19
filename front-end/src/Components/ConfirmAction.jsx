import React from "react";
import "./component-styling/confirmAction.css";

export default function ConfirmAction(props) {
  const { setShowUpdateGroupChat, setToggleShowConfirmDelete, user, handleUpdateRemoveUser } = props;

  function handleDoNotLeaveClick() {
    setToggleShowConfirmDelete(false);
  }

  function handleLeaveGroupClick() {
    handleUpdateRemoveUser(user);
    setToggleShowConfirmDelete(false);
    setShowUpdateGroupChat(false);
  }

  return (
    <section id="confirm-action">
      <div className="confirm-action-container">
        <p className="confirm-action-text">Are you sure you want to leave this group?</p>
        <div className="confirm-action-buttons-container">
          <button className="leave-button" onClick={handleLeaveGroupClick}>
            Yes
          </button>
          <button className="do-not-leave-button" onClick={handleDoNotLeaveClick}>
            No
          </button>
        </div>
      </div>
    </section>
  );
}
