import React from "react";
import "./component-styling/login.css";

export default function Login() {
  return (
    <section id="login-section">
      <div className="login-container">
        <form className="login-form">
          <h2 className="login-header">Log in</h2>
          <label htmlFor="email">
            <input className="login-text" name="email" type="email" placeholder="Email"></input>
          </label>
          <label htmlFor="password">
            <input className="login-text" name="password" type="password" placeholder="Password"></input>
          </label>
          <button className="login-button">Log in</button>
          <p className="to-signup"> Not a user? sign up here!</p>
        </form>
      </div>
    </section>
  );
}
