import React, { useContext, useState } from "react";
import "./component-styling/login.css";
import { Link, useNavigate } from "react-router-dom";
import { logUserIn } from "../api";
import ErrorModal from "./ErrorModal";
import buttonLoading from "../assets/loading-on-button.json";
import { UserContext } from "../Context/UserContext";
import Lottie from "lottie-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isEmailError, setIsEmailError] = useState(false);
  const [isPasswordError, setIsPasswordError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { setLoggedInUser } = useContext(UserContext);
  const navigate = useNavigate;

  function handleEmailChange(event) {
    setEmail(event.target.value);
    setIsEmailError(false);
  }

  function handlePasswordChange(event) {
    setPassword(event.target.value);
    setIsPasswordError(false);
  }

  function handleGuestLogin() {
    setEmail("guest@guestemail.com");
    setPassword("guest");
  }

  function handleLoginFormSubmit(event) {
    event.preventDefault();
    if (!email) setIsEmailError(true);
    if (!password) setIsPasswordError(true);
    setIsLoading(true);
    setIsError(false);
    logUserIn(email, password)
      .then(({ user }) => {
        setIsLoading(false);
        setLoggedInUser({ name: user.name, email: user.email, picture: user.picture });
      })
      .catch((error) => {
        setIsError(true);
        setErrorMessage(error.response.data.message);
        setIsLoading(false);
      });
  }

  return (
    <section id="login-section">
      <div className="login-container">
        <form onSubmit={handleLoginFormSubmit} className="login-form">
          <h2 className="login-header">Log in</h2>
          {isError && <ErrorModal setIsError={setIsError} errorMessage={errorMessage} />}
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
            {isPasswordError && <p className="login-error-text ">Enter an Email Address</p>}
          </label>
          {isLoading === true ? (
            <div className="signup-button-loading">
              <Lottie className="button-loading-animation " animationData={buttonLoading} loop={true} />
            </div>
          ) : (
            <button className="login-button">Log in</button>
          )}
          <Link className="link" to="/signup">
            <p className="to-signup"> Not a user? sign up here!</p>
          </Link>
        </form>
        <button className="guest-button" onClick={handleGuestLogin}>
          Set Guest Account Credentials
        </button>
      </div>
    </section>
  );
}
