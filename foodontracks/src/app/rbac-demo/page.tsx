/**
 * RBAC Demo Component
 *
 * Demonstrates role-based access control in the UI.
 * Shows how to conditionally render components based on user permissions.
 */

"use client";

import {
  usePermissions,
  RequirePermission,
  RequireRole,
  AdminOnly,
} from "@/hooks/usePermissions";
import { useAuth } from "@/hooks/useAuth";

export default function RbacDemoPage() {
  const { user } = useAuth();
  const { can, isAdmin, isRestaurantOwner, isCustomer, role } =
    usePermissions();

  if (!user) {
    return (
      <div className="container mx-auto p-8">
        <h1 className="text-3xl font-bold mb-6">RBAC Demo</h1>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800">
            Please log in to see role-based access control in action.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">
        Role-Based Access Control Demo
      </h1>

      {/* User Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Current User</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Name</p>
            <p className="font-medium">{user.name}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Email</p>
            <p className="font-medium">{user.email}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Role</p>
            <p className="font-medium">{role}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">User ID</p>
            <p className="font-medium">
              {("userId" in user ? user.userId : user.id) as number}
            </p>
          </div>
        </div>
      </div>

      {/* Role Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div
          className={`border rounded-lg p-4 ${isAdmin ? "bg-purple-50 border-purple-200" : "bg-gray-50 border-gray-200"}`}
        >
          <h3 className="font-semibold mb-2">Admin</h3>
          <p className="text-sm">
            {isAdmin ? "✅ You are an admin" : "❌ Not an admin"}
          </p>
        </div>
        <div
          className={`border rounded-lg p-4 ${isRestaurantOwner ? "bg-green-50 border-green-200" : "bg-gray-50 border-gray-200"}`}
        >
          <h3 className="font-semibold mb-2">Restaurant Owner</h3>
          <p className="text-sm">
            {isRestaurantOwner
              ? "✅ You are a restaurant owner"
              : "❌ Not a restaurant owner"}
          </p>
        </div>
        <div
          className={`border rounded-lg p-4 ${isCustomer ? "bg-blue-50 border-blue-200" : "bg-gray-50 border-gray-200"}`}
        >
          <h3 className="font-semibold mb-2">Customer</h3>
          <p className="text-sm">
            {isCustomer ? "✅ You are a customer" : "❌ Not a customer"}
          </p>
        </div>
      </div>

      {/* User Management Permissions */}
      <div className="bg-white border rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">User Management Actions</h2>
        <div className="space-y-2">
          <PermissionRow
            label="View Users"
            allowed={can("read", "users")}
            action={() => alert("Fetching users...")}
          />
          <PermissionRow
            label="Create Users"
            allowed={can("create", "users")}
            action={() => alert("Creating user...")}
          />
          <PermissionRow
            label="Update Users"
            allowed={can("update", "users")}
            action={() => alert("Updating user...")}
          />
          <PermissionRow
            label="Delete Users"
            allowed={can("delete", "users")}
            action={() => alert("Deleting user...")}
          />
        </div>
      </div>

      {/* Restaurant Management Permissions */}
      <div className="bg-white border rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">
          Restaurant Management Actions
        </h2>
        <div className="space-y-2">
          <PermissionRow
            label="View Restaurants"
            allowed={can("read", "restaurants")}
            action={() => alert("Fetching restaurants...")}
          />
          <PermissionRow
            label="Create Restaurants"
            allowed={can("create", "restaurants")}
            action={() => alert("Creating restaurant...")}
          />
          <PermissionRow
            label="Update Restaurants"
            allowed={can("update", "restaurants")}
            action={() => alert("Updating restaurant...")}
          />
          <PermissionRow
            label="Delete Restaurants"
            allowed={can("delete", "restaurants")}
            action={() => alert("Deleting restaurant...")}
          />
        </div>
      </div>

      {/* Order Management Permissions */}
      <div className="bg-white border rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Order Management Actions</h2>
        <div className="space-y-2">
          <PermissionRow
            label="View Orders"
            allowed={can("read", "orders")}
            action={() => alert("Fetching orders...")}
          />
          <PermissionRow
            label="Create Orders"
            allowed={can("create", "orders")}
            action={() => alert("Creating order...")}
          />
          <PermissionRow
            label="Update Orders"
            allowed={can("update", "orders")}
            action={() => alert("Updating order...")}
          />
          <PermissionRow
            label="Delete Orders"
            allowed={can("delete", "orders")}
            action={() => alert("Deleting order...")}
          />
        </div>
      </div>

      {/* Admin-Only Section */}
      <AdminOnly
        fallback={
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold mb-2 text-red-800">
              Admin Panel
            </h2>
            <p className="text-red-600">
              ❌ Access Denied - Admin privileges required
            </p>
          </div>
        }
      >
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-purple-800">
            Admin Panel
          </h2>
          <p className="mb-4 text-purple-600">
            ✅ You have access to the admin panel
          </p>
          <div className="space-y-2">
            <button className="w-full bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">
              View System Settings
            </button>
            <button className="w-full bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">
              Manage All Users
            </button>
            <button className="w-full bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">
              View RBAC Logs
            </button>
          </div>
        </div>
      </AdminOnly>

      {/* Role-Specific Components */}
      <RequireRole
        role="RESTAURANT_OWNER"
        fallback={
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold mb-2">Restaurant Dashboard</h2>
            <p className="text-gray-600">❌ Restaurant owner access required</p>
          </div>
        }
      >
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-green-800">
            Restaurant Dashboard
          </h2>
          <p className="mb-4 text-green-600">
            ✅ You can manage your restaurant
          </p>
          <div className="space-y-2">
            <button className="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
              Manage Menu Items
            </button>
            <button className="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
              View Orders
            </button>
            <button className="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
              Update Restaurant Info
            </button>
          </div>
        </div>
      </RequireRole>

      {/* Permission-Based Button */}
      <div className="bg-white border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Conditional UI Elements</h2>
        <div className="space-y-4">
          <RequirePermission
            permission="delete"
            resource="users"
            fallback={
              <button
                disabled
                className="bg-gray-300 text-gray-500 px-4 py-2 rounded cursor-not-allowed"
              >
                Delete User (No Permission)
              </button>
            }
          >
            <button className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
              Delete User (Permission Granted)
            </button>
          </RequirePermission>

          <RequirePermission
            permission="create"
            resource="menuItems"
            fallback={
              <button
                disabled
                className="bg-gray-300 text-gray-500 px-4 py-2 rounded cursor-not-allowed"
              >
                Add Menu Item (No Permission)
              </button>
            }
          >
            <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
              Add Menu Item (Permission Granted)
            </button>
          </RequirePermission>
        </div>
      </div>
    </div>
  );
}

/**
 * Helper component to display permission status
 */
function PermissionRow({
  label,
  allowed,
  action,
}: {
  label: string;
  allowed: boolean;
  action: () => void;
}) {
  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
      <div className="flex items-center gap-3">
        <span
          className={`text-xl ${allowed ? "text-green-500" : "text-red-500"}`}
        >
          {allowed ? "✅" : "❌"}
        </span>
        <span className="font-medium">{label}</span>
      </div>
      {allowed ? (
        <button
          onClick={action}
          className="bg-blue-600 text-white px-4 py-1 rounded text-sm hover:bg-blue-700"
        >
          Execute
        </button>
      ) : (
        <span className="text-sm text-gray-500 italic">No permission</span>
      )}
    </div>
  );
}
