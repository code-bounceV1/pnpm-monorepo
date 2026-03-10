import { useRBACContext } from "../context";
import type { Permission } from "../types";

export function useHasPermission(
  permission: Permission | Permission[],
  match: "any" | "all" = "any",
): boolean {
  const { user } = useRBACContext();
  if (!user) return false;

  const permissions = Array.isArray(permission) ? permission : [permission];

  if (match === "all") {
    return permissions.every((p) => user.permissions.includes(p));
  }
  return permissions.some((p) => user.permissions.includes(p));
}
