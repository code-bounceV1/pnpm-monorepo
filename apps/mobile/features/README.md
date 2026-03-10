# Features Structure

This document describes the feature-based architecture of the mobile app.

## Overview

All feature-related code (screens, components, hooks, etc.) now lives within the `features/` directory. The `app/` directory only contains route files that re-export the actual screen components from features.

## Structure

```
features/
  <feature-name>/
    components/     # Feature-specific UI components
    screens/        # Screen components for this feature
    hooks/          # Feature-specific hooks (optional)
    slices/         # Redux slices (optional)
    utils/          # Feature utilities (optional)
    types.ts        # TypeScript types (optional)
    mock.ts         # Mock data (optional)
```

## Current Features

### 1. **home**

- Screens: `home-screen.tsx`
- Routes: `app/(tabs)/index.tsx`

## Route Files

All route files in the `app/` directory now simply re-export from the feature screens:

```tsx
// Example: app/(tabs)/index.tsx
export { default } from "@/features/home/screens/home-screen";
```

This keeps the Expo Router file-based routing structure intact while organizing all logic in features.

## Benefits

1. **Co-location**: All code related to a feature is in one place
2. **Reusability**: Screens can be easily reused or tested independently
3. **Maintainability**: Clear separation of routing (app/) from business logic (features/)
4. **Scalability**: Easy to add new features following the same pattern

## Adding a New Feature

1. Create a new feature directory: `features/my-feature/`
2. Add subdirectories: `components/`, `screens/`, etc.
3. Create your screen component in `screens/my-screen.tsx`
4. Export from `screens/index.ts`
5. Create route file in `app/` that re-exports: `export { default } from '@/features/my-feature/screens/my-screen';`
