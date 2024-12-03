import React from "react";
import "./component-styling/profileModal.css";
import { X } from "lucide-react";

export default function ProfileModal(props) {
  const { setShowProfileModal, user } = props;
  return (
    <section id="profile-modal">
      <div className="profile-modal-container">
        <X className="close-profile-modal" onClick={() => setShowProfileModal(false)}></X>
        <div className="profile-contents-container">
          <h2 className="profile-modal-name-text">{user.name}</h2>
          <img className="profile-picture" alt="user profile picture" src={user.picture}></img>
          <p className="profile-modal-email-text">
            <span className="bold">Email: </span>
            {user.email}
          </p>
        </div>
      </div>
    </section>
  );
}
