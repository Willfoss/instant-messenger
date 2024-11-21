import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user"));

  const [loggedInUser, setLoggedInUser] = useState(user ? user : "");
  const [userChanged, setUserChanged] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    setLoggedInUser(user);
    if (!user) {
      navigate("/");
    }
  }, [userChanged]);

  return <UserContext.Provider value={{ loggedInUser, setLoggedInUser, userChanged, setUserChanged }}>{children}</UserContext.Provider>;
};
