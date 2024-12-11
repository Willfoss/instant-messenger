import React, { useContext, useEffect, useRef, useState } from "react";
import "./component-styling/userHeader.css";
import { Search, X, Bell } from "lucide-react";
import { UserContext } from "../Context/UserContext";
import { useNavigate } from "react-router-dom";
import { searchForUser } from "../api";
import ErrorModal from "./ErrorModal";
import Loading from "./Loading";
import UserSearchList from "./UserSearchList";

export default function UserHeader(props) {
  const { selectedChat, setSelectedChat, chats, setChats, setShowProfileModal, setChattingWithUser } = props;
  const [showSearchMenu, setShowSearchMenu] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { loggedInUser } = useContext(UserContext);
  const searchInput = useRef(null);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  function toggleSearchMenu() {
    setShowSearchMenu(!showSearchMenu);
    if (showSearchMenu === false) {
      setSearchTerm("");
      setSearchResults([]);
      searchInput.current.focus();
    }
  }

  function toggleUserMenu() {
    setShowUserMenu(!showUserMenu);
  }

  function logoutUser() {
    localStorage.removeItem("user");
    navigate("/");
  }

  function handleUserProfileClick() {
    setChattingWithUser("");
    setShowProfileModal(true);
    setShowUserMenu(false);
  }

  function handleSearchRequest(event) {
    if (event.key === "Enter") {
      if (!searchTerm) return;

      setIsSearchLoading(true);

      const authorisationConfig = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      searchForUser(searchTerm, authorisationConfig)
        .then(({ users }) => {
          setSearchResults(users);
          setIsSearchLoading(false);
        })
        .catch((error) => {
          setIsError(true);
          setErrorMessage(error.response.data.message);
          setIsSearchLoading(false);
        });
    }
  }

  function handleSearchChange(event) {
    setSearchTerm(event.target.value);
    setIsError(false);
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
            <Bell className="bell-icon"></Bell>
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
              onKeyDown={handleSearchRequest}
            ></input>
          </label>
          <X className="close-search" onClick={() => setShowSearchMenu(false)}></X>
        </div>
        <section id="search-results-container">
          {isError && <ErrorModal errorMessage={errorMessage} setIsError={setIsError} />}
          {isSearchLoading && <Loading skeletons={8} />}
          {!isError && !isSearchLoading && (
            <section id="user-search-list">
              {searchResults.map((userResult) => (
                <UserSearchList
                  key={userResult._id}
                  searchedUser={userResult}
                  user={user}
                  setIsChatLoading={setIsChatLoading}
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
