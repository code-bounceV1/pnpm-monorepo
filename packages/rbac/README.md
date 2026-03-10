# @pnpm-monorepo/rbac

Role-based and permission-based access control for React Native apps in the monorepo. Framework-agnostic — user data is passed via context.

---

## Folder Structure

```
packages/rbac/
├── index.ts
├── package.json
├── tsconfig.json
├── README.md
└── src/
    ├── index.ts
    ├── types.ts
    ├── context.tsx
    └── hooks/
        ├── index.ts
        ├── use-has-role.ts
        └── use-has-permission.ts
```

---

## Installation

```json
{
  "dependencies": {
    "@pnpm-monorepo/rbac": "workspace:*"
  }
}
```

```bash
pnpm install
```

---

## Setup

Wrap your app with `RBACProvider` and pass the user's roles and permissions.

```tsx
// apps/my-app/app/_layout.tsx
import { RBACProvider } from "@pnpm-monorepo/rbac";
import { useAppSelector } from "@/store/hooks";

export default function RootLayout() {
  const { user } = useAppSelector((s) => s.auth);

  return (
    <RBACProvider
      user={user ? { roles: user.roles, permissions: user.permissions } : null}
    >
      <Slot />
    </RBACProvider>
  );
}
```

---

## Hooks

### `useHasRole(role)`

Returns `true` if the user has the given role or any of the given roles.

```ts
import { useHasRole } from "@pnpm-monorepo/rbac";

const isAdmin = useHasRole("admin");
const isStaff = useHasRole(["admin", "manager"]); // true if user has any
```

---

### `useHasPermission(permission, match?)`

Returns `true` if the user has the given permission(s).

```ts
import { useHasPermission } from "@pnpm-monorepo/rbac";

// any — passes if user has at least one (default)
const canEdit = useHasPermission("post:edit");
const canManage = useHasPermission(["post:edit", "post:delete"], "any");

// all — passes only if user has every permission
const canFullControl = useHasPermission(["post:edit", "post:delete"], "all");
```

---

## Usage Examples

### Conditionally render UI

```tsx
import { useHasRole, useHasPermission } from "@pnpm-monorepo/rbac";

export function PostActions() {
  const isAdmin = useHasRole("admin");
  const canDelete = useHasPermission("post:delete");

  return (
    <>
      {isAdmin && <AdminBadge />}
      {canDelete && <DeleteButton />}
    </>
  );
}
```

### Protect a screen

```tsx
import { useHasRole } from "@pnpm-monorepo/rbac";
import { Redirect } from "expo-router";

export default function AdminScreen() {
  const isAdmin = useHasRole("admin");

  if (!isAdmin) return <Redirect href="/(tabs)/home" />;

  return <AdminDashboard />;
}
```

### Combined role and permission check

```tsx
import { useHasRole, useHasPermission } from "@pnpm-monorepo/rbac";

export function ManageButton() {
  const isManager = useHasRole(["admin", "manager"]);
  const canEdit = useHasPermission("post:edit");

  if (!isManager || !canEdit) return null;

  return <Button title="Manage" onPress={handleManage} />;
}
```

---

## Types

```ts
import type { Role, Permission, RBACUser } from "@pnpm-monorepo/rbac";

type Role = string;
type Permission = string;

interface RBACUser {
  roles: Role[];
  permissions: Permission[];
}
```

You can narrow these in your app:

```ts
// apps/my-app/types/rbac.ts
export type AppRole = "admin" | "manager" | "user" | "guest";
export type AppPermission = "post:edit" | "post:delete" | "user:manage";
```
