import React from "react";
import { MessageSquareMore } from "lucide-react";
import "./component-styling/header.css";

export default function Header() {
  return (
    <section id="header">
      <MessageSquareMore className="logo"></MessageSquareMore>
      <h1 className="logo-heading">Jiffy</h1>
    </section>
  );
}
