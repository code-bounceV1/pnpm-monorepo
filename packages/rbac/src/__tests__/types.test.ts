import { describe, it, expect } from "vitest";
import type { Role, Permission, RBACUser, RBACContextValue } from "../types";

describe("RBAC Types", () => {
  describe("RBACUser", () => {
    it("should create a user with roles and permissions", () => {
      const user: RBACUser = {
        roles: ["admin", "editor"],
        permissions: ["read", "write", "delete"],
      };

      expect(user.roles).toHaveLength(2);
      expect(user.permissions).toHaveLength(3);
      expect(user.roles).toContain("admin");
      expect(user.permissions).toContain("write");
    });

    it("should allow empty roles and permissions", () => {
      const user: RBACUser = {
        roles: [],
        permissions: [],
      };

      expect(user.roles).toHaveLength(0);
      expect(user.permissions).toHaveLength(0);
    });

    it("should support string role types", () => {
      const role: Role = "custom-role";
      const permission: Permission = "custom-permission";

      const user: RBACUser = {
        roles: [role],
        permissions: [permission],
      };

      expect(user.roles[0]).toBe("custom-role");
      expect(user.permissions[0]).toBe("custom-permission");
    });
  });

  describe("RBACContextValue", () => {
    it("should create context with user", () => {
      const context: RBACContextValue = {
        user: {
          roles: ["user"],
          permissions: ["read"],
        },
      };

      expect(context.user).not.toBeNull();
      expect(context.user?.roles).toContain("user");
    });

    it("should allow null user", () => {
      const context: RBACContextValue = {
        user: null,
      };

      expect(context.user).toBeNull();
    });
  });
});
