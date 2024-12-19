import React from "react";
import "./component-styling/toast.css";

export default function Toast(props) {
  const { success, error, successMessage, errorMessage, setShowToast } = props;

  function handleToastCloseClick() {
    setShowToast(false);
  }

  setTimeout(() => {
    setShowToast(false);
  }, 10000);

  return (
    <section id="toast" className={error && "toast"}>
      <div className={`toast-container ${success ? "success-colour" : "error-colour"}`}>
        <div className="toast-heading">
          <h3>{success ? "Success!" : "Error!"}</h3>
          <p className="close-toast" onClick={handleToastCloseClick}>
            X
          </p>
        </div>
        <div className="toast-body">
          <p className="toast-text">{success ? successMessage : errorMessage}</p>
        </div>
      </div>
    </section>
  );
}
