export type Role = string;
export type Permission = string;

export interface RBACUser {
  roles: Role[];
  permissions: Permission[];
}

export interface RBACContextValue {
  user: RBACUser | null;
}
