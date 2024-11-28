import React from "react";
import "./component-styling/loading.css";

export default function Loading(props) {
  const { skeletons } = props;

  const skeletonArray = [];

  for (let i = 0; i < skeletons; i++) {
    skeletonArray.push(<div key={i} className="loading skeleton"></div>);
  }

  return (
    <section id="loading-container">
      {skeletonArray.map((skeleton) => {
        return skeleton;
      })}
    </section>
  );
}
