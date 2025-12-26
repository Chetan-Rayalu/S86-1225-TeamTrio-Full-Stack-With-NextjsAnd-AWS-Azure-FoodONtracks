import { useAuthContext } from "@/context/AuthContext";

/**
 * Custom hook for authentication
 * Provides a clean interface to access and manage auth state
 */
export function useAuth() {
  const { user, isLoading, login, logout, updateUser } = useAuthContext();

  return {
    // Derived state
    isAuthenticated: !!user,
    isAdmin: user?.role === "admin",
    isRestaurant: user?.role === "restaurant",
    isDelivery: user?.role === "delivery",

    // User data
    user,
    isLoading,

    // Actions
    login,
    logout,
    updateUser,

    // Helper methods
    hasRole: (role: string) => user?.role === role,
    getUserName: () => user?.name || "Guest",
    getUserEmail: () => user?.email || "",
  };
}
