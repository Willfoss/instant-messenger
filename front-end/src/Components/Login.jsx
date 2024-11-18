import React, { useState } from "react";
import "./component-styling/login.css";
import { Link } from "react-router-dom";
import { logUserIn } from "../api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isEmailError, setIsEmailError] = useState(false);
  const [isPasswordError, setIsPasswordError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  function handleEmailChange(event) {
    setEmail(event.target.value);
  }

  function handlePasswordChange(event) {
    setPassword(event.target.value);
  }

  function handleLoginFormSubmit(event) {
    event.preventDefault();
    if (!email) setIsEmailError(true);
    if (!password) setIsPasswordError(true);
    setIsLoading(true);
    console.log("hello");
  }

  return (
    <section id="login-section">
      <div className="login-container">
        <form onSubmit={handleLoginFormSubmit} className="login-form">
          <h2 className="login-header">Log in</h2>
          <label htmlFor="email">
            <input className="login-text text-input" name="email" type="email" value={email} onChange={handleEmailChange} placeholder="Email"></input>
            {isEmailError && <p className="login-error-text ">Enter a Name</p>}
          </label>
          <label htmlFor="password">
            <input
              className="login-text text-input"
              name="password"
              type="password"
              value={password}
              onChange={handlePasswordChange}
              placeholder="Password"
            ></input>
            {isPasswordError && <p className="login-error-text ">Enter a Name</p>}
          </label>
          <button className="login-button">Log in</button>
          <Link className="link" to="/signup">
            <p className="to-signup"> Not a user? sign up here!</p>
          </Link>
        </form>
      </div>
    </section>
  );
}
