import { Routes, Route } from "react-router-dom";

import Login from "./Components/Login";
import Signup from "./Components/Signup";

function App() {
  return (
    <main>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="signup" element={<Signup />} />
      </Routes>
    </main>
  );
}

export default App;
