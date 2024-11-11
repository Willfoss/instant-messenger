import React, { useState } from "react";
import "./component-styling/login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleEmailChange(event) {
    setEmail(event.target.value);
  }

  function handlePasswordChange(event) {
    setPassword(event.target.value);
  }

  function handleLoginFormSubmit(event) {
    event.preventDefault();
    console.log("hello");
  }

  return (
    <section id="login-section">
      <div className="login-container">
        <form onSubmit={handleLoginFormSubmit} className="login-form">
          <h2 className="login-header">Log in</h2>
          <label htmlFor="email">
            <input className="login-text" name="email" type="email" value={email} onChange={handleEmailChange} placeholder="Email"></input>
          </label>
          <label htmlFor="password">
            <input
              className="login-text"
              name="password"
              type="password"
              value={password}
              onChange={handlePasswordChange}
              placeholder="Password"
            ></input>
          </label>
          <button className="login-button">Log in</button>
          <p className="to-signup"> Not a user? sign up here!</p>
        </form>
      </div>
    </section>
  );
}
