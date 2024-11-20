import React, { useContext, useState } from "react";
import { MessageSquareMore, Search } from "lucide-react";
import "./component-styling/header.css";
import { UserContext } from "../Context/UserContext";

export default function Header() {
  return (
    <section id="header">
      <MessageSquareMore className="logo"></MessageSquareMore>
      <h1 className="logo-heading">Jiffy</h1>
    </section>
  );
}
