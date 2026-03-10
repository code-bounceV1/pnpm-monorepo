# @pnpm-monorepo/auth-mobile

A Firebase authentication package for React Native / Expo apps in the monorepo. Handles Google, Microsoft, and email/password auth. Redux-free by design — bring your own state management.

---

## Installation

Add to your app's `package.json`:

```json
{
  "dependencies": {
    "@pnpm-monorepo/auth-mobile": "workspace:*"
  }
}
```

Then run:

```bash
pnpm install
```

---

## Setup

Call `initAuth()` once at app startup **before** using any hooks or actions. The best place is your root layout file.

```ts
// app/_layout.tsx
import { initAuth } from "@pnpm-monorepo/auth-mobile";

initAuth({
  googleWebClientId: "YOUR_GOOGLE_WEB_CLIENT_ID",
  googleAndroidClientId: "YOUR_GOOGLE_ANDROID_CLIENT_ID",
  androidRedirectUri: "com.yourapp:/oauth2redirect",
  microsoftClientId: "YOUR_MICROSOFT_CLIENT_ID",
  microsoftTenantId: "YOUR_MICROSOFT_TENANT_ID",
});
```

If you use an `appConfig` pattern:

```ts
// app/_layout.tsx
import { initAuth } from "@pnpm-monorepo/auth-mobile";
import { appConfig } from "@/app-config";

initAuth({
  googleWebClientId: appConfig.firebase.googleWebClientId,
  googleAndroidClientId: appConfig.firebase.googleAndroidClientId,
  androidRedirectUri: appConfig.firebase.androidRedirectUri,
  microsoftClientId: appConfig.firebase.microsoftClientId,
  microsoftTenantId: appConfig.firebase.microsoftTenantId,
});
```

---

## Folder Structure

```
packages/auth-mobile/
├── index.ts
├── package.json
├── tsconfig.json
└── src/
    ├── index.ts
    ├── config.ts               # initAuth() + getConfig()
    ├── firebase.ts             # firebase app + auth instance
    ├── types.ts                # AuthUser, AuthState, AuthConfig, OAuthState
    ├── actions.ts              # signOut, signInWithEmail, signUpWithEmail, resetPassword
    └── hooks/
        ├── useAuth.ts          # firebase auth state listener
        ├── useGoogleSignIn.ts  # google oauth flow
        └── useMicrosoftSignIn.ts # microsoft oauth flow
```

---

## API Reference

### `initAuth(config: AuthConfig)`

Initialises the package with your app config. Must be called before any hooks or actions.

### `useAuth()`

Listens to Firebase auth state. Returns `{ user, loading, error }`.

### `useGoogleSignIn()`

Returns `{ loading, error, signInWithGoogle }`. Handles the full Google OAuth flow for Android and iOS.

### `useMicrosoftSignIn()`

Returns `{ loading, error, signInWithMicrosoft }`. Handles the full Microsoft OAuth flow.

### `signInWithEmail(email, password)`

Signs in with email and password. Returns `AuthUser`.

### `signUpWithEmail(email, password)`

Creates a new user with email and password. Returns `AuthUser`.

### `signOut()`

Signs out the current user.

### `resetPassword(email)`

Sends a password reset email.

---

## Usage Examples

### Basic — local state only

```tsx
import { useAuth, useGoogleSignIn, signOut } from "@pnpm-monorepo/auth-mobile";

export function LoginScreen() {
  const { user, loading } = useAuth();
  const { signInWithGoogle, loading: googleLoading, error } = useGoogleSignIn();

  if (loading) return <ActivityIndicator />;
  if (user) return <Text>Welcome, {user.displayName}</Text>;

  return (
    <>
      {error && <Text>{error}</Text>}
      <Button
        title="Sign in with Google"
        onPress={signInWithGoogle}
        disabled={googleLoading}
      />
      <Button title="Sign Out" onPress={signOut} />
    </>
  );
}
```

---

### With Redux

This package is Redux-free. To integrate with Redux, create a slice and a wrapper hook in your app.

**1. Create the auth slice:**

```ts
// features/auth/authSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface SerializableUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
}

interface AuthState {
  user: SerializableUser | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  loading: true,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<SerializableUser | null>) {
      state.user = action.payload;
      state.loading = false;
      state.error = null;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
      state.loading = false;
    },
    clearAuth(state) {
      state.user = null;
      state.loading = false;
      state.error = null;
    },
  },
});

export const { setUser, setLoading, setError, clearAuth } = authSlice.actions;
export default authSlice.reducer;
```

**2. Create a wrapper hook that bridges the package with Redux:**

```ts
// features/auth/useAuthWithRedux.ts
import { useEffect, useCallback } from "react";
import {
  useAuth,
  useGoogleSignIn,
  useMicrosoftSignIn,
  signOut as firebaseSignOut,
} from "@pnpm-monorepo/auth-mobile";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setUser, setError, clearAuth } from "./authSlice";
import type { AuthUser } from "@pnpm-monorepo/auth-mobile";

function toSerializable(user: AuthUser) {
  return {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,
    emailVerified: user.emailVerified,
  };
}

export function useAuthWithRedux() {
  const dispatch = useAppDispatch();
  const { user: reduxUser, loading, error } = useAppSelector((s) => s.auth);

  // Sync firebase auth state → Redux
  const { user: firebaseUser } = useAuth();

  useEffect(() => {
    dispatch(setUser(firebaseUser ? toSerializable(firebaseUser) : null));
  }, [firebaseUser, dispatch]);

  // Google
  const {
    signInWithGoogle,
    loading: googleLoading,
    error: googleError,
  } = useGoogleSignIn();

  const handleGoogleSignIn = useCallback(async () => {
    dispatch(setError(null));
    await signInWithGoogle();
    if (googleError) dispatch(setError(googleError));
  }, [signInWithGoogle, googleError, dispatch]);

  // Microsoft
  const {
    signInWithMicrosoft,
    loading: msLoading,
    error: msError,
  } = useMicrosoftSignIn();

  const handleMicrosoftSignIn = useCallback(async () => {
    dispatch(setError(null));
    await signInWithMicrosoft();
    if (msError) dispatch(setError(msError));
  }, [signInWithMicrosoft, msError, dispatch]);

  // Sign out
  const handleSignOut = useCallback(async () => {
    await firebaseSignOut();
    dispatch(clearAuth());
  }, [dispatch]);

  return {
    user: reduxUser,
    loading: loading || googleLoading || msLoading,
    error,
    signInWithGoogle: handleGoogleSignIn,
    signInWithMicrosoft: handleMicrosoftSignIn,
    signOut: handleSignOut,
  };
}
```

**3. Use it in your screen:**

```tsx
// screens/LoginScreen.tsx
import { useAuthWithRedux } from "@/features/auth/useAuthWithRedux";

export function LoginScreen() {
  const {
    user,
    loading,
    error,
    signInWithGoogle,
    signInWithMicrosoft,
    signOut,
  } = useAuthWithRedux();

  if (loading) return <ActivityIndicator />;
  if (user) {
    return (
      <>
        <Text>Welcome, {user.displayName}</Text>
        <Button title="Sign Out" onPress={signOut} />
      </>
    );
  }

  return (
    <>
      {error && <Text style={{ color: "red" }}>{error}</Text>}
      <Button title="Sign in with Google" onPress={signInWithGoogle} />
      <Button title="Sign in with Microsoft" onPress={signInWithMicrosoft} />
    </>
  );
}
```

---

### With Zustand

```ts
// store/authStore.ts
import { create } from "zustand";

interface AuthStore {
  user: {
    uid: string;
    email: string | null;
    displayName: string | null;
  } | null;
  error: string | null;
  setUser: (user: AuthStore["user"]) => void;
  setError: (error: string | null) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  error: null,
  setUser: (user) => set({ user }),
  setError: (error) => set({ error }),
  clearAuth: () => set({ user: null, error: null }),
}));
```

```ts
// features/auth/useAuthWithZustand.ts
import { useEffect } from "react";
import { useAuth, useGoogleSignIn } from "@pnpm-monorepo/auth-mobile";
import { useAuthStore } from "@/store/authStore";

export function useAuthWithZustand() {
  const { user: firebaseUser } = useAuth();
  const { setUser, clearAuth } = useAuthStore();
  const { signInWithGoogle } = useGoogleSignIn();

  useEffect(() => {
    if (firebaseUser) {
      setUser({
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName,
      });
    } else {
      clearAuth();
    }
  }, [firebaseUser]);

  return { signInWithGoogle };
}
```

---

## Protected Routes (Expo Router)

```tsx
// app/_layout.tsx
import { useEffect } from "react";
import { useSegments, useRouter } from "expo-router";
import { useAuth } from "@pnpm-monorepo/auth-mobile";

export default function RootLayout() {
  const { user, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === "(auth)";

    if (!user && !inAuthGroup) {
      router.replace("/(auth)/login");
    } else if (user && inAuthGroup) {
      router.replace("/(app)/home");
    }
  }, [user, loading, segments]);

  return <Slot />;
}
```

---

## Peer Dependencies

| Package             | Version |
| ------------------- | ------- |
| `react`             | `*`     |
| `react-native`      | `*`     |
| `expo-auth-session` | `*`     |
| `expo-web-browser`  | `*`     |

Make sure these are installed in your app.

---

## Using the Firebase Token with Your Backend API

After a successful sign-in, Firebase provides an `idToken` (JWT). Send this as a `Bearer` token to your backend API. Firebase automatically refreshes the token when it expires (tokens last 1 hour).

> **Never cache the token yourself.** Always call `getIdToken()` fresh — it handles expiry internally.

---

### Getting the token

```ts
import { firebaseAuth } from "@pnpm-monorepo/auth-mobile";

const token = await firebaseAuth.currentUser?.getIdToken();
// or force refresh:
const freshToken = await firebaseAuth.currentUser?.getIdToken(true);
```

---

### Option A — One-off fetch utility (simplest)

```ts
// lib/api.ts
import { firebaseAuth } from "@pnpm-monorepo/auth-mobile";

export async function fetchWithAuth(url: string, options?: RequestInit) {
  const token = await firebaseAuth.currentUser?.getIdToken();

  return fetch(url, {
    ...options,
    headers: {
      ...options?.headers,
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
}
```

```ts
// usage anywhere in your app
import { fetchWithAuth } from "@/lib/api";

const response = await fetchWithAuth("https://your-api.com/profile");
const data = await response.json();
```

---

### Option B — Axios interceptor (recommended)

Set up once and the token is attached to every request automatically.

```ts
// lib/apiClient.ts
import axios from "axios";
import { firebaseAuth } from "@pnpm-monorepo/auth-mobile";

export const apiClient = axios.create({
  baseURL: "https://your-api.com",
});

// Attach token to every request
apiClient.interceptors.request.use(async (config) => {
  const token = await firebaseAuth.currentUser?.getIdToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401s globally — e.g. token revoked on backend
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await firebaseAuth.signOut();
      // redirect to login if needed
    }
    return Promise.reject(error);
  },
);
```

```ts
// usage anywhere in your app
import { apiClient } from "@/lib/apiClient";

const { data } = await apiClient.get("/profile");
const { data } = await apiClient.post("/posts", { title: "Hello" });
```

---

### Option C — With Redux + RTK Query

If you are using Redux Toolkit Query, add the token in `prepareHeaders`:

```ts
// store/api.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { firebaseAuth } from "@pnpm-monorepo/auth-mobile";

export const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: "https://your-api.com",
    prepareHeaders: async (headers) => {
      const token = await firebaseAuth.currentUser?.getIdToken();
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getProfile: builder.query<Profile, void>({
      query: () => "/profile",
    }),
    createPost: builder.mutation<Post, Partial<Post>>({
      query: (body) => ({ url: "/posts", method: "POST", body }),
    }),
  }),
});

export const { useGetProfileQuery, useCreatePostMutation } = api;
```

---

### Backend verification (Node.js example)

Your backend should verify the token using the Firebase Admin SDK:

```ts
import * as admin from "firebase-admin";

async function verifyToken(req, res, next) {
  const token = req.headers.authorization?.split("Bearer ")[1];
  if (!token) return res.status(401).json({ error: "No token provided" });

  try {
    const decoded = await admin.auth().verifyIdToken(token);
    req.user = decoded; // { uid, email, ... }
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
}
```

---

### Summary

| Approach                   | Best for                         |
| -------------------------- | -------------------------------- |
| `fetchWithAuth`            | Simple apps, one-off calls       |
| Axios interceptor          | Most apps, recommended           |
| RTK Query `prepareHeaders` | Apps already using Redux Toolkit |
