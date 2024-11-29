import React from "react";
import "../Components/component-styling/errorModal.css";

export default function ErrorModal(props) {
  const { setIsError, errorMessage } = props;

  function closeError(event) {
    setIsError(false);
  }

  return (
    <section id="error-section">
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
    </section>
  );
}
