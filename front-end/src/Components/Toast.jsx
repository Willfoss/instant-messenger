import React from "react";
import "./component-styling/toast.css";

export default function Toast(props) {
  const { successStatic, success, error, successMessage, errorMessage, setShowToast } = props;

  function handleToastCloseClick() {
    setShowToast(false);
  }

  setTimeout(() => {
    setShowToast(false);
  }, 12000);

  return (
    <section id="toast" className={(success || error) && "toast"}>
      <div className={`toast-container ${success || successStatic ? "success-colour" : "error-colour"}`}>
        <div className="toast-heading">
          <h3>{success || successStatic ? "Success!" : "Error!"}</h3>
          <p className="close-toast" onClick={handleToastCloseClick}>
            X
          </p>
        </div>
        <div className="toast-body">
          <p className="toast-text">
            {success || successStatic ? successMessage : !errorMessage ? "Whoops looks like something went wrong! Please try again." : errorMessage}
          </p>
        </div>
      </div>
    </section>
  );
}
