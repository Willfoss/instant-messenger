import React, { useState } from "react";
import "./component-styling/signup.css";
import { Link, useNavigate } from "react-router-dom";
import { uploadImageToCloudinary } from "../api";
import Lottie from "lottie-react";
import buttonLoading from "../assets/loading-on-button.json";
import ErrorModal from "./ErrorModal";
import { signUpUser } from "../api";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [file, setFile] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [isNameError, setIsNameError] = useState(false);
  const [isEmailError, setIsEmailError] = useState(false);
  const [isPasswordError, setIsPasswordError] = useState(false);
  const [isConfirmPasswordError, setIsConfirmPasswordError] = useState(false);
  const navigate = useNavigate();

  function handleNameChange(event) {
    setName(event.target.value);
    setIsNameError(false);
  }

  function handleEmailChange(event) {
    setEmail(event.target.value);
    setIsEmailError(false);
  }

  function handlePasswordChange(event) {
    setPassword(event.target.value);
    setIsPasswordError(false);
    if (confirmPassword === event.target.value) setIsConfirmPasswordError(false);
  }

  function handleConfirmPasswordChange(event) {
    setConfirmPassword(event.target.value);
    if (password === event.target.value) setIsConfirmPasswordError(false);
  }

  function handleFileChange(event) {
    setIsLoading(true);
    const image = event.target.files[0];

    const formData = new FormData();
    formData.append("file", image);
    formData.append("upload_preset", "jiffy-chat");
    formData.append("cloud_name", "dubtm2mub");

    uploadImageToCloudinary(formData)
      .then((data) => {
        setFile(data.url.toString());
        setIsLoading(false);
        setIsError(false);
      })
      .catch((error) => {
        setIsLoading(false);
        setIsError(true);
      });
  }

  function handleSignupSubmit(event) {
    event.preventDefault();
    setIsLoading(true);
    //error handler for part of form not being filled out
    if (!name) setIsNameError(true);
    if (!email) setIsEmailError(true);
    if (!password) setIsPasswordError(true);
    if (confirmPassword !== password) setIsConfirmPasswordError(true);

    return signUpUser(name, email, password, file)
      .then((data) => {
        setIsError(false);
        setIsLoading(false);
        navigate("/login");
      })
      .catch((error) => {
        setErrorMessage(error.response.data.message);
        setIsLoading(false);
        setIsError(true);
      });
  }

  return (
    <section id="signup-section">
      <div className="signup-container">
        <form onSubmit={handleSignupSubmit} className="signup-form">
          <h2 className="signup-header">Sign Up for Free</h2>
          {isError && <ErrorModal setIsError={setIsError} errorMessage={errorMessage} />}
          <label className="signup-text" htmlFor="name">
            Name
            <input className="signup-text text-input" name="name" type="text" value={name} onChange={handleNameChange}></input>
            {isNameError && <p className="signup-error-text ">Enter a Name</p>}
          </label>
          <label className="signup-text " htmlFor="email">
            Email Address
            <input className="signup-text text-input" name="email" type="email" value={email} onChange={handleEmailChange}></input>
            {isEmailError && <p className="signup-error-text ">Enter an Email Address</p>}
          </label>
          <label className="signup-text" htmlFor="password">
            Password
            <input className="signup-text text-input" name="password" type="password" value={password} onChange={handlePasswordChange}></input>
            {isPasswordError && <p className="signup-error-text ">Enter a Password</p>}
          </label>
          <label className="signup-text" htmlFor="confirm-password">
            Confirm Password
            <input
              className="signup-text text-input"
              name="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
            ></input>
            {isConfirmPasswordError && <p className="signup-error-text ">Passwords must match</p>}
          </label>
          <label className="signup-text" htmlFor="profile-picture">
            Upload your file
            <input className="image-uploader" type="file" name="profile-picture" accept="image/*" onChange={handleFileChange}></input>
          </label>
          {isLoading === true ? (
            <div className="signup-button-loading">
              <Lottie className="button-loading-animation " animationData={buttonLoading} loop={true} />
            </div>
          ) : (
            <button className="signup-button">Sign up</button>
          )}
          <Link className="link" to="/">
            <p className="to-login"> Already a user? Log in!</p>
          </Link>
        </form>
      </div>
    </section>
  );
}
