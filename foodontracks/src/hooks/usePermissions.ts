/**
 * usePermissions Hook
 *
 * React hook for checking user permissions in UI components.
 * Allows conditional rendering based on role-based access control.
 *
 * Usage:
 * ```tsx
 * const { hasPermission, can, canAny, canAll } = usePermissions();
 *
 * if (can('delete', 'users')) {
 *   return <DeleteButton />;
 * }
 * ```
 */

"use client";

import React from "react";
import { useAuth } from "@/hooks/useAuth";
import {
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
  Permission,
  Resource,
  UserRole,
  hasHigherOrEqualRole,
} from "@/config/roles";

export interface UsePermissionsReturn {
  /**
   * Check if user has a specific permission for a resource
   */
  can: (permission: Permission, resource: Resource) => boolean;

  /**
   * Check if user has any of the specified permissions for a resource
   */
  canAny: (permissions: Permission[], resource: Resource) => boolean;

  /**
   * Check if user has all of the specified permissions for a resource
   */
  canAll: (permissions: Permission[], resource: Resource) => boolean;

  /**
   * Check if user has a specific role
   */
  hasRole: (role: UserRole) => boolean;

  /**
   * Check if user has higher or equal privilege than a role
   */
  hasRoleLevel: (role: UserRole) => boolean;

  /**
   * Check if user is admin
   */
  isAdmin: boolean;

  /**
   * Check if user is restaurant owner
   */
  isRestaurantOwner: boolean;

  /**
   * Check if user is customer
   */
  isCustomer: boolean;

  /**
   * Get user's role
   */
  role: UserRole | null;
}

/**
 * Hook to check user permissions in UI components
 */
export function usePermissions(): UsePermissionsReturn {
  const { user } = useAuth();
  const userRole = user?.role as UserRole | null;

  const can = (permission: Permission, resource: Resource): boolean => {
    if (!userRole) return false;
    return hasPermission(userRole, resource, permission);
  };

  const canAny = (permissions: Permission[], resource: Resource): boolean => {
    if (!userRole) return false;
    return hasAnyPermission(userRole, resource, permissions);
  };

  const canAll = (permissions: Permission[], resource: Resource): boolean => {
    if (!userRole) return false;
    return hasAllPermissions(userRole, resource, permissions);
  };

  const hasRole = (role: UserRole): boolean => {
    return userRole === role;
  };

  const hasRoleLevel = (role: UserRole): boolean => {
    if (!userRole) return false;
    return hasHigherOrEqualRole(userRole, role);
  };

  return {
    can,
    canAny,
    canAll,
    hasRole,
    hasRoleLevel,
    isAdmin: userRole === "ADMIN",
    isRestaurantOwner: userRole === "RESTAURANT_OWNER",
    isCustomer: userRole === "CUSTOMER",
    role: userRole,
  };
}

/**
 * Component wrapper for conditional rendering based on permissions
 *
 * Usage:
 * ```tsx
 * <RequirePermission permission="delete" resource="users">
 *   <DeleteButton />
 * </RequirePermission>
 * ```
 */
interface RequirePermissionProps {
  permission: Permission;
  resource: Resource;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function RequirePermission({
  permission,
  resource,
  children,
  fallback = null,
}: RequirePermissionProps): React.ReactElement | null {
  const { can } = usePermissions();

  if (!can(permission, resource)) {
    return fallback as React.ReactElement | null;
  }

  return children as React.ReactElement;
}

/**
 * Component wrapper for conditional rendering based on role
 *
 * Usage:
 * ```tsx
 * <RequireRole role="ADMIN">
 *   <AdminPanel />
 * </RequireRole>
 * ```
 */
interface RequireRoleProps {
  role: UserRole | UserRole[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function RequireRole({
  role,
  children,
  fallback = null,
}: RequireRoleProps): React.ReactElement | null {
  const { hasRole } = usePermissions();

  const roles = Array.isArray(role) ? role : [role];
  const hasRequiredRole = roles.some((r) => hasRole(r));

  if (!hasRequiredRole) {
    return fallback as React.ReactElement | null;
  }

  return children as React.ReactElement;
}

/**
 * Component wrapper for admin-only content
 *
 * Usage:
 * ```tsx
 * <AdminOnly>
 *   <AdminPanel />
 * </AdminOnly>
 * ```
 */
interface AdminOnlyProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function AdminOnly({
  children,
  fallback = null,
}: AdminOnlyProps): React.ReactElement | null {
  const { isAdmin } = usePermissions();

  if (!isAdmin) {
    return fallback as React.ReactElement | null;
  }

  return children as React.ReactElement;
}

/**
 * Component wrapper for authenticated users only
 *
 * Usage:
 * ```tsx
 * <AuthenticatedOnly>
 *   <UserProfile />
 * </AuthenticatedOnly>
 * ```
 */
interface AuthenticatedOnlyProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function AuthenticatedOnly({
  children,
  fallback = null,
}: AuthenticatedOnlyProps): React.ReactElement | null {
  const { user } = useAuth();

  if (!user) {
    return fallback as React.ReactElement | null;
  }

  return children as React.ReactElement;
}
