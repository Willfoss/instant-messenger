import React from "react";
import "../Components/component-styling/errorModal.css";

export default function ErrorModal(props) {
  const { setIsError } = props;

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
          <p className="error-text">Whoops! Looks like something went wrong. Please try again!</p>
          <button className="close-error-button" onClick={closeError}>
            Try again
          </button>
        </div>
      </div>
    </section>
  );
}
