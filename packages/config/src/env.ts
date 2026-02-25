import { z } from "zod";

export const rawEnvSchema = z.object({
  ENV: z.enum(["development", "staging", "production"]),
  API_URL: z.string(),

  FIREBASE_API_KEY: z.string(),
  FIREBASE_AUTH_DOMAIN: z.string(),
  FIREBASE_PROJECT_ID: z.string(),
  FIREBASE_STORAGE_BUCKET: z.string(),
  FIREBASE_MESSAGING_SENDER_ID: z.string(),
  FIREBASE_APP_ID: z.string(),
});

export type RawEnv = z.infer<typeof rawEnvSchema>;

export const validateEnv = (env: RawEnv): RawEnv => {
  return rawEnvSchema.parse(env);
};
