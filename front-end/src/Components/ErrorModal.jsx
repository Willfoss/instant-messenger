import React from "react";
import "../Components/component-styling/errorModal.css";

export default function ErrorModal(props) {
  const { setIsError, errorMessage } = props;

  function closeError(event) {
    setIsError(false);
  }

  return (
    <section id="error-section">
      {errorMessage === "No Users Found" ? (
        <div className="not-found-message-container">
          <p className="not-found-text">No users were found that match the requested search</p>
        </div>
      ) : (
        <div className="error-message-container">
          <div className="error-heading">
            <h3>Error!</h3>
            <p className="close-error" onClick={closeError}>
              X
            </p>
          </div>
          <div className="error-body">
            <p className="error-text">{errorMessage ? errorMessage : "Whoops! Looks like something went wrong. Please try again!"}</p>
          </div>
        </div>
      )}
    </section>
  );
}
