import { useUIContext } from "@/context/UIContext";

/**
 * Custom hook for UI state management
 * Provides a clean interface to access and manage UI preferences
 */
export function useUI() {
  const {
    theme,
    toggleTheme,
    setTheme,
    sidebarOpen,
    toggleSidebar,
    setSidebarOpen,
    language,
    setLanguage,
    notifications,
    toggleNotifications,
  } = useUIContext();

  return {
    // Theme management
    theme,
    toggleTheme,
    setTheme,
    isDark: theme === "dark",
    isLight: theme === "light",

    // Sidebar management
    sidebarOpen,
    toggleSidebar,
    setSidebarOpen,

    // Language management
    language,
    setLanguage,

    // Notifications
    notifications,
    toggleNotifications,

    // Helper methods
    getThemeClasses: () =>
      theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-gray-900",

    getBorderClasses: () =>
      theme === "dark" ? "border-gray-700" : "border-gray-200",
  };
}
