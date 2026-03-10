import { useRBACContext } from "../context";
import type { Role } from "../types";

export function useHasRole(role: Role | Role[]): boolean {
  const { user } = useRBACContext();
  if (!user) return false;

  const roles = Array.isArray(role) ? role : [role];
  return roles.some((r) => user.roles.includes(r));
}
