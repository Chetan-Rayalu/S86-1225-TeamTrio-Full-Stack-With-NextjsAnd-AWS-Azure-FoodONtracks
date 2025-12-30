/**
 * Role-Based Access Control (RBAC) Configuration
 *
 * This file defines the role hierarchy and permission mappings for the application.
 * Each role is assigned a specific set of permissions that determine what actions
 * users can perform on various resources.
 *
 * Permission Types:
 * - create: Create new resources
 * - read: View/read existing resources
 * - update: Modify existing resources
 * - delete: Remove resources
 * - manage: Full control over resources (admin-level)
 */

export type Permission = "create" | "read" | "update" | "delete" | "manage";

export type UserRole = "ADMIN" | "RESTAURANT_OWNER" | "CUSTOMER";

export type Resource =
  | "users"
  | "restaurants"
  | "menuItems"
  | "orders"
  | "reviews"
  | "addresses"
  | "deliveryPersons"
  | "transactions";

/**
 * Role-Permission Matrix
 *
 * Defines what permissions each role has for each resource type.
 * This centralized configuration makes it easy to audit and modify
 * access control policies.
 */
export const rolePermissions: Record<
  UserRole,
  Record<Resource, Permission[]>
> = {
  // ADMIN: Full access to all resources
  ADMIN: {
    users: ["create", "read", "update", "delete", "manage"],
    restaurants: ["create", "read", "update", "delete", "manage"],
    menuItems: ["create", "read", "update", "delete", "manage"],
    orders: ["create", "read", "update", "delete", "manage"],
    reviews: ["create", "read", "update", "delete", "manage"],
    addresses: ["create", "read", "update", "delete", "manage"],
    deliveryPersons: ["create", "read", "update", "delete", "manage"],
    transactions: ["create", "read", "update", "delete", "manage"],
  },

  // RESTAURANT_OWNER: Can manage their own restaurant and menu items
  RESTAURANT_OWNER: {
    users: ["read"], // Can view user info for orders
    restaurants: ["read", "update"], // Can update their own restaurant
    menuItems: ["create", "read", "update", "delete"], // Full control over their menu
    orders: ["read", "update"], // Can view and update order status
    reviews: ["read"], // Can read reviews for their restaurant
    addresses: ["read"], // Can read delivery addresses
    deliveryPersons: ["read", "update"], // Can assign delivery persons
    transactions: ["read"], // Can view transaction history
  },

  // CUSTOMER: Basic user with limited access
  CUSTOMER: {
    users: ["read", "update"], // Can view and update their own profile
    restaurants: ["read"], // Can browse restaurants
    menuItems: ["read"], // Can view menu items
    orders: ["create", "read", "update"], // Can place and track orders
    reviews: ["create", "read", "update", "delete"], // Can manage their own reviews
    addresses: ["create", "read", "update", "delete"], // Can manage their own addresses
    deliveryPersons: ["read"], // Can view assigned delivery person
    transactions: ["read"], // Can view their own transactions
  },
};

/**
 * Check if a role has a specific permission for a resource
 *
 * @param role - The user's role
 * @param resource - The resource being accessed
 * @param permission - The permission being checked
 * @returns true if the role has the permission, false otherwise
 */
export function hasPermission(
  role: UserRole,
  resource: Resource,
  permission: Permission
): boolean {
  const permissions = rolePermissions[role]?.[resource];
  if (!permissions) return false;

  // 'manage' permission includes all other permissions
  if (permissions.includes("manage")) return true;

  return permissions.includes(permission);
}

/**
 * Check if a role has any of the specified permissions for a resource
 *
 * @param role - The user's role
 * @param resource - The resource being accessed
 * @param permissions - Array of permissions to check
 * @returns true if the role has at least one of the permissions
 */
export function hasAnyPermission(
  role: UserRole,
  resource: Resource,
  permissions: Permission[]
): boolean {
  return permissions.some((permission) =>
    hasPermission(role, resource, permission)
  );
}

/**
 * Check if a role has all of the specified permissions for a resource
 *
 * @param role - The user's role
 * @param resource - The resource being accessed
 * @param permissions - Array of permissions to check
 * @returns true if the role has all of the permissions
 */
export function hasAllPermissions(
  role: UserRole,
  resource: Resource,
  permissions: Permission[]
): boolean {
  return permissions.every((permission) =>
    hasPermission(role, resource, permission)
  );
}

/**
 * Get all permissions a role has for a specific resource
 *
 * @param role - The user's role
 * @param resource - The resource being queried
 * @returns Array of permissions the role has for the resource
 */
export function getPermissions(
  role: UserRole,
  resource: Resource
): Permission[] {
  return rolePermissions[role]?.[resource] || [];
}

/**
 * Role hierarchy for display and documentation purposes
 */
export const roleHierarchy = {
  ADMIN: {
    level: 3,
    description:
      "Full system access - can manage all users, restaurants, and platform settings",
  },
  RESTAURANT_OWNER: {
    level: 2,
    description: "Can manage their own restaurant, menu items, and orders",
  },
  CUSTOMER: {
    level: 1,
    description: "Basic user access - can browse, order, and review",
  },
};

/**
 * Check if a role has higher or equal privilege level than another role
 *
 * @param role - The role to check
 * @param targetRole - The role to compare against
 * @returns true if role has higher or equal privilege
 */
export function hasHigherOrEqualRole(
  role: UserRole,
  targetRole: UserRole
): boolean {
  return roleHierarchy[role].level >= roleHierarchy[targetRole].level;
}
