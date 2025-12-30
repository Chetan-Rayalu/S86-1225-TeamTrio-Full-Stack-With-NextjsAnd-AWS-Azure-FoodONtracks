# 🔒 Role-Based Access Control (RBAC) Documentation

## Table of Contents
1. [Overview](#overview)
2. [Role Hierarchy](#role-hierarchy)
3. [Permission Matrix](#permission-matrix)
4. [Implementation](#implementation)
5. [API Protection](#api-protection)
6. [UI Access Control](#ui-access-control)
7. [Audit Logging](#audit-logging)
8. [Testing](#testing)
9. [Security Considerations](#security-considerations)
10. [Future Enhancements](#future-enhancements)

---

## Overview

FoodONtracks implements a comprehensive Role-Based Access Control (RBAC) system that assigns permissions to users based on their role rather than individual identity. This security model ensures that users only have access to the resources and actions they need to perform their job functions.

### Key Benefits
- ✅ **Security**: Prevents unauthorized access to sensitive data and operations
- ✅ **Scalability**: Easy to add new roles or modify permissions
- ✅ **Auditability**: Complete logging of all access decisions
- ✅ **Maintainability**: Centralized permission configuration
- ✅ **User Experience**: Intuitive UI that adapts to user permissions

---

## Role Hierarchy

Our system defines three primary roles with distinct privilege levels:

| Role | Level | Description |
|------|-------|-------------|
| **ADMIN** | 3 | Full system administrator with complete control over all resources |
| **RESTAURANT_OWNER** | 2 | Restaurant managers who can control their own restaurant and menu |
| **CUSTOMER** | 1 | End users who can browse, order, and review food |

### Role Characteristics

#### ADMIN (Level 3)
- **Purpose**: System administration and platform management
- **Capabilities**: 
  - Manage all users, restaurants, and orders
  - Access system settings and configurations
  - View audit logs and security reports
  - Handle disputes and moderation
- **Use Cases**: Platform administrators, support staff

#### RESTAURANT_OWNER (Level 2)
- **Purpose**: Restaurant and menu management
- **Capabilities**:
  - Create and update menu items
  - View and process orders
  - Update restaurant information
  - View reviews and ratings
- **Use Cases**: Restaurant managers, kitchen staff

#### CUSTOMER (Level 1)
- **Purpose**: Food ordering and consumption
- **Capabilities**:
  - Browse restaurants and menus
  - Place and track orders
  - Write reviews
  - Manage personal profile and addresses
- **Use Cases**: End users, food consumers

---

## Permission Matrix

### Complete Permissions Table

| Resource | ADMIN | RESTAURANT_OWNER | CUSTOMER |
|----------|-------|------------------|----------|
| **users** | create, read, update, delete, manage | read | read (own), update (own) |
| **restaurants** | create, read, update, delete, manage | read, update (own) | read |
| **menuItems** | create, read, update, delete, manage | create, read, update, delete (own) | read |
| **orders** | create, read, update, delete, manage | read, update | create, read (own), update (own) |
| **reviews** | create, read, update, delete, manage | read | create, read, update (own), delete (own) |
| **addresses** | create, read, update, delete, manage | read | create, read, update (own), delete (own) |
| **deliveryPersons** | create, read, update, delete, manage | read, update | read |
| **transactions** | create, read, update, delete, manage | read | read (own) |

### Permission Types

- **create**: Create new resources
- **read**: View existing resources
- **update**: Modify existing resources
- **delete**: Remove resources
- **manage**: Administrative control (includes all above)

---

## Implementation

### 1. Configuration File

All permissions are defined in a centralized configuration file:

**File**: `src/config/roles.ts`

```typescript
export const rolePermissions: Record<UserRole, Record<Resource, Permission[]>> = {
  ADMIN: {
    users: ['create', 'read', 'update', 'delete', 'manage'],
    restaurants: ['create', 'read', 'update', 'delete', 'manage'],
    // ... all resources
  },
  RESTAURANT_OWNER: {
    users: ['read'],
    restaurants: ['read', 'update'],
    menuItems: ['create', 'read', 'update', 'delete'],
    // ... limited access
  },
  CUSTOMER: {
    users: ['read', 'update'],
    restaurants: ['read'],
    orders: ['create', 'read', 'update'],
    // ... basic access
  },
};
```

### 2. Helper Functions

```typescript
// Check single permission
hasPermission(role, resource, permission)

// Check any of multiple permissions
hasAnyPermission(role, resource, permissions)

// Check all permissions
hasAllPermissions(role, resource, permissions)

// Get all permissions for a resource
getPermissions(role, resource)
```

---

## API Protection

### Middleware Implementation

**File**: `src/middleware/rbac.ts`

#### Basic Usage

```typescript
import { withRbac } from '@/middleware/rbac';

export const DELETE = withRbac(
  async (request) => {
    // Your handler code
    return NextResponse.json({ success: true });
  },
  { resource: 'users', permission: 'delete' }
);
```

#### Multiple Permissions

```typescript
// Requires ANY of the specified permissions
export const GET = withRbac(
  async (request) => { /* ... */ },
  { 
    resource: 'orders', 
    permissions: ['read', 'update'],
    requireAll: false // Default
  }
);

// Requires ALL specified permissions
export const PUT = withRbac(
  async (request) => { /* ... */ },
  { 
    resource: 'restaurants', 
    permissions: ['read', 'update'],
    requireAll: true
  }
);
```

#### Admin-Only Routes

```typescript
import { withAdmin } from '@/middleware/rbac';

export const GET = withAdmin(async (request) => {
  // Only admins can access this
  return NextResponse.json({ data: 'admin data' });
});
```

#### Authentication Only

```typescript
import { withAuth } from '@/middleware/rbac';

export const GET = withAuth(async (request) => {
  // Any authenticated user can access
  const user = request.user;
  return NextResponse.json({ user });
});
```

### Real-World Examples

#### User Management API

**File**: `src/app/api/users/route.ts`

```typescript
// GET - All roles can read (with restrictions)
export const GET = withRbac(
  async (request) => {
    const user = request.user!;
    
    // Customers only see their own data
    if (user.role === 'CUSTOMER') {
      const userData = await prisma.user.findUnique({
        where: { id: user.userId }
      });
      return NextResponse.json({ data: [userData] });
    }
    
    // Admin/Owner see all users
    const users = await prisma.user.findMany();
    return NextResponse.json({ data: users });
  },
  { resource: 'users', permission: 'read' }
);

// POST - Only admins can create
export const POST = withRbac(
  async (request) => {
    const body = await request.json();
    const newUser = await prisma.user.create({ data: body });
    return NextResponse.json({ data: newUser });
  },
  { resource: 'users', permission: 'create' }
);

// DELETE - Only admins can delete
export const DELETE = withRbac(
  async (request) => {
    const { userId } = await request.json();
    await prisma.user.delete({ where: { id: userId } });
    return NextResponse.json({ success: true });
  },
  { resource: 'users', permission: 'delete' }
);
```

---

## UI Access Control

### React Hook

**File**: `src/hooks/usePermissions.ts`

```typescript
const { can, canAny, canAll, isAdmin, role } = usePermissions();

// Check single permission
if (can('delete', 'users')) {
  // Show delete button
}

// Check multiple permissions
if (canAny(['read', 'update'], 'orders')) {
  // Show order management
}

// Check role
if (isAdmin) {
  // Show admin panel
}
```

### Component Wrappers

#### RequirePermission

```tsx
import { RequirePermission } from '@/hooks/usePermissions';

<RequirePermission 
  permission="delete" 
  resource="users"
  fallback={<p>No permission</p>}
>
  <DeleteButton />
</RequirePermission>
```

#### RequireRole

```tsx
import { RequireRole } from '@/hooks/usePermissions';

<RequireRole 
  role="ADMIN"
  fallback={<p>Admin only</p>}
>
  <AdminPanel />
</RequireRole>
```

#### AdminOnly

```tsx
import { AdminOnly } from '@/hooks/usePermissions';

<AdminOnly>
  <AdminDashboard />
</AdminOnly>
```

### Real-World Example

**File**: `src/app/rbac-demo/page.tsx`

```tsx
export default function DashboardPage() {
  const { can, isAdmin, isRestaurantOwner } = usePermissions();

  return (
    <div>
      {/* Admin Section */}
      {isAdmin && (
        <div>
          <h2>Admin Controls</h2>
          <button>Manage Users</button>
          <button>View Logs</button>
        </div>
      )}

      {/* Restaurant Owner Section */}
      {isRestaurantOwner && (
        <div>
          <h2>Restaurant Dashboard</h2>
          {can('create', 'menuItems') && <button>Add Menu Item</button>}
          {can('update', 'orders') && <button>Update Order Status</button>}
        </div>
      )}

      {/* Conditional Delete Button */}
      {can('delete', 'reviews') ? (
        <button onClick={handleDelete}>Delete Review</button>
      ) : (
        <p>You cannot delete reviews</p>
      )}
    </div>
  );
}
```

---

## Audit Logging

### Log Structure

**File**: `src/middleware/rbacLogger.ts`

Every access decision is logged with the following information:

```typescript
interface RbacLogEntry {
  allowed: boolean;        // Was access granted?
  userId?: number;         // Who tried to access?
  role: string;           // What role do they have?
  resource: string;       // What resource?
  permission: string;     // What action?
  reason: string;         // Why allowed/denied?
  ip: string;            // From where?
  path: string;          // Which endpoint?
  timestamp: Date;       // When?
}
```

### Log Examples

```
✅ ALLOWED - User 1 (ADMIN) attempted to delete users at /api/users - Permission granted (IP: 192.168.1.1)
❌ DENIED - User 5 (CUSTOMER) attempted to delete users at /api/users - Insufficient permissions (IP: 192.168.1.5)
✅ ALLOWED - User 3 (RESTAURANT_OWNER) attempted to update menuItems at /api/menu-items - Permission granted (IP: 192.168.1.3)
❌ DENIED - Role: ANONYMOUS attempted to authenticated unknown at /api/orders - No valid authentication token (IP: 192.168.1.10)
```

### Viewing Logs (Admin Only)

**Endpoint**: `/api/admin/rbac-logs`

```bash
# Get all logs
GET /api/admin/rbac-logs

# Get statistics
GET /api/admin/rbac-logs?action=stats

# Get recent denials
GET /api/admin/rbac-logs?action=denials&limit=50

# Get suspicious activity
GET /api/admin/rbac-logs?action=suspicious&limit=5

# Filter by user
GET /api/admin/rbac-logs?userId=5

# Filter by resource
GET /api/admin/rbac-logs?resource=users&allowed=false

# Export logs
GET /api/admin/rbac-logs?action=export
```

### Log Analytics

```typescript
// Get statistics
const stats = getRbacStats();
// Returns: { total, allowed, denied, allowedPercentage, deniedPercentage, byRole, byResource }

// Get suspicious activity
const suspicious = getSuspiciousActivity(5);
// Returns: { byUser: {}, byIp: {} } with counts >= threshold

// Get recent denials
const denials = getRecentDenials(50);
// Returns: Array of denied access attempts
```

---

## Testing

### Automated Tests

Run the RBAC test suite:

```bash
npx ts-node scripts/test_rbac.ts
```

**Output includes**:
- ✅ Role hierarchy display
- ✅ Permission checks for all resources
- ✅ Compound permission tests
- ✅ Real-world scenario simulations
- ✅ Statistics summary

### Test Results

```
🔒 RBAC System Test & Demonstration

═══════════════════════════════════════════════════════════════════════════════
  1. ROLE HIERARCHY
═══════════════════════════════════════════════════════════════════════════════

  ADMIN (Level 3)
    Full system access - can manage all users, restaurants, and platform settings

  RESTAURANT_OWNER (Level 2)
    Can manage their own restaurant, menu items, and orders

  CUSTOMER (Level 1)
    Basic user access - can browse, order, and review

═══════════════════════════════════════════════════════════════════════════════
  2. USER MANAGEMENT PERMISSIONS
═══════════════════════════════════════════════════════════════════════════════

  ADMIN:
  ✅ ADMIN create users: ALLOWED
  ✅ ADMIN read users: ALLOWED
  ✅ ADMIN update users: ALLOWED
  ✅ ADMIN delete users: ALLOWED

  RESTAURANT_OWNER:
  ❌ RESTAURANT_OWNER create users: DENIED
  ✅ RESTAURANT_OWNER read users: ALLOWED
  ❌ RESTAURANT_OWNER update users: DENIED
  ❌ RESTAURANT_OWNER delete users: DENIED

  CUSTOMER:
  ❌ CUSTOMER create users: DENIED
  ✅ CUSTOMER read users: ALLOWED
  ✅ CUSTOMER update users: ALLOWED
  ❌ CUSTOMER delete users: DENIED

...

═══════════════════════════════════════════════════════════════════════════════
  9. TEST SUMMARY
═══════════════════════════════════════════════════════════════════════════════

  Total Permission Checks: 144
  ✅ Allowed: 56
  ❌ Denied: 88

✨ RBAC System Test Complete!
```

### Manual Testing

#### Test User Creation

1. Create test users with different roles using Prisma seed:

```bash
npm run db:seed
```

2. Login as different users:
   - Admin: `admin@example.com`
   - Restaurant Owner: `owner@example.com`
   - Customer: `customer@example.com`

3. Try accessing different resources:

```bash
# As Customer - Should SUCCEED
curl -H "Authorization: Bearer <customer_token>" \
  http://localhost:3000/api/orders

# As Customer - Should FAIL
curl -X DELETE -H "Authorization: Bearer <customer_token>" \
  http://localhost:3000/api/users?userId=1

# As Admin - Should SUCCEED
curl -X DELETE -H "Authorization: Bearer <admin_token>" \
  http://localhost:3000/api/users?userId=1
```

#### UI Testing

1. Visit `/rbac-demo` while logged in
2. Test different user roles:
   - See which buttons are enabled/disabled
   - Check which sections are visible
   - Verify fallback messages for denied access

---

## Security Considerations

### Defense in Depth

Our RBAC implementation uses multiple layers of security:

1. **Backend Validation**: Every API route checks permissions
2. **Frontend Validation**: UI hides unauthorized actions
3. **Token Security**: JWT stored in HTTP-only cookies
4. **Audit Logging**: All access attempts logged
5. **Least Privilege**: Users get minimum required permissions

### Attack Prevention

#### 1. Token Tampering
**Threat**: Attacker modifies JWT to escalate privileges

**Protection**:
- Tokens are cryptographically signed
- Signature verification on every request
- Role is re-verified from database if needed

#### 2. Direct API Access
**Threat**: User bypasses UI and calls API directly

**Protection**:
- All endpoints protected by middleware
- Backend always validates permissions
- Never trust frontend-only validation

#### 3. Session Hijacking
**Threat**: Attacker steals user's session

**Protection**:
- HTTP-only cookies prevent XSS access
- Secure flag ensures HTTPS-only transmission
- SameSite prevents CSRF attacks
- Short token expiry (15 minutes)

#### 4. Privilege Escalation
**Threat**: User tries to access higher-privilege resources

**Protection**:
- Role hierarchy enforcement
- Permission checks on every operation
- Audit logs detect suspicious patterns

### Best Practices Implemented

✅ **Deny by Default**: If no permission, deny access  
✅ **Validate on Server**: Never trust client-side checks  
✅ **Log Everything**: Audit all access decisions  
✅ **Least Privilege**: Minimal permissions needed  
✅ **Regular Review**: Permission matrix reviewed regularly  
✅ **Clear Errors**: Users know why access denied  
✅ **Token Rotation**: Regular refresh token updates  

---

## Future Enhancements

### Planned Features

#### 1. Dynamic Permissions
Allow admins to customize permissions without code changes:

```typescript
// Current: Static configuration
const permissions = rolePermissions[role][resource];

// Future: Database-driven permissions
const permissions = await fetchPermissionsFromDB(role, resource);
```

#### 2. Resource-Level Ownership
More granular "own" resource checks:

```typescript
// Check if user owns the resource
if (userId === resource.ownerId || isAdmin) {
  // Allow access
}
```

#### 3. Time-Based Access
Permissions that expire or activate at certain times:

```typescript
{
  role: 'RESTAURANT_OWNER',
  permissions: ['update'],
  validFrom: '2025-01-01',
  validUntil: '2025-12-31'
}
```

#### 4. Attribute-Based Access Control (ABAC)
Combine RBAC with additional attributes:

```typescript
// Allow if role=OWNER AND restaurant.id=user.restaurantId
if (hasPermission(role, resource, action) && 
    attributes.restaurantId === user.restaurantId) {
  // Grant access
}
```

#### 5. Permission Groups
Organize permissions into reusable groups:

```typescript
const permissionGroups = {
  BASIC_READ: ['read'],
  FULL_CRUD: ['create', 'read', 'update', 'delete'],
  ADMIN_CONTROL: ['create', 'read', 'update', 'delete', 'manage']
};
```

#### 6. Multi-Tenancy Support
Scope permissions to specific tenants/organizations:

```typescript
{
  role: 'ADMIN',
  tenantId: 'restaurant-123',
  permissions: ['manage'] // Only for this restaurant
}
```

### Scalability Considerations

As the system grows, consider:

1. **Caching**: Cache permission checks to reduce database queries
2. **Lazy Loading**: Load permissions on-demand instead of all at once
3. **Role Inheritance**: Child roles inherit parent permissions
4. **Permission Delegation**: Temporary permission sharing
5. **Bulk Operations**: Optimize permission checks for batch operations

---

## Reflection

### What Went Well

✅ **Centralized Configuration**: Single source of truth for all permissions makes updates easy

✅ **Type Safety**: TypeScript ensures compile-time validation of roles and resources

✅ **Comprehensive Logging**: Audit trail helps with debugging and compliance

✅ **Developer Experience**: Easy-to-use middleware and hooks simplify implementation

✅ **User Experience**: UI adapts seamlessly to user permissions

### Lessons Learned

1. **Start Simple**: Begin with basic roles and add complexity as needed
2. **Log Early**: Audit logging helped catch edge cases during development
3. **Test Thoroughly**: Automated tests caught several permission bugs
4. **Document Well**: Clear documentation reduces onboarding time
5. **Think Defense**: Multiple validation layers prevent security gaps

### Challenges Overcome

1. **Ownership Checks**: Determining "own" resources (e.g., customer can update their orders)
2. **Permission Inheritance**: Balancing granularity with simplicity
3. **Performance**: Ensuring permission checks don't slow down requests
4. **Edge Cases**: Handling anonymous users and mixed permissions

### Real-World Impact

This RBAC system enables:
- **Secure Multi-Tenancy**: Multiple restaurants on one platform
- **Compliance**: Audit logs for food safety regulations
- **Scalability**: Easy to add new roles (e.g., DELIVERY_DRIVER)
- **User Trust**: Transparent access control builds confidence

---

## Conclusion

The RBAC system in FoodONtracks demonstrates enterprise-grade security practices:

✅ Clear role hierarchy with well-defined permissions  
✅ Comprehensive API and UI protection  
✅ Complete audit trail for compliance  
✅ Scalable architecture for future growth  
✅ Developer-friendly implementation  

This implementation balances security, usability, and maintainability while providing a solid foundation for future enhancements like ABAC or multi-tenancy support.
