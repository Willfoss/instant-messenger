import React from "react";
import "./component-styling/notFoundError.css";

export default function NotFoundError(props) {
  const { errorMessage } = props;
  return (
    <section id="not-found-error-section">
      <div className="not-found-message-container">
        <p className="not-found-text">No users were found that match the requested search</p>
      </div>
    </section>
  );
}
