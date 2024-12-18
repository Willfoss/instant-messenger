import { Routes, Route } from "react-router-dom";
import Login from "./Components/Login";
import Signup from "./Components/Signup";
import ChatProvider from "./Components/ChatProvider";

function App() {
  return (
    <main>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/chats" element={<ChatProvider />} />
      </Routes>
    </main>
  );
}

export default App;
