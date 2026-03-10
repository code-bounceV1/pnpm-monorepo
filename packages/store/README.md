# @pnpm-monorepo/store

Shared Redux store package for the monorepo. Contains shared slices and a `createAppStore` factory that apps can extend with their own slices and optional per-slice persist configs.

---

## Folder Structure

```
packages/store/
├── index.ts
├── package.json
├── tsconfig.json
├── README.md
└── src/
    ├── index.ts
    ├── store.ts          # createAppStore factory + base types
    ├── hooks.ts          # createStoreHooks factory
    └── slices/
        ├── index.ts
        └── alertSlice.ts # loading, error, warning, success state
```

---

## Installation

```json
{
  "dependencies": {
    "@pnpm-monorepo/store": "workspace:*"
  }
}
```

```bash
pnpm install
```

---

## Setup in your app

### 1. Create your app store

```ts
// apps/my-app/store/index.ts
import { createAppStore } from "@pnpm-monorepo/store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import authReducer from "@/features/auth/slices/authSlice";
import bookingReducer from "@/features/booking/bookingSlice";

export const { store, persistor } = createAppStore({
  slices: {
    auth: {
      reducer: authReducer,
      persist: {
        storage: AsyncStorage,
        whitelist: ["user"], // only persist user, not loading/error
      },
    },
    booking: {
      reducer: bookingReducer,
      persist: {
        storage: AsyncStorage,
        whitelist: ["selectedDate"],
      },
    },
    notifications: {
      reducer: notificationsReducer,
      // no persist — transient state
    },
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

---

### 2. Create typed hooks

Pass the `store` instance to `createStoreHooks` — types are inferred automatically, no manual `RootState` or `AppDispatch` declarations needed.

```ts
// apps/my-app/store/hooks.ts
import { createStoreHooks } from "@pnpm-monorepo/store";
import { store } from "./index";

export const { useAppDispatch, useAppSelector } = createStoreHooks(store);
```

---

### 3. Wrap your app with Provider + PersistGate

```tsx
// apps/my-app/app/_layout.tsx
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "@/store";

export default function RootLayout() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Slot />
      </PersistGate>
    </Provider>
  );
}
```

---

### 4. Use in components

Always import hooks from your app's `store/hooks.ts` for full autocomplete across all slices.

```tsx
// ✅ full autocomplete — knows about auth, alert, booking etc.
import { useAppDispatch, useAppSelector } from "@/store/hooks";

// shared slice actions from the package
import {
  setLoading,
  setError,
  setSuccess,
  clearAlerts,
} from "@pnpm-monorepo/store";

export function MyComponent() {
  const dispatch = useAppDispatch();

  // shared slice — autocompletes
  const { isLoading, alerts } = useAppSelector((s) => s.alert);

  // app slice — autocompletes
  const { user } = useAppSelector((s) => s.auth);
  const { selectedDate } = useAppSelector((s) => s.booking);

  const handleSubmit = async () => {
    dispatch(setLoading(true));
    try {
      await myApi.save();
      dispatch(setSuccess("Saved!"));
    } catch (err: any) {
      dispatch(setError(err.message));
    }
  };

  return (
    <>
      {isLoading && <ActivityIndicator />}
      {alerts.map((alert) => (
        <Text key={alert.id}>{alert.message}</Text>
      ))}
      <Button onPress={handleSubmit} title="Save" />
    </>
  );
}
```

---

## Shared Slices

### `alertSlice`

Manages global loading, error, warning, and success state. Always transient — never persisted.

**State shape:**

```ts
{
  alert: {
    isLoading: boolean;
    alerts: Array<{
      id: string;
      type: "error" | "warning" | "success";
      message: string;
    }>;
  }
}
```

**Actions:**

```ts
import {
  setLoading, // setLoading(true/false)
  setError, // setError('Something went wrong')
  setWarning, // setWarning('Session expiring soon')
  setSuccess, // setSuccess('Saved successfully')
  addAlert, // addAlert({ type: 'error', message: '...' })
  removeAlert, // removeAlert('alert-id')
  clearAlerts, // clearAlerts()
} from "@pnpm-monorepo/store";
```

---

## SliceConfig API

| Field               | Type       | Required      | Description                                 |
| ------------------- | ---------- | ------------- | ------------------------------------------- |
| `reducer`           | `Reducer`  | ✅            | Your slice reducer                          |
| `persist.storage`   | `Storage`  | ✅ if persist | Storage engine e.g. `AsyncStorage`, `MMKV`  |
| `persist.whitelist` | `string[]` | ❌            | Only persist these state keys               |
| `persist.blacklist` | `string[]` | ❌            | Exclude these state keys from persist       |
| `persist.key`       | `string`   | ❌            | Custom storage key (defaults to slice name) |

---

## Rules

| Thing                              | Where to import from             |
| ---------------------------------- | -------------------------------- |
| `createAppStore`                   | `@pnpm-monorepo/store`           |
| `createStoreHooks`                 | `@pnpm-monorepo/store`           |
| Slice actions (`setError`, etc.)   | `@pnpm-monorepo/store`           |
| `useAppDispatch`, `useAppSelector` | `@/store/hooks` (your app hooks) |
| `RootState`, `AppDispatch`         | `@/store` (your app store)       |
