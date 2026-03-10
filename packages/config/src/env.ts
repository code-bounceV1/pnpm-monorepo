import { z, ZodError } from "zod";

export const rawEnvSchema = z.object({
  ENV: z.enum(["development", "staging", "production"]),
  API_URL: z.string().url("API_URL must be a valid URL"),

  FIREBASE_API_KEY: z.string().min(1, "FIREBASE_API_KEY is required"),
  FIREBASE_AUTH_DOMAIN: z.string().min(1, "FIREBASE_AUTH_DOMAIN is required"),
  FIREBASE_PROJECT_ID: z.string().min(1, "FIREBASE_PROJECT_ID is required"),
  FIREBASE_STORAGE_BUCKET: z
    .string()
    .min(1, "FIREBASE_STORAGE_BUCKET is required"),
  FIREBASE_MESSAGING_SENDER_ID: z
    .string()
    .min(1, "FIREBASE_MESSAGING_SENDER_ID is required"),
  FIREBASE_APP_ID: z.string().min(1, "FIREBASE_APP_ID is required"),
  GOOGLE_WEB_CLIENT_ID: z.string().min(1, "GOOGLE_WEB_CLIENT_ID is required"),
  GOOGLE_ANDROID_CLIENT_ID: z
    .string()
    .min(1, "GOOGLE_ANDROID_CLIENT_ID is required"),
  MICROSOFT_CLIENT_ID: z.string().min(1, "MICROSOFT_CLIENT_ID is required"),
  MICROSOFT_TENANT_ID: z.string().min(1, "MICROSOFT_TENANT_ID is required"),
  ANDROID_REDIRECT_URI: z.string().min(1, "ANDROID_REDIRECT_URI is required"),
  GOOGLE_AUTH_ENDPOINT: z
    .string()
    .url("GOOGLE_AUTH_ENDPOINT must be a valid URL"),
  GOOGLE_TOKEN_ENDPOINT: z
    .string()
    .url("GOOGLE_TOKEN_ENDPOINT must be a valid URL"),
  GOOGLE_REVOCATION_ENDPOINT: z
    .string()
    .url("GOOGLE_REVOCATION_ENDPOINT must be a valid URL"),
});

export type RawEnv = z.infer<typeof rawEnvSchema>;

export const validateEnv = (env: unknown): RawEnv => {
  try {
    return rawEnvSchema.parse(env);
  } catch (error) {
    if (error instanceof ZodError) {
      const missingVars = error.issues
        .map((issue) => `  - ${issue.path.join(".")}: ${issue.message}`)
        .join("\n");
      throw new Error(
        `Invalid environment configuration:\n${missingVars}\n\nPlease check your .env file or environment variables.`,
      );
    }
    throw error;
  }
};
