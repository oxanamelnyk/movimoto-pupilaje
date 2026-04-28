# Permission Layer Documentation

## Overview

This permission layer implements **RBAC (Role-Based Access Control)** with two roles:

- **ADMIN**: Full permissions (read, create, update, delete)
- **MANAGER**: Limited permissions (read, create, update only, no delete)

## Quick Start

### 1. Database Setup

The `platform_memberships` table links users to platforms with roles:

```sql
CREATE TABLE platform_memberships (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id VARCHAR(255) NOT NULL,
  platform_id VARCHAR(255) NOT NULL,
  role ENUM('ADMIN', 'MANAGER') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

Run the migration:

```bash
npm run db:generate  # Generate schema
npm run db:migrate   # Apply to database
```

### 2. Server Actions (Recommended)

```typescript
// src/app/actions/invoices.ts
import { Action } from "@/validators/permissions";
import { assertPermission } from "@/lib/permissions/middleware";
import { getUserRole } from "@/db/queries/permissions";

export async function deleteInvoice({
  invoiceId,
  userId,
  platformId,
}: {
  invoiceId: number;
  userId: string;
  platformId: string;
}) {
  const role = await getUserRole(userId, platformId);
  assertPermission(role, Action.DELETE); // Throws if not allowed

  // Safe to proceed - user has permission
  // TODO: implement deletion
}
```

### 3. API Routes

```typescript
// src/app/api/invoices/route.ts
import {
  assertPermission,
  PermissionDeniedError,
} from "@/lib/permissions/middleware";

export async function DELETE(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id");
    const platformId = request.headers.get("x-platform-id");

    const role = await getUserRole(userId, platformId);
    assertPermission(role, Action.DELETE);

    // Safe to proceed
  } catch (error) {
    if (error instanceof PermissionDeniedError) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
  }
}
```

### 4. Client Components (UI Only)

```typescript
"use client";

import { usePermission, useCanDelete } from "@/hooks/usePermission";

export function InvoiceActions({ role }) {
  const { can } = usePermission({ role });
  const canDelete = useCanDelete(role);

  // Hide UI elements user can't access
  return (
    <>
      {can(Action.READ) && <button>View</button>}
      {can(Action.CREATE) && <button>Create</button>}
      {can(Action.UPDATE) && <button>Edit</button>}
      {canDelete && <button>Delete</button>}
    </>
  );
}
```

## Core APIs

### Checker Functions (`checker.ts`)

```typescript
import { Action, Role } from "@/validators/permissions";
import {
  hasPermission,
  getAllowedActions,
  hasAllPermissions,
  hasAnyPermission,
} from "@/lib/permissions/checker";

// Single action check
hasPermission(Role.MANAGER, Action.DELETE); // false
hasPermission(Role.ADMIN, Action.DELETE); // true

// Multiple actions
hasAllPermissions(Role.MANAGER, [Action.READ, Action.CREATE]); // true
hasAnyPermission(Role.MANAGER, [Action.DELETE, Action.READ]); // true

// Get all allowed actions
getAllowedActions(Role.MANAGER); // [READ, CREATE, UPDATE]
```

### Middleware Functions (`middleware.ts`)

```typescript
import {
  assertPermission,
  PermissionDeniedError,
} from "@/lib/permissions/middleware";

// Throws PermissionDeniedError if not allowed
assertPermission(role, Action.DELETE);

// Manual try-catch
try {
  assertPermission(role, Action.DELETE);
} catch (error) {
  if (error instanceof PermissionDeniedError) {
    console.log(`Denied: ${error.action} for ${error.role}`);
  }
}
```

### Database Queries (`src/db/queries/permissions.ts`)

```typescript
import {
  getUserRole,
  userHasMembership,
  getUserPlatforms,
  assignRoleToUser,
  removeUserFromPlatform,
} from "@/db/queries/permissions";

// Get user's role in a platform
const role = await getUserRole(userId, platformId); // "ADMIN" | "MANAGER" | null

// Check if user has access
const has = await userHasMembership(userId, platformId); // boolean

// Get all platforms user is in
const platforms = await getUserPlatforms(userId);
// [{ platformId: "p1", role: "ADMIN" }, ...]

// Assign role to user
await assignRoleToUser(userId, platformId, "MANAGER");

// Remove user from platform
await removeUserFromPlatform(userId, platformId);
```

### Client Hooks (`usePermission.ts`)

```typescript
"use client";

import {
  usePermission,
  useCanRead,
  useCanCreate,
  useCanUpdate,
  useCanDelete
} from "@/hooks/usePermission";

// Comprehensive permission object
const perms = usePermission({ role });
perms.can(Action.READ);           // boolean
perms.canAll([Action.READ, ...]);  // boolean
perms.canAny([Action.READ, ...]);  // boolean
perms.allowed;                     // Action[]

// Shortcut hooks
useCanRead(role);    // boolean
useCanCreate(role);  // boolean
useCanUpdate(role);  // boolean
useCanDelete(role);  // boolean
```

## Permission Matrix

| Action | ADMIN | MANAGER |
| ------ | ----- | ------- |
| READ   | ✓     | ✓       |
| CREATE | ✓     | ✓       |
| UPDATE | ✓     | ✓       |
| DELETE | ✓     | ✗       |

## Best Practices

### ✅ Do

```typescript
// Server: Always verify permissions server-side
const role = await getUserRole(userId, platformId);
assertPermission(role, Action.DELETE);

// Client: Use for UI state only
const canDelete = useCanDelete(role);
if (canDelete) {
  // Show delete button
}
```

### ❌ Don't

```typescript
// Don't trust client-only checks for data operations
if (localStorage.getItem("role") === "ADMIN") {
  // Call API - WRONG! Client can modify this
}

// Don't skip server validation
assertPermission(role, Action.DELETE); // Always do this
```

## Common Patterns

### Invoice CRUD Operations

```typescript
// READ
const role = await getUserRole(userId, platformId);
assertPermission(role, Action.READ);
const invoices = await db.query.invoices.findMany();

// CREATE
assertPermission(role, Action.CREATE);
const newInvoice = await db.insert(invoices).values(...);

// UPDATE
assertPermission(role, Action.UPDATE);
const updated = await db.update(invoices).set(...);

// DELETE (ADMIN ONLY)
assertPermission(role, Action.DELETE);
await db.delete(invoices).where(...);
```

### Conditional Operations

```typescript
const role = await getUserRole(userId, platformId);

// Some operations only for ADMIN
if (hasPermission(role, Action.DELETE)) {
  // ADMIN-only logic (e.g., system-wide reports)
}

// Everyone else can do limited operations
if (hasPermission(role, Action.READ)) {
  // MANAGER + ADMIN can read
}
```

## Migration Notes

- Update `platformId` references to match your actual platform identifier
- Add authentication middleware to extract `userId` and `platformId` from requests
- Run `npm run db:migrate` after updating schema
- Test permissions in both API routes and server actions

## Future Enhancements

- Add more granular resource-level permissions (e.g., "edit own invoices only")
- Add permission caching layer
- Add audit logging for permission changes
- Add permission inheritance (e.g., ADMIN inherits MANAGER permissions)
