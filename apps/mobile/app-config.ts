import { createConfig, validateEnv } from "@pnpm-monorepo/config";

// Gather environment variables from Expo (process.env or import.meta.env)
const rawEnv = {
  ENV: process.env.EXPO_PUBLIC_ENV as
    | "development"
    | "staging"
    | "production"
    | undefined,
  API_URL: process.env.EXPO_PUBLIC_API_URL,
};

// Validate the environment variables (will throw with helpful error if invalid)
const validatedEnv = validateEnv(rawEnv);

// Create the app config
export const appConfig = createConfig(validatedEnv);
