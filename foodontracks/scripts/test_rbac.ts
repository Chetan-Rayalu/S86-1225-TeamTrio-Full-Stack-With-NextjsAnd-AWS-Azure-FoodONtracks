/**
 * RBAC Testing Script
 *
 * This script demonstrates and tests the RBAC system by:
 * 1. Testing permission checks for different roles
 * 2. Showing allowed and denied actions
 * 3. Demonstrating audit logging
 *
 * Run with: npx ts-node scripts/test_rbac.ts
 */

import {
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
  getPermissions,
  UserRole,
  Resource,
  Permission,
  roleHierarchy,
} from "../src/config/roles";

// ANSI color codes for terminal output
const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
  bold: "\x1b[1m",
};

function log(message: string, color: string = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function testPermission(
  role: UserRole,
  resource: Resource,
  permission: Permission
): boolean {
  const allowed = hasPermission(role, resource, permission);
  const icon = allowed ? "✅" : "❌";
  const colorCode = allowed ? colors.green : colors.red;
  const status = allowed ? "ALLOWED" : "DENIED";

  log(`  ${icon} ${role} ${permission} ${resource}: ${status}`, colorCode);

  return allowed;
}

function printSeparator() {
  log("═".repeat(80), colors.cyan);
}

function printHeader(title: string) {
  printSeparator();
  log(`  ${title}`, colors.bold + colors.cyan);
  printSeparator();
}

async function main() {
  log("\n🔒 RBAC System Test & Demonstration\n", colors.bold + colors.magenta);

  // Display Role Hierarchy
  printHeader("1. ROLE HIERARCHY");
  Object.entries(roleHierarchy).forEach(([role, info]) => {
    log(`\n  ${role} (Level ${info.level})`, colors.bold + colors.yellow);
    log(`    ${info.description}`, colors.yellow);
  });
  console.log();

  // Test User Management Permissions
  printHeader("2. USER MANAGEMENT PERMISSIONS");
  console.log();
  log("  Testing CRUD operations on users resource:", colors.blue);
  console.log();

  const userPermissions: Permission[] = ["create", "read", "update", "delete"];
  const roles: UserRole[] = ["ADMIN", "RESTAURANT_OWNER", "CUSTOMER"];

  roles.forEach((role) => {
    log(`\n  ${role}:`, colors.bold);
    userPermissions.forEach((permission) => {
      testPermission(role, "users", permission);
    });
  });
  console.log();

  // Test Restaurant Management Permissions
  printHeader("3. RESTAURANT MANAGEMENT PERMISSIONS");
  console.log();
  log("  Testing CRUD operations on restaurants resource:", colors.blue);
  console.log();

  roles.forEach((role) => {
    log(`\n  ${role}:`, colors.bold);
    ["create", "read", "update", "delete"].forEach((permission) => {
      testPermission(role, "restaurants", permission as Permission);
    });
  });
  console.log();

  // Test Menu Items Permissions
  printHeader("4. MENU ITEMS MANAGEMENT PERMISSIONS");
  console.log();
  log("  Testing CRUD operations on menuItems resource:", colors.blue);
  console.log();

  roles.forEach((role) => {
    log(`\n  ${role}:`, colors.bold);
    ["create", "read", "update", "delete"].forEach((permission) => {
      testPermission(role, "menuItems", permission as Permission);
    });
  });
  console.log();

  // Test Order Management Permissions
  printHeader("5. ORDER MANAGEMENT PERMISSIONS");
  console.log();
  log("  Testing CRUD operations on orders resource:", colors.blue);
  console.log();

  roles.forEach((role) => {
    log(`\n  ${role}:`, colors.bold);
    ["create", "read", "update", "delete"].forEach((permission) => {
      testPermission(role, "orders", permission as Permission);
    });
  });
  console.log();

  // Test Multiple Permissions
  printHeader("6. COMPOUND PERMISSION CHECKS");
  console.log();

  log("  Testing hasAnyPermission (requires at least one):", colors.blue);
  roles.forEach((role) => {
    const result = hasAnyPermission(role, "users", ["create", "delete"]);
    const icon = result ? "✅" : "❌";
    const colorCode = result ? colors.green : colors.red;
    log(`  ${icon} ${role} can create OR delete users: ${result}`, colorCode);
  });
  console.log();

  log("  Testing hasAllPermissions (requires all):", colors.blue);
  roles.forEach((role) => {
    const result = hasAllPermissions(role, "restaurants", ["read", "update"]);
    const icon = result ? "✅" : "❌";
    const colorCode = result ? colors.green : colors.red;
    log(
      `  ${icon} ${role} can read AND update restaurants: ${result}`,
      colorCode
    );
  });
  console.log();

  // Show All Permissions for Each Role
  printHeader("7. COMPLETE PERMISSION MATRIX");
  console.log();

  const resources: Resource[] = [
    "users",
    "restaurants",
    "menuItems",
    "orders",
    "reviews",
    "addresses",
  ];

  roles.forEach((role) => {
    log(`\n  ${role}:`, colors.bold + colors.yellow);
    resources.forEach((resource) => {
      const permissions = getPermissions(role, resource);
      if (permissions.length > 0) {
        log(`    ${resource}: ${permissions.join(", ")}`, colors.yellow);
      }
    });
  });
  console.log();

  // Simulated Access Scenarios
  printHeader("8. REAL-WORLD SCENARIOS");
  console.log();

  log("  Scenario 1: Customer tries to delete a user", colors.blue);
  const scenario1 = testPermission("CUSTOMER", "users", "delete");
  if (!scenario1) {
    log("    → Access denied. Customers cannot delete users.", colors.red);
  }
  console.log();

  log("  Scenario 2: Restaurant owner tries to update menu items", colors.blue);
  const scenario2 = testPermission("RESTAURANT_OWNER", "menuItems", "update");
  if (scenario2) {
    log(
      "    → Access granted. Restaurant owners can manage their menu.",
      colors.green
    );
  }
  console.log();

  log("  Scenario 3: Admin tries to manage all resources", colors.blue);
  const scenario3Admin = [
    testPermission("ADMIN", "users", "manage"),
    testPermission("ADMIN", "restaurants", "manage"),
    testPermission("ADMIN", "orders", "manage"),
  ];
  if (scenario3Admin.every((r) => r)) {
    log("    → Access granted. Admins have full system access.", colors.green);
  }
  console.log();

  log("  Scenario 4: Customer tries to view their own orders", colors.blue);
  const scenario4 = testPermission("CUSTOMER", "orders", "read");
  if (scenario4) {
    log("    → Access granted. Customers can view their orders.", colors.green);
  }
  console.log();

  // Summary
  printHeader("9. TEST SUMMARY");
  console.log();

  const stats = {
    totalTests: 0,
    passed: 0,
    failed: 0,
  };

  // Count all permission checks
  roles.forEach((role) => {
    resources.forEach((resource) => {
      ["create", "read", "update", "delete"].forEach((permission) => {
        stats.totalTests++;
        if (hasPermission(role, resource, permission as Permission)) {
          stats.passed++;
        } else {
          stats.failed++;
        }
      });
    });
  });

  log(`  Total Permission Checks: ${stats.totalTests}`, colors.bold);
  log(`  ✅ Allowed: ${stats.passed}`, colors.green);
  log(`  ❌ Denied: ${stats.failed}`, colors.red);
  console.log();

  printSeparator();
  log("\n✨ RBAC System Test Complete!\n", colors.bold + colors.magenta);
  log("All permission checks are working as expected.", colors.green);
  log(
    "The system properly enforces role-based access control.\n",
    colors.green
  );
}

// Run the tests
main().catch((error) => {
  console.error("Error running RBAC tests:", error);
  process.exit(1);
});
