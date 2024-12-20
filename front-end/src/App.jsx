import { Routes, Route } from "react-router-dom";
import Login from "./Components/Login";
import Signup from "./Components/Signup";
import ChatProvider from "./Components/ChatProvider";
import { useContext, useState } from "react";
import { UserContext } from "./Context/UserContext";

function App() {
  const [showToast, setShowToast] = useState(false);
  const { loggedInUser } = useContext(UserContext);

  return (
    <main>
      <Routes>
        <Route
          path="/"
          element={
            loggedInUser ? (
              <ChatProvider showToast={showToast} setShowToast={setShowToast} />
            ) : (
              <Login showToast={showToast} setShowToast={setShowToast} />
            )
          }
        />
        <Route
          path="/signup"
          element={loggedInUser ? <ChatProvider showToast={showToast} setShowToast={setShowToast} /> : <Signup setShowToast={setShowToast} />}
        />
        <Route
          path="/chats"
          element={
            loggedInUser ? (
              <ChatProvider showToast={showToast} setShowToast={setShowToast} />
            ) : (
              <Login showToast={showToast} setShowToast={setShowToast} />
            )
          }
        />
      </Routes>
    </main>
  );
}

export default App;
