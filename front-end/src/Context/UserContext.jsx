import { createContext, useState, useEffect } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const storedUser = localStorage.getItem("user");
  let parsedUser = null;
  if (!storedUser) {
    console.log("test");
    parsedUser = JSON.parse(storedUser);
  }
  const [loggedInUser, setLoggedInUser] = useState(parsedUser);

  useEffect(() => {
    console.log(loggedInUser);
    localStorage.setItem("user", JSON.stringify(loggedInUser));
  }, [loggedInUser]);

  return <UserContext.Provider value={{ loggedInUser, setLoggedInUser }}>{children}</UserContext.Provider>;
};
