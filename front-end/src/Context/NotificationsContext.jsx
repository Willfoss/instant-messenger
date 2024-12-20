import { createContext, useState } from "react";

export const NotificationsContext = createContext();

export const NotificationsProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [chats, setChats] = useState();

  return <NotificationsContext.Provider value={{ notifications, setNotifications, chats, setChats }}>{children}</NotificationsContext.Provider>;
};
