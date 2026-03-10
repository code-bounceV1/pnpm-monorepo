import {
  QueryClient,
  focusManager,
  onlineManager,
} from "@tanstack/react-query";
import NetInfo from "@react-native-community/netinfo";
import type { AppStateStatus } from "react-native";
import { AppState } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
// Handle network reconnect
onlineManager.setEventListener((setOnline) => {
  return NetInfo.addEventListener((state) => {
    setOnline(!!state.isConnected);
  });
});

// Handle app foreground/background
focusManager.setEventListener((handleFocus) => {
  const subscription = AppState.addEventListener(
    "change",
    (state: AppStateStatus) => {
      handleFocus(state === "active");
    },
  );

  return () => subscription.remove();
});

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 60 * 24, // keep cache longer
      refetchOnMount: false, // prevents unnecessary refetch
      refetchOnReconnect: true,
    },
    mutations: {
      retry: 0,
    },
  },
});

export const asyncStoragePersister = createAsyncStoragePersister({
  storage: AsyncStorage,
});
