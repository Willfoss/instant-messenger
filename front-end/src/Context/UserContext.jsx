import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MessageSquareMore, Search } from "lucide-react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [loggedInUser, setLoggedInUser] = useState();
  const [userChanged, setUserChanged] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    console.log(user);
    setLoggedInUser(user);
    if (!user) {
      navigate("/");
    }
  }, [userChanged]);

  return <UserContext.Provider value={{ loggedInUser, setLoggedInUser, userChanged, setUserChanged }}>{children}</UserContext.Provider>;
};
