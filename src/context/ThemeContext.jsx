import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const { user, updateUser, loading } = useAuth();
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    if (user) {
      setTheme(user.theme || "light");
    }
  }, [user]);

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  const toggleTheme = async () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    if (user) {
      await updateUser({ theme: newTheme });
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
