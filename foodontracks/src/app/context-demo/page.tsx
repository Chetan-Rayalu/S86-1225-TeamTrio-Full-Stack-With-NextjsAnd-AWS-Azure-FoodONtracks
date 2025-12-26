"use client";

import { useAuth } from "@/hooks/useAuth";
import { useUI } from "@/hooks/useUI";
import { useState } from "react";

export default function ContextDemo() {
  const { user, login, logout, isAuthenticated, isAdmin, getUserName } =
    useAuth();

  const {
    theme,
    toggleTheme,
    sidebarOpen,
    toggleSidebar,
    language,
    setLanguage,
    notifications,
    toggleNotifications,
    isDark,
  } = useUI();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("user");

  const handleLogin = () => {
    if (username && email) {
      login(username, email, role);
      setUsername("");
      setEmail("");
    }
  };

  return (
    <main
      className={`min-h-screen p-8 transition-colors duration-300 ${
        isDark
          ? "bg-gray-900 text-white"
          : "bg-gradient-to-br from-blue-50 to-indigo-100 text-gray-900"
      }`}
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            🎯 Context & Hooks Demo
          </h1>
          <p
            className={`text-lg ${isDark ? "text-gray-400" : "text-gray-600"}`}
          >
            FoodONtracks - Global State Management
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Authentication Section */}
          <section
            className={`p-6 rounded-xl shadow-lg ${
              isDark ? "bg-gray-800 border border-gray-700" : "bg-white"
            }`}
          >
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              🔐 Authentication State
            </h2>

            {isAuthenticated ? (
              <div className="space-y-4">
                <div
                  className={`p-4 rounded-lg ${
                    isDark ? "bg-gray-700" : "bg-green-50"
                  }`}
                >
                  <p className="font-medium text-green-600 dark:text-green-400 mb-2">
                    ✅ Logged in as:{" "}
                    <span className="font-bold">{user?.name}</span>
                  </p>
                  <p
                    className={`text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}
                  >
                    Email: {user?.email}
                  </p>
                  <p
                    className={`text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}
                  >
                    Role:{" "}
                    <span className="font-semibold capitalize">
                      {user?.role}
                    </span>
                  </p>
                  {isAdmin && (
                    <p className="text-sm text-purple-600 dark:text-purple-400 mt-2 font-medium">
                      👑 Admin privileges active
                    </p>
                  )}
                </div>

                <button
                  onClick={logout}
                  className="w-full bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  🚪 Logout
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className={`w-full px-4 py-2 rounded-lg border ${
                      isDark
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-gray-50 border-gray-300"
                    } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full px-4 py-2 rounded-lg border ${
                      isDark
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-gray-50 border-gray-300"
                    } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className={`w-full px-4 py-2 rounded-lg border ${
                      isDark
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-gray-50 border-gray-300"
                    } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                    <option value="restaurant">Restaurant</option>
                    <option value="delivery">Delivery Person</option>
                  </select>
                </div>

                <button
                  onClick={handleLogin}
                  className="w-full bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!username || !email}
                >
                  ✅ Login
                </button>
              </div>
            )}
          </section>

          {/* UI Controls Section */}
          <section
            className={`p-6 rounded-xl shadow-lg ${
              isDark ? "bg-gray-800 border border-gray-700" : "bg-white"
            }`}
          >
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              🎨 UI Controls
            </h2>

            <div className="space-y-4">
              {/* Theme Toggle */}
              <div
                className={`p-4 rounded-lg ${
                  isDark ? "bg-gray-700" : "bg-gray-50"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">Current Theme:</span>
                  <span className="px-3 py-1 rounded-full bg-blue-500 text-white text-sm">
                    {theme === "dark" ? "🌙 Dark" : "☀️ Light"}
                  </span>
                </div>
                <button
                  onClick={toggleTheme}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  🎨 Toggle Theme
                </button>
              </div>

              {/* Sidebar Toggle */}
              <div
                className={`p-4 rounded-lg ${
                  isDark ? "bg-gray-700" : "bg-gray-50"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">Sidebar:</span>
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      sidebarOpen
                        ? "bg-green-500 text-white"
                        : "bg-gray-400 text-white"
                    }`}
                  >
                    {sidebarOpen ? "📖 Open" : "📕 Closed"}
                  </span>
                </div>
                <button
                  onClick={toggleSidebar}
                  className="w-full bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  {sidebarOpen ? "📕 Close Sidebar" : "📖 Open Sidebar"}
                </button>
              </div>

              {/* Language Selector */}
              <div
                className={`p-4 rounded-lg ${
                  isDark ? "bg-gray-700" : "bg-gray-50"
                }`}
              >
                <label className="font-medium block mb-2">🌐 Language:</label>
                <select
                  value={language}
                  onChange={(e) =>
                    setLanguage(e.target.value as "en" | "es" | "fr")
                  }
                  className={`w-full px-4 py-2 rounded-lg border ${
                    isDark
                      ? "bg-gray-600 border-gray-500 text-white"
                      : "bg-white border-gray-300"
                  } focus:outline-none focus:ring-2 focus:ring-purple-500`}
                >
                  <option value="en">🇺🇸 English</option>
                  <option value="es">🇪🇸 Spanish</option>
                  <option value="fr">🇫🇷 French</option>
                </select>
              </div>

              {/* Notifications Toggle */}
              <div
                className={`p-4 rounded-lg ${
                  isDark ? "bg-gray-700" : "bg-gray-50"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">Notifications:</span>
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      notifications
                        ? "bg-green-500 text-white"
                        : "bg-red-500 text-white"
                    }`}
                  >
                    {notifications ? "🔔 On" : "🔕 Off"}
                  </span>
                </div>
                <button
                  onClick={toggleNotifications}
                  className={`w-full px-4 py-2 rounded-lg font-medium transition-colors ${
                    notifications
                      ? "bg-red-500 hover:bg-red-600 text-white"
                      : "bg-green-500 hover:bg-green-600 text-white"
                  }`}
                >
                  {notifications ? "🔕 Disable" : "🔔 Enable"} Notifications
                </button>
              </div>
            </div>
          </section>
        </div>

        {/* State Summary */}
        <section
          className={`mt-6 p-6 rounded-xl shadow-lg ${
            isDark ? "bg-gray-800 border border-gray-700" : "bg-white"
          }`}
        >
          <h2 className="text-2xl font-semibold mb-4">
            📊 Current State Summary
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div
              className={`p-4 rounded-lg text-center ${
                isDark ? "bg-gray-700" : "bg-blue-50"
              }`}
            >
              <p className="text-sm text-gray-500 dark:text-gray-400">User</p>
              <p className="font-bold text-lg">{getUserName()}</p>
            </div>
            <div
              className={`p-4 rounded-lg text-center ${
                isDark ? "bg-gray-700" : "bg-purple-50"
              }`}
            >
              <p className="text-sm text-gray-500 dark:text-gray-400">Theme</p>
              <p className="font-bold text-lg capitalize">{theme}</p>
            </div>
            <div
              className={`p-4 rounded-lg text-center ${
                isDark ? "bg-gray-700" : "bg-green-50"
              }`}
            >
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Language
              </p>
              <p className="font-bold text-lg uppercase">{language}</p>
            </div>
            <div
              className={`p-4 rounded-lg text-center ${
                isDark ? "bg-gray-700" : "bg-yellow-50"
              }`}
            >
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Sidebar
              </p>
              <p className="font-bold text-lg">
                {sidebarOpen ? "Open" : "Closed"}
              </p>
            </div>
          </div>
        </section>

        {/* Instructions */}
        <section
          className={`mt-6 p-6 rounded-xl shadow-lg ${
            isDark ? "bg-gray-800 border border-gray-700" : "bg-white"
          }`}
        >
          <h2 className="text-xl font-semibold mb-3">💡 Instructions</h2>
          <ul
            className={`space-y-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}
          >
            <li>
              ✅ Try logging in with different roles (user, admin, restaurant,
              delivery)
            </li>
            <li>🎨 Toggle the theme and see the entire page change</li>
            <li>📖 Open/close the sidebar to see state management in action</li>
            <li>
              🌐 Change the language preference (persisted in localStorage)
            </li>
            <li>🔔 Toggle notifications on/off</li>
            <li>🔍 Open browser console to see state change logs</li>
            <li>🔄 Refresh the page - your preferences persist!</li>
          </ul>
        </section>
      </div>
    </main>
  );
}
