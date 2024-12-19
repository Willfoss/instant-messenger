import { Routes, Route } from "react-router-dom";
import Login from "./Components/Login";
import Signup from "./Components/Signup";
import ChatProvider from "./Components/ChatProvider";
import { useState } from "react";

function App() {
  const [showToast, setShowToast] = useState(true);

  return (
    <main>
      <Routes>
        <Route path="/" element={<Login showToast={showToast} setShowToast={setShowToast} />} />
        <Route path="/signup" element={<Signup setShowToast={setShowToast} />} />
        <Route path="/chats" element={<ChatProvider showToast={showToast} setShowToast={setShowToast} />} />
      </Routes>
    </main>
  );
}

export default App;
