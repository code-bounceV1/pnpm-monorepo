import { describe, it, expect } from "vitest";
import { createConfig } from "../create-config";
import type { RawEnv } from "../env";

describe("createConfig", () => {
  it("should create config from environment variables", () => {
    const env: RawEnv = {
      ENV: "development",
      API_URL: "https://api.example.com",
      FIREBASE_API_KEY: "test-api-key",
      FIREBASE_AUTH_DOMAIN: "test.firebaseapp.com",
      FIREBASE_PROJECT_ID: "test-project",
      FIREBASE_STORAGE_BUCKET: "test.appspot.com",
      FIREBASE_MESSAGING_SENDER_ID: "123456",
      FIREBASE_APP_ID: "test-app-id",
      GOOGLE_WEB_CLIENT_ID: "web-client-id",
      GOOGLE_ANDROID_CLIENT_ID: "android-client-id",
      MICROSOFT_CLIENT_ID: "ms-client-id",
      MICROSOFT_TENANT_ID: "ms-tenant-id",
      ANDROID_REDIRECT_URI: "app://redirect",
      GOOGLE_AUTH_ENDPOINT: "https://accounts.google.com/o/oauth2/v2/auth",
      GOOGLE_TOKEN_ENDPOINT: "https://oauth2.googleapis.com/token",
      GOOGLE_REVOCATION_ENDPOINT: "https://oauth2.googleapis.com/revoke",
    };

    const config = createConfig(env);

    expect(config.environment).toBe("development");
    expect(config.apiUrl).toBe("https://api.example.com");
    expect(config.firebase.apiKey).toBe("test-api-key");
    expect(config.firebase.projectId).toBe("test-project");
  });

  it("should map all firebase configuration fields", () => {
    const env: RawEnv = {
      ENV: "production",
      API_URL: "https://api.production.com",
      FIREBASE_API_KEY: "prod-api-key",
      FIREBASE_AUTH_DOMAIN: "prod.firebaseapp.com",
      FIREBASE_PROJECT_ID: "prod-project",
      FIREBASE_STORAGE_BUCKET: "prod.appspot.com",
      FIREBASE_MESSAGING_SENDER_ID: "789012",
      FIREBASE_APP_ID: "prod-app-id",
      GOOGLE_WEB_CLIENT_ID: "prod-web-client",
      GOOGLE_ANDROID_CLIENT_ID: "prod-android-client",
      MICROSOFT_CLIENT_ID: "prod-ms-client",
      MICROSOFT_TENANT_ID: "prod-ms-tenant",
      ANDROID_REDIRECT_URI: "prod://redirect",
      GOOGLE_AUTH_ENDPOINT: "https://accounts.google.com/o/oauth2/v2/auth",
      GOOGLE_TOKEN_ENDPOINT: "https://oauth2.googleapis.com/token",
      GOOGLE_REVOCATION_ENDPOINT: "https://oauth2.googleapis.com/revoke",
    };

    const config = createConfig(env);

    expect(config.firebase).toEqual({
      apiKey: "prod-api-key",
      authDomain: "prod.firebaseapp.com",
      projectId: "prod-project",
      storageBucket: "prod.appspot.com",
      messagingSenderId: "789012",
      appId: "prod-app-id",
      googleWebClientId: "prod-web-client",
      googleAndroidClientId: "prod-android-client",
      microsoftClientId: "prod-ms-client",
      microsoftTenantId: "prod-ms-tenant",
      androidRedirectUri: "prod://redirect",
      googleAuthEndpoint: "https://accounts.google.com/o/oauth2/v2/auth",
      googleTokenEndpoint: "https://oauth2.googleapis.com/token",
      googleRevocationEndpoint: "https://oauth2.googleapis.com/revoke",
    });
  });
});
