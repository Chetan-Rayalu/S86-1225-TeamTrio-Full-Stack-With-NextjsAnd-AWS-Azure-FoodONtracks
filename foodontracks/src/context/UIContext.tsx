"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

type Theme = "light" | "dark";
type Language = "en" | "es" | "fr";

interface UIContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  notifications: boolean;
  toggleNotifications: () => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export function UIProvider({ children }: { children: ReactNode }) {
  // Load preferences from localStorage using lazy initialization
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window === "undefined") return "light";
    return (localStorage.getItem("theme") as Theme) || "light";
  });

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [language, setLanguage] = useState<Language>(() => {
    if (typeof window === "undefined") return "en";
    return (localStorage.getItem("language") as Language) || "en";
  });

  const [notifications, setNotifications] = useState(() => {
    if (typeof window === "undefined") return true;
    const stored = localStorage.getItem("notifications");
    return stored === null ? true : stored === "true";
  });

  // Apply theme to document on mount
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const toggleTheme = () => {
    setThemeState((prev) => {
      const newTheme = prev === "light" ? "dark" : "light";
      localStorage.setItem("theme", newTheme);
      document.documentElement.classList.toggle("dark", newTheme === "dark");
      console.log("🎨 Theme toggled to:", newTheme);
      return newTheme;
    });
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
    console.log("🎨 Theme set to:", newTheme);
  };

  const toggleSidebar = () => {
    setSidebarOpen((prev) => {
      console.log(prev ? "📕 Sidebar closed" : "📖 Sidebar opened");
      return !prev;
    });
  };

  const setLanguageHandler = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem("language", lang);
    console.log("🌐 Language changed to:", lang);
  };

  const toggleNotifications = () => {
    setNotifications((prev) => {
      const newValue = !prev;
      localStorage.setItem("notifications", newValue.toString());
      console.log(
        newValue ? "🔔 Notifications enabled" : "🔕 Notifications disabled"
      );
      return newValue;
    });
  };

  return (
    <UIContext.Provider
      value={{
        theme,
        toggleTheme,
        setTheme,
        sidebarOpen,
        toggleSidebar,
        setSidebarOpen,
        language,
        setLanguage: setLanguageHandler,
        notifications,
        toggleNotifications,
      }}
    >
      {children}
    </UIContext.Provider>
  );
}

export function useUIContext() {
  const context = useContext(UIContext);
  if (!context) {
    throw new Error("useUIContext must be used within a UIProvider");
  }
  return context;
}
