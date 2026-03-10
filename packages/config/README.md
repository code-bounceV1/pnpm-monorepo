# @pnpm-monorepo/config

Type-safe configuration management with Zod validation for environment variables.

## Features

- ✅ Runtime validation of environment variables
- ✅ Type-safe configuration object
- ✅ Clear error messages for missing/invalid values
- ✅ Support for multiple environments (development, staging, production)

## Installation

This is an internal package. It's automatically available in the monorepo.

## Usage

### 1. Setup Environment Variables

Create a `.env` file in your app with the required variables:

```env
EXPO_PUBLIC_ENV=development
EXPO_PUBLIC_API_URL=https://api.example.com

# Firebase Configuration
EXPO_PUBLIC_FIREBASE_API_KEY=your-api-key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your-app.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your-app.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
EXPO_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef

# OAuth Configuration
EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=your-client-id.apps.googleusercontent.com
EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID=your-android-client-id.apps.googleusercontent.com
EXPO_PUBLIC_MICROSOFT_CLIENT_ID=your-microsoft-client-id
EXPO_PUBLIC_MICROSOFT_TENANT_ID=your-tenant-id
EXPO_PUBLIC_ANDROID_REDIRECT_URI=com.yourapp:/oauth2redirect

# Google API Endpoints
EXPO_PUBLIC_GOOGLE_AUTH_ENDPOINT=https://accounts.google.com/o/oauth2/v2/auth
EXPO_PUBLIC_GOOGLE_TOKEN_ENDPOINT=https://oauth2.googleapis.com/token
EXPO_PUBLIC_GOOGLE_REVOCATION_ENDPOINT=https://oauth2.googleapis.com/revoke
```

### 2. Create Configuration

```typescript
import { createConfig, validateEnv } from "@pnpm-monorepo/config";

const rawEnv = {
  ENV: process.env.EXPO_PUBLIC_ENV,
  API_URL: process.env.EXPO_PUBLIC_API_URL,
  // ... other env vars
};

// Validate and create config
const validatedEnv = validateEnv(rawEnv);
export const appConfig = createConfig(validatedEnv);
```

### 3. Use Configuration

```typescript
import { appConfig } from "./app-config";

console.log(appConfig.environment); // "development" | "staging" | "production"
console.log(appConfig.apiUrl); // "https://api.example.com"
console.log(appConfig.firebase); // Full Firebase config object
```

## API

### `validateEnv(env: unknown): RawEnv`

Validates raw environment variables against the schema. Throws descriptive error if validation fails.

```typescript
const validatedEnv = validateEnv({
  ENV: "development",
  API_URL: "https://api.example.com",
  // ...
});
```

### `createConfig(env: RawEnv): AppConfig`

Creates a structured configuration object from validated environment variables.

```typescript
const config = createConfig(validatedEnv);
```

## Types

### `Environment`

```typescript
type Environment = "development" | "staging" | "production";
```

### `FirebaseConfig`

```typescript
type FirebaseConfig = {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  googleWebClientId: string;
  googleAndroidClientId: string;
  microsoftClientId: string;
  microsoftTenantId: string;
  androidRedirectUri: string;
  googleAuthEndpoint: string;
  googleTokenEndpoint: string;
  googleRevocationEndpoint: string;
};
```

### `AppConfig`

```typescript
type AppConfig = {
  environment: Environment;
  apiUrl: string;
  firebase: FirebaseConfig;
};
```

## Error Handling

If validation fails, you'll get a clear error message:

```
Invalid environment configuration:
  - API_URL: API_URL must be a valid URL
  - FIREBASE_API_KEY: FIREBASE_API_KEY is required

Please check your .env file or environment variables.
```

## Adding New Configuration

1. Add the field to `rawEnvSchema` in `src/env.ts`
2. Add the field to `AppConfig` type in `src/types.ts`
3. Map the field in `createConfig()` in `src/create-config.ts`
4. Update this README
