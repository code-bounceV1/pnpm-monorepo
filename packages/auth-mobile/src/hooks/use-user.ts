import { useAuth } from "./use-auth";
import type { AuthUser } from "../types";

export function useUser(): AuthUser | null {
  const { user } = useAuth();
  return user;
}
