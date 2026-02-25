import { createConfig, validateEnv } from "@pnpm-monorepo/config";

// Gather environment variables from Expo (process.env or import.meta.env)
const rawEnv = {
  ENV:
    (process.env.EXPO_PUBLIC_ENV as "development" | "staging" | "production") ??
    "development",
  API_URL: process.env.EXPO_PUBLIC_API_URL ?? "",
  FIREBASE_API_KEY: process.env.FIREBASE_API_KEY ?? "",
  FIREBASE_AUTH_DOMAIN: process.env.FIREBASE_AUTH_DOMAIN ?? "",
  FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID ?? "",
  FIREBASE_STORAGE_BUCKET: process.env.FIREBASE_STORAGE_BUCKET ?? "",
  FIREBASE_MESSAGING_SENDER_ID: process.env.FIREBASE_MESSAGING_SENDER_ID ?? "",
  FIREBASE_APP_ID: process.env.FIREBASE_APP_ID ?? "",
};

// Validate the environment variables
const validatedEnv = validateEnv(rawEnv);

// Create the app config
export const appConfig = createConfig(validatedEnv);
