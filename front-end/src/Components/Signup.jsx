import React, { useState } from "react";
import "./component-styling/signup.css";
import { Link } from "react-router-dom";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [file, setFile] = useState("");

  function handleNameChange(event) {
    setName(event.target.value);
  }

  function handleEmailChange(event) {
    setEmail(event.target.value);
  }

  function handlePasswordChange(event) {
    setPassword(event.target.value);
  }

  function handleConfirmPasswordChange(event) {
    setConfirmPassword(event.target.value);
  }

  function handleFileChange(event) {
    console.log(event.target.value);
  }

  function handleSignupSubmit(event) {
    event.preventDefault();
  }

  return (
    <section id="signup-section">
      <div className="signup-container">
        <form onSubmit={handleSignupSubmit} className="signup-form">
          <h2 className="signup-header">Sign Up for Free</h2>
          <label className="signup-text" htmlFor="name">
            Name
            <input className="signup-text text-input" name="name" type="text" value={name} onChange={handleNameChange}></input>
          </label>
          <label className="signup-text " htmlFor="email">
            Email Address
            <input className="signup-text text-input" name="email" type="email" value={email} onChange={handleEmailChange}></input>
          </label>
          <label className="signup-text" htmlFor="password">
            Password
            <input className="signup-text text-input" name="password" type="password" value={password} onChange={handleConfirmPasswordChange}></input>
          </label>
          <label className="signup-text" htmlFor="confirm-password">
            Confirm Password
            <input
              className="signup-text text-input"
              name="confirm-password"
              type="confirm-password"
              value={confirmPassword}
              onChange={handlePasswordChange}
            ></input>
          </label>
          <label className="signup-text" htmlFor="profile-picture">
            Upload your file
            <input className="image-uploader" type="file" name="profile-picture" accept="image/*" value={file} onChange={handleFileChange}></input>
          </label>
          <button className="signup-button">Sign up</button>
          <Link className="link" to="/">
            <p className="to-login"> Already a user? Log in!</p>
          </Link>
        </form>
      </div>
    </section>
  );
}
