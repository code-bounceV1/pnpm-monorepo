import { describe, it, expect } from "vitest";
import type { AuthState, OAuthState, AuthConfig } from "../types";

describe("Auth Mobile Types", () => {
  describe("AuthState", () => {
    it("should create auth state with null user", () => {
      const state: AuthState = {
        user: null,
        loading: false,
        error: null,
      };

      expect(state.user).toBeNull();
      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();
    });

    it("should create auth state with loading", () => {
      const state: AuthState = {
        user: null,
        loading: true,
        error: null,
      };

      expect(state.loading).toBe(true);
    });

    it("should create auth state with error", () => {
      const state: AuthState = {
        user: null,
        loading: false,
        error: "Authentication failed",
      };

      expect(state.error).toBe("Authentication failed");
    });
  });

  describe("OAuthState", () => {
    it("should create OAuth state", () => {
      const state: OAuthState = {
        loading: false,
        error: null,
      };

      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();
    });

    it("should handle OAuth error state", () => {
      const state: OAuthState = {
        loading: false,
        error: "OAuth failed",
      };

      expect(state.error).toBe("OAuth failed");
    });
  });

  describe("AuthConfig", () => {
    it("should create auth config with all required fields", () => {
      const config: AuthConfig = {
        googleWebClientId: "web-client-id",
        googleAndroidClientId: "android-client-id",
        androidRedirectUri: "app://redirect",
        microsoftClientId: "ms-client-id",
        microsoftTenantId: "ms-tenant-id",
      };

      expect(config.googleWebClientId).toBe("web-client-id");
      expect(config.googleAndroidClientId).toBe("android-client-id");
      expect(config.androidRedirectUri).toBe("app://redirect");
      expect(config.microsoftClientId).toBe("ms-client-id");
      expect(config.microsoftTenantId).toBe("ms-tenant-id");
    });
  });
});
