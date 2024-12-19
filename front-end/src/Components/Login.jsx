import React, { useContext, useEffect, useState } from "react";
import "./component-styling/login.css";
import { Link, useNavigate } from "react-router-dom";
import { logUserIn } from "../api";
import ErrorModal from "./ErrorModal";
import buttonLoading from "../assets/loading-on-button.json";
import Lottie from "lottie-react";
import Header from "./Header";
import { UserContext } from "../Context/UserContext";
import Toast from "./Toast";

export default function Login(props) {
  const { showToast, setShowToast } = props;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isEmailError, setIsEmailError] = useState(false);
  const [isPasswordError, setIsPasswordError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const { setUserChanged, userChanged, setLoggedInUser } = useContext(UserContext);

  function handleEmailChange(event) {
    setEmail(event.target.value.toLowerCase());
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
    if (!email) {
      setIsEmailError(true);
    }
    if (!password) {
      setIsPasswordError(true);
      return;
    }
    setIsLoading(true);
    setIsError(false);
    logUserIn(email, password)
      .then(({ user }) => {
        setIsLoading(false);
        setLoggedInUser(user);
        localStorage.setItem("user", JSON.stringify(user));

        setUserChanged(!userChanged);
        navigate("/chats");
      })
      .catch((error) => {
        setIsError(true);
        setErrorMessage(error.response.data.message);
        setIsLoading(false);
      });
  }

  return (
    <section id="login-section">
      <Header />
      <div className="login-page-container">
        <div className="login-container">
          <form onSubmit={handleLoginFormSubmit} className="login-form">
            <h2 className="login-header">Log in</h2>
            {showToast && <Toast setShowToast={setShowToast} success="yes" successMessage="You Successfully signed up!" />}
            {isError && <ErrorModal setIsError={setIsError} errorMessage={errorMessage} />}
            <label htmlFor="email">
              <input
                className="login-text text-input"
                name="email"
                type="email"
                value={email}
                onChange={handleEmailChange}
                placeholder="Email"
              ></input>
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
      </div>
    </section>
  );
}
