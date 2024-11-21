import React, { useContext, useEffect, useState } from "react";
import "./component-styling/userHeader.css";
import { Search, X, Bell } from "lucide-react";
import { UserContext } from "../Context/UserContext";

export default function UserHeader() {
  const [showSearchMenu, setShowSearchMenu] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearchLoading, seIsSearchLoading] = useState(false);
  const [isChatLoading, seIsChatLoading] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(true);
  const { loggedInUser } = useContext(UserContext);

  console.dir(loggedInUser);
  console.dir(loggedInUser.picture);

  function toggleSearchMenu() {
    setShowSearchMenu(!showSearchMenu);
  }

  function toggleUserMenu() {
    setShowUserMenu(!showUserMenu);
  }

  console.log(showUserMenu);

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
                <p className="dropdown-link">My Profile</p>
                <p className="dropdown-link">Logout</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <div className={`search-menu ${showSearchMenu === true ? "show-menu" : "hide-menu"}`}>
        <div className="search-header">
          <Search className="search-icon2"></Search>
          <label htmlFor="search" className="searchbar">
            <input className="search-bar-input" name="search" type="text" placeholder="Search for users here"></input>
          </label>
          <X className="close-search" onClick={() => setShowSearchMenu(false)}></X>
        </div>
      </div>
      <div className={`background-dimmer ${showSearchMenu === true ? "dim-screen" : ""}`}></div>
    </>
  );
}
