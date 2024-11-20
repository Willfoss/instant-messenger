import React, { useState } from "react";
import "./component-styling/userHeader.css";
import { Search, X } from "lucide-react";

export default function UserHeader() {
  const [showSearchMenu, setShowSearchMenu] = useState(true);

  function toggleMenu() {
    setShowSearchMenu(!showSearchMenu);
  }

  return (
    <>
      <section id="user-header">
        <div className="user-header-container">
          <button className={`search-button`} onClick={toggleMenu}>
            <Search className="search-icon"></Search>
            Search users
          </button>
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
