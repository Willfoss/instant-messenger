import { Routes, Route, useNavigate } from "react-router-dom";

import Login from "./Components/Login";
import Signup from "./Components/Signup";
import Header from "./Components/Header";
import Chats from "./Components/ChatPage";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "./Context/UserContext";
import ChatPage from "./Components/ChatPage";

function App() {
  const { loggedInUser } = useContext(UserContext);

  return (
    <main>
      <Routes>
        <Route path="/" element={loggedInUser ? <ChatPage /> : <Login />} />
        <Route path="/signup" element={loggedInUser ? <ChatPage /> : <Signup />} />
        <Route path="/chats" element={<ChatPage />} />
      </Routes>
    </main>
  );
}

export default App;
