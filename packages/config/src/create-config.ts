import type { RawEnv } from "./env";
import type { AppConfig } from "./types";

export const createConfig = (env: RawEnv): AppConfig => {
  return {
    environment: env.ENV,
    apiUrl: env.API_URL,
    firebase: {
      apiKey: env.FIREBASE_API_KEY,
      authDomain: env.FIREBASE_AUTH_DOMAIN,
      projectId: env.FIREBASE_PROJECT_ID,
      storageBucket: env.FIREBASE_STORAGE_BUCKET,
      messagingSenderId: env.FIREBASE_MESSAGING_SENDER_ID,
      appId: env.FIREBASE_APP_ID,
      googleWebClientId: env.GOOGLE_WEB_CLIENT_ID,
      googleAndroidClientId: env.GOOGLE_ANDROID_CLIENT_ID,
      microsoftClientId: env.MICROSOFT_CLIENT_ID,
      microsoftTenantId: env.MICROSOFT_TENANT_ID,
      androidRedirectUri: env.ANDROID_REDIRECT_URI,
      googleAuthEndpoint: env.GOOGLE_AUTH_ENDPOINT,
      googleTokenEndpoint: env.GOOGLE_TOKEN_ENDPOINT,
      googleRevocationEndpoint: env.GOOGLE_REVOCATION_ENDPOINT,
    },
  };
};
