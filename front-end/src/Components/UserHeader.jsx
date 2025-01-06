import React, { useContext, useEffect, useRef, useState } from "react";
import "./component-styling/userHeader.css";
import { Search, X, Bell } from "lucide-react";
import { UserContext } from "../Context/UserContext";
import { useNavigate } from "react-router-dom";
import { searchForUser } from "../api";
import ErrorModal from "./ErrorModal";
import Loading from "./Loading";
import UserSearchList from "./UserSearchList";
import { getSender, getTimeFromMessage, returnDate } from "../utils/chatLogic";
import NotFoundError from "./NotFoundError";
import { NotificationsContext } from "../Context/NotificationsContext";

export default function UserHeader(props) {
  const {
    selectedChat,
    setSelectedChat,
    chats,
    setChats,
    setShowProfileModal,
    setChattingWithUser,
    showNotificationsMenu,
    setShowNotificationsMenu,
    showUserMenu,
    setShowUserMenu,
  } = props;
  const { notifications, setNotifications } = useContext(NotificationsContext);
  const [showSearchMenu, setShowSearchMenu] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isNotFoundError, setIsNotFoundError] = useState(false);
  const { loggedInUser, setLoggedInUser } = useContext(UserContext);
  const searchInput = useRef(null);
  const navigate = useNavigate();

  function toggleSearchMenu() {
    setShowSearchMenu(!showSearchMenu);
    if (showSearchMenu === false) {
      setSearchTerm("");
      setSearchResults([]);
      searchInput.current.focus();
    }
  }

  function toggleUserMenu() {
    if (showNotificationsMenu) {
      setShowNotificationsMenu(false);
    }
    setShowUserMenu(!showUserMenu);
  }

  function toggleNotificationsMenu() {
    if (showUserMenu) {
      setShowUserMenu(false);
    }
    setShowNotificationsMenu(!showNotificationsMenu);
  }

  function logoutUser() {
    localStorage.removeItem("user");
    setLoggedInUser("");
    navigate("/");
  }

  function handleUserProfileClick() {
    setChattingWithUser("");
    setShowProfileModal(true);
    setShowUserMenu(false);
  }

  function handleSearchChange(event) {
    setSearchTerm(event.target.value);
    handleSearchRequest(event.target.value);
  }

  function handleNotificationClick(notification) {
    setSelectedChat(notification.chat);
    setNotifications(notifications.filter((n) => n !== notification));
    setShowNotificationsMenu(!showNotificationsMenu);
  }

  function handleSearchRequest(search) {
    if (!search) {
      return;
    }

    setIsSearchLoading(true);
    setIsNotFoundError(false);
    setIsError(false);

    const authorisationConfig = {
      headers: {
        Authorization: `Bearer ${loggedInUser.token}`,
      },
    };

    searchForUser(search, authorisationConfig)
      .then(({ users }) => {
        setSearchResults(users);
        setIsSearchLoading(false);
      })
      .catch((error) => {
        if (error.response.status === 404) {
          setSearchResults([]);
          setIsNotFoundError(true);
        } else {
          setIsError(true);
        }
        setErrorMessage(error.response.data.message);
        setIsSearchLoading(false);
      });
  }

  return (
    <>
      <section id="user-header">
        <div className="user-header-container">
          <button className={`search-button`} onClick={toggleSearchMenu}>
            <Search className="search-icon"></Search>
            Search users
          </button>
          <div className="user-profile-picture-container">
            <div className="notification-bell">
              <Bell className="bell-icon" onClick={toggleNotificationsMenu}></Bell>
              {notifications.length > 0 && (
                <p className="notification-number" onClick={toggleNotificationsMenu}>
                  {notifications.length}
                </p>
              )}
            </div>

            <div className={`notifications-menu-container ${showNotificationsMenu === true ? "open-notifications-menu" : ""}`}>
              <div className="dropdown-menu-notifications">
                <div className="notification-dropdown-content">
                  {!notifications.length && <p className="no-messages">No New Messages</p>}
                  {notifications.map((notification) => {
                    return (
                      <div className="notification" key={notification._id} onClick={() => handleNotificationClick(notification)}>
                        {notification.chat.isGroupChat ? (
                          <p className="notification-chat">New Message in {notification.chat.chatName}</p>
                        ) : (
                          <p className="notification-chat">New message from {getSender(loggedInUser, notification.chat.users)}</p>
                        )}
                        <p className="notification-time">
                          {returnDate(notification.createdAt)} {getTimeFromMessage(notification.createdAt)}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            <img className="user-profile-picture" src={loggedInUser.picture} onClick={toggleUserMenu}></img>
            <div className={`dropdown-menu-container ${showUserMenu === true ? "open-menu" : ""}`}>
              <div className="dropdown-menu">
                <div className="dropdown-content">
                  <img className="user-profile-picture-menu" src={loggedInUser.picture}></img>
                  <h3 className="name-header">{loggedInUser.name}</h3>
                </div>
                <hr></hr>
                <p className="dropdown-link" onClick={handleUserProfileClick}>
                  My Profile
                </p>
                <p className="dropdown-link" onClick={logoutUser}>
                  Logout
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <div className={`search-menu ${showSearchMenu === true ? "show-menu" : "hide-menu"}`}>
        <div className="search-header">
          <Search className="search-icon2"></Search>
          <label htmlFor="search" className="searchbar">
            <input
              className="search-bar-input"
              name="search"
              type="text"
              placeholder="Search for users here"
              value={searchTerm}
              ref={searchInput}
              onChange={handleSearchChange}
            ></input>
          </label>
          <X className="close-search" onClick={() => setShowSearchMenu(false)}></X>
        </div>
        <section id="search-results-container">
          {isError && <ErrorModal errorMessage={errorMessage} setIsError={setIsError} />}
          {isSearchLoading ? <Loading skeletons={8} /> : isNotFoundError && <NotFoundError errorMessage={errorMessage} />}
          {!isError && !isSearchLoading && (
            <section id="user-search-list">
              {searchResults.map((userResult) => (
                <UserSearchList
                  key={userResult._id}
                  searchedUser={userResult}
                  user={loggedInUser}
                  setSelectedChat={setSelectedChat}
                  selectedChat={selectedChat}
                  toggleSearchMenu={toggleSearchMenu}
                  chats={chats}
                  setChats={setChats}
                ></UserSearchList>
              ))}
            </section>
          )}
        </section>
      </div>
      <div className={`background-dimmer ${showSearchMenu === true ? "dim-screen" : ""}`}></div>
    </>
  );
}
