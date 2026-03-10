// apps/my-app/store/index.ts
import { createAppStore } from "@pnpm-monorepo/store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import authReducer from "@/features/auth/slices/authSlice";

export const { store, persistor } = createAppStore({
  slices: {
    auth: {
      reducer: authReducer,
      persist: { storage: AsyncStorage, whitelist: ["user"] },
    },
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
