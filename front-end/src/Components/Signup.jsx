import React from "react";
import "./component-styling/signup.css";

export default function Signup() {
  return (
    <section id="signup-section">
      <div className="signup-container">
        <form className="signup-form">
          <h2 className="signup-header">Sign Up for Free</h2>
          <label className="signup-text" htmlFor="firstname">
            First Name
            <input name="firstname" type="text" place></input>
          </label>

          <label className="signup-text" htmlFor="lastname">
            Last Name
            <input className="signup-text" name="lastname" type="text"></input>
          </label>
          <label className="signup-text" htmlFor="email">
            Email Address
            <input className="signup-text" name="email" type="email"></input>
          </label>
          <label className="signup-text" htmlFor="password">
            Password
            <input className="signup-text" name="password" type="password"></input>
          </label>
          <label className="signup-text" htmlFor="confirm-password">
            Confirm Password
            <input className="signup-text" name="confirm-password" type="confirm-password"></input>
          </label>
          <button className="signup-button">Log in</button>
          <p className="to-signup"> Already a user? Log in!</p>
        </form>
      </div>
    </section>
  );
}
