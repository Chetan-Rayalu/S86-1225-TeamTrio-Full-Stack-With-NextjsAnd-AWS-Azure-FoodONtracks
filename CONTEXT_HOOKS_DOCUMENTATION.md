# 🎯 Context & Custom Hooks Implementation

## FoodONtracks - Global State Management System

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Why Context and Hooks?](#why-context-and-hooks)
3. [Architecture](#architecture)
4. [Implementation Details](#implementation-details)
5. [Usage Examples](#usage-examples)
6. [Performance Strategies](#performance-strategies)
7. [Testing & Debugging](#testing--debugging)
8. [Reflection](#reflection)

---

## 🎯 Overview

This project implements a comprehensive global state management system using React Context API and custom hooks. The system manages authentication state and UI preferences across the entire FoodONtracks application, providing a clean, scalable, and type-safe solution for sharing state between components.

### Key Features

- ✅ **Authentication Management** - User login, logout, and role-based access
- 🎨 **Theme System** - Dark/Light mode with persistence
- 🌐 **Multi-language Support** - Language preferences management
- 📖 **UI State Management** - Sidebar, notifications, and more
- 💾 **Local Storage Persistence** - State survives page refreshes
- 🔒 **Type Safety** - Full TypeScript support
- ♻️ **Reusable Logic** - Custom hooks for clean component code

---

## 🤔 Why Context and Hooks?

### The Problem

In React applications, passing data through multiple component layers (prop drilling) becomes cumbersome:

```tsx
// Without Context - Prop Drilling ❌
<App user={user}>
  <Dashboard user={user}>
    <Sidebar user={user}>
      <UserProfile user={user} />
    </Sidebar>
  </Dashboard>
</App>
```

### The Solution

| Concept | Purpose | Example |
|---------|---------|---------|
| **Context** | Provides a way to pass data through the component tree without props | Share logged-in user data across all pages |
| **Custom Hook** | Encapsulates reusable logic for cleaner components | `useAuth()` handles login, logout, and state access |
| **Provider Pattern** | Wraps the app to make data available globally | `<AuthProvider>` makes auth state accessible everywhere |

### Benefits

✅ **Eliminates Prop Drilling** - No need to pass props through intermediate components  
✅ **Centralized State** - Single source of truth for global data  
✅ **Reusable Logic** - Custom hooks abstract complex state management  
✅ **Type Safety** - TypeScript ensures correct usage  
✅ **Separation of Concerns** - Logic separated from UI components  

---

## 🏗️ Architecture

### Folder Structure

```
foodontracks/src/
├── context/
│   ├── AuthContext.tsx      # Authentication state management
│   └── UIContext.tsx         # UI preferences management
├── hooks/
│   ├── useAuth.ts            # Custom hook for authentication
│   └── useUI.ts              # Custom hook for UI state
├── app/
│   ├── layout.tsx            # Root layout with providers
│   ├── context-demo/         # Demo page
│   │   └── page.tsx
│   └── ...
```

### Component Hierarchy

```
RootLayout
  └── AuthProvider (Provides authentication state)
      └── UIProvider (Provides UI preferences)
          └── Application Components
              └── Can access both contexts via hooks
```

### Data Flow Diagram

```
┌─────────────────────────────────────────────────┐
│           Root Layout (layout.tsx)              │
│  ┌───────────────────────────────────────────┐  │
│  │         AuthProvider                      │  │
│  │  ┌─────────────────────────────────────┐  │  │
│  │  │       UIProvider                    │  │  │
│  │  │  ┌───────────────────────────────┐  │  │  │
│  │  │  │    Application Components     │  │  │  │
│  │  │  │                               │  │  │  │
│  │  │  │  useAuth() ──────────────┐    │  │  │  │
│  │  │  │  useUI() ──────────────┐ │    │  │  │  │
│  │  │  │                        ↓ ↓    │  │  │  │
│  │  │  │  Access global state anywhere │  │  │  │
│  │  │  └───────────────────────────────┘  │  │  │
│  │  └─────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────┘  │
└─────────────────────────────────────────────────┘
```

---

## 🔧 Implementation Details

### 1. AuthContext (`context/AuthContext.tsx`)

**Purpose**: Manages user authentication state globally.

**Key Features**:
- User login/logout functionality
- Role-based access control
- LocalStorage persistence
- Loading state management

**State Structure**:
```typescript
interface User {
  id: string;
  name: string;
  email: string;
  role: string; // 'user' | 'admin' | 'restaurant' | 'delivery'
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (username: string, email: string, role?: string) => void;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}
```

**Implementation Highlights**:

```typescript
// Persist to localStorage
const login = (username: string, email: string, role: string = "user") => {
  const newUser: User = { id: Date.now().toString(), name: username, email, role };
  setUser(newUser);
  localStorage.setItem("authUser", JSON.stringify(newUser));
  console.log("✅ User logged in:", username, "| Role:", role);
};

// Load from localStorage on mount
useEffect(() => {
  const storedUser = localStorage.getItem("authUser");
  if (storedUser) {
    setUser(JSON.parse(storedUser));
  }
  setIsLoading(false);
}, []);
```

---

### 2. UIContext (`context/UIContext.tsx`)

**Purpose**: Manages UI preferences and state globally.

**Key Features**:
- Theme switching (light/dark)
- Sidebar open/closed state
- Language preferences
- Notification settings
- LocalStorage persistence

**State Structure**:
```typescript
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
```

**Implementation Highlights**:

```typescript
// Theme switching with DOM manipulation
const toggleTheme = () => {
  setThemeState((prev) => {
    const newTheme = prev === "light" ? "dark" : "light";
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
    console.log("🎨 Theme toggled to:", newTheme);
    return newTheme;
  });
};
```

---

### 3. Custom Hooks

#### `useAuth()` Hook (`hooks/useAuth.ts`)

**Purpose**: Provides a clean interface for authentication operations.

**Features**:
- Derived state (isAuthenticated, isAdmin, etc.)
- Helper methods for role checking
- Clean API for components

```typescript
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
```

**Benefits**:
- ✅ Components don't need to know about context internals
- ✅ Provides computed values (isAuthenticated, isAdmin)
- ✅ Single import for all auth functionality

---

#### `useUI()` Hook (`hooks/useUI.ts`)

**Purpose**: Simplifies UI state access and manipulation.

**Features**:
- Theme management
- Sidebar control
- Language switching
- Helper methods for styling

```typescript
export function useUI() {
  const {
    theme, toggleTheme, setTheme,
    sidebarOpen, toggleSidebar, setSidebarOpen,
    language, setLanguage,
    notifications, toggleNotifications,
  } = useUIContext();

  return {
    theme, toggleTheme, setTheme,
    isDark: theme === "dark",
    isLight: theme === "light",
    
    sidebarOpen, toggleSidebar, setSidebarOpen,
    language, setLanguage,
    notifications, toggleNotifications,
    
    // Helper methods
    getThemeClasses: () => 
      theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-gray-900",
    getBorderClasses: () => 
      theme === "dark" ? "border-gray-700" : "border-gray-200",
  };
}
```

**Benefits**:
- ✅ Provides derived state (isDark, isLight)
- ✅ Helper methods for common styling patterns
- ✅ Clean, predictable API

---

### 4. Root Layout Integration (`app/layout.tsx`)

**Purpose**: Wraps the entire application with providers.

```typescript
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50">
        <AuthProvider>
          <UIProvider>
            <LayoutWrapper>{children}</LayoutWrapper>
          </UIProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
```

**Key Points**:
- ✅ Providers wrap all application components
- ✅ Order matters - AuthProvider first, then UIProvider
- ✅ All child components can now access both contexts

---

## 📚 Usage Examples

### Example 1: Authentication in Components

```tsx
"use client";
import { useAuth } from "@/hooks/useAuth";

export default function DashboardPage() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();

  if (!isAuthenticated) {
    return <div>Please login to continue</div>;
  }

  return (
    <div>
      <h1>Welcome, {user?.name}!</h1>
      {isAdmin && <AdminPanel />}
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### Example 2: Theme Switching

```tsx
"use client";
import { useUI } from "@/hooks/useUI";

export default function Header() {
  const { theme, toggleTheme, isDark } = useUI();

  return (
    <header className={isDark ? "bg-gray-900" : "bg-white"}>
      <h1>FoodONtracks</h1>
      <button onClick={toggleTheme}>
        {isDark ? "☀️ Light Mode" : "🌙 Dark Mode"}
      </button>
    </header>
  );
}
```

### Example 3: Protected Routes

```tsx
"use client";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminPage() {
  const { isAdmin, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAdmin) {
      router.push("/");
    }
  }, [isAdmin, isLoading, router]);

  if (isLoading) return <div>Loading...</div>;
  if (!isAdmin) return null;

  return <div>Admin Dashboard</div>;
}
```

---

## ⚡ Performance Strategies

### 1. Prevent Unnecessary Re-renders

**Problem**: Context consumers re-render when any context value changes.

**Solution**: Split contexts by concern

```tsx
// ✅ Good - Separate contexts
<AuthProvider>
  <UIProvider>
    {children}
  </UIProvider>
</AuthProvider>

// ❌ Bad - Single context with all state
<GlobalProvider value={{ user, theme, language, ... }}>
  {children}
</GlobalProvider>
```

### 2. Memoization

Use `React.memo()` for components that consume context:

```tsx
import { memo } from "react";

const UserProfile = memo(({ user }) => {
  return <div>{user.name}</div>;
});
```

### 3. Selective Context Usage

Only subscribe to the parts of context you need:

```tsx
// ✅ Good - Only use what you need
const { theme, toggleTheme } = useUI();

// ❌ Bad - Subscribe to entire context
const uiState = useUIContext();
```

### 4. LocalStorage Optimization

Debounce localStorage writes for frequently updated values:

```typescript
import { debounce } from "lodash";

const saveToStorage = debounce((key: string, value: any) => {
  localStorage.setItem(key, JSON.stringify(value));
}, 500);
```

### 5. useReducer for Complex State

For complex state transitions, consider `useReducer`:

```typescript
type Action = 
  | { type: "LOGIN"; payload: User }
  | { type: "LOGOUT" }
  | { type: "UPDATE_USER"; payload: Partial<User> };

function authReducer(state: AuthState, action: Action): AuthState {
  switch (action.type) {
    case "LOGIN":
      return { ...state, user: action.payload, isAuthenticated: true };
    case "LOGOUT":
      return { ...state, user: null, isAuthenticated: false };
    case "UPDATE_USER":
      return { ...state, user: { ...state.user, ...action.payload } };
    default:
      return state;
  }
}
```

---

## 🧪 Testing & Debugging

### 1. React DevTools

**Steps**:
1. Open React DevTools in browser
2. Click "Components" tab
3. Find `AuthProvider` or `UIProvider`
4. Inspect current context values in real-time

### 2. Console Logging

All state changes log to console:

```
✅ User logged in: KalviumUser | Role: admin
🎨 Theme toggled to: dark
📖 Sidebar opened
🌐 Language changed to: es
```

### 3. Testing Context in Isolation

```tsx
import { renderHook, act } from "@testing-library/react";
import { useAuth } from "@/hooks/useAuth";
import { AuthProvider } from "@/context/AuthContext";

test("should login user", () => {
  const wrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>;
  const { result } = renderHook(() => useAuth(), { wrapper });

  act(() => {
    result.current.login("TestUser", "test@example.com", "user");
  });

  expect(result.current.isAuthenticated).toBe(true);
  expect(result.current.user?.name).toBe("TestUser");
});
```

---

## 🎓 Reflection

### What Worked Well

✅ **Separation of Concerns**  
By splitting authentication and UI state into separate contexts, we achieved better performance and maintainability. Components only re-render when their specific context changes.

✅ **Custom Hooks Abstraction**  
The `useAuth()` and `useUI()` hooks provide a clean, intuitive API. Components don't need to know about context internals, making them easier to test and maintain.

✅ **Type Safety**  
TypeScript interfaces ensure correct usage throughout the application, catching errors at compile time rather than runtime.

✅ **Persistence Strategy**  
LocalStorage integration allows user preferences to survive page refreshes, creating a seamless user experience.

### Challenges Encountered

⚠️ **SSR Considerations**  
Next.js server-side rendering required careful use of `"use client"` directives. Context providers and hooks must be client-side only.

**Solution**: Marked all context files and hook consumers with `"use client"`.

⚠️ **localStorage Access Timing**  
Accessing localStorage during SSR caused hydration errors.

**Solution**: Used `useEffect` to read from localStorage only on client mount:

```typescript
useEffect(() => {
  const storedUser = localStorage.getItem("authUser");
  if (storedUser) setUser(JSON.parse(storedUser));
  setIsLoading(false);
}, []);
```

⚠️ **Performance with Many Consumers**  
Multiple components consuming context caused unnecessary re-renders.

**Solution**: 
- Split contexts by domain (Auth vs UI)
- Used `React.memo()` for expensive components
- Provided derived state in custom hooks

### Scalability Considerations

🚀 **Adding New Contexts**  
The pattern is easily extensible. To add a new context:
1. Create `context/NewContext.tsx`
2. Create `hooks/useNew.ts`
3. Add `<NewProvider>` to layout.tsx

🚀 **Performance at Scale**  
For applications with many context consumers:
- Consider state management libraries (Zustand, Jotai)
- Implement context selectors
- Use memoization strategically

🚀 **Testing Strategy**  
Custom hooks make testing straightforward:
- Test hooks in isolation
- Mock context providers in component tests
- Use React Testing Library for integration tests

### Lessons Learned

💡 **Context vs Props**  
Use context for truly global state (auth, theme). Use props for component-specific data.

💡 **Custom Hooks are Powerful**  
They abstract complexity, making components declarative and easy to understand.

💡 **Developer Experience Matters**  
Console logging state changes during development significantly improved debugging speed.

💡 **Type Safety is Essential**  
TypeScript caught numerous potential runtime errors, especially around optional user properties.

---

## 🎯 Key Takeaways

| Concept | Learning |
|---------|----------|
| **Context API** | Perfect for global state that many components need |
| **Custom Hooks** | Encapsulate logic, keep components clean |
| **Performance** | Split contexts, memoize, use selectors |
| **Persistence** | LocalStorage for user preferences |
| **Type Safety** | TypeScript prevents runtime errors |
| **Developer Experience** | Logging and DevTools are essential |

---

## 📸 Evidence of Implementation

### Console Output Examples

```
✅ User logged in: JohnDoe | Role: admin
🎨 Theme toggled to: dark
📖 Sidebar opened
🌐 Language changed to: es
🔔 Notifications enabled
🚪 User logged out
```

### State Flow Example

```
Initial State:
  user: null
  theme: "light"
  sidebarOpen: false

After Login:
  user: { id: "123", name: "JohnDoe", email: "john@example.com", role: "admin" }
  theme: "light"
  sidebarOpen: false

After Theme Toggle:
  user: { id: "123", name: "JohnDoe", email: "john@example.com", role: "admin" }
  theme: "dark"  ← Changed
  sidebarOpen: false

After Sidebar Toggle:
  user: { id: "123", name: "JohnDoe", email: "john@example.com", role: "admin" }
  theme: "dark"
  sidebarOpen: true  ← Changed
```

---

## 🚀 Try It Out

Visit the demo page at `/context-demo` to see the implementation in action!

**Features to Test**:
- ✅ Login with different roles (user, admin, restaurant, delivery)
- 🎨 Toggle between light and dark themes
- 📖 Open/close the sidebar
- 🌐 Change language preferences
- 🔔 Toggle notifications
- 🔄 Refresh the page - preferences persist!

---

## 📚 Additional Resources

- [React Context API Documentation](https://react.dev/reference/react/createContext)
- [React Hooks Documentation](https://react.dev/reference/react)
- [Next.js App Router](https://nextjs.org/docs/app)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

**Built with ❤️ for Kalvium - FoodONtracks Project**
