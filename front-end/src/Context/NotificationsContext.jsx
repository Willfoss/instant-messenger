import { createContext, useState } from "react";

export const NotificationsContext = createContext();

export const NotificationsProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  return <NotificationsContext.Provider value={{ notifications, setNotifications }}>{children}</NotificationsContext.Provider>;
};
