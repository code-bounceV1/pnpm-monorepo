import "@pnpm-monorepo/ui-mobile/global.css";
import { NAV_THEME } from "@pnpm-monorepo/ui-mobile";
import {
  DarkTheme,
  DefaultTheme,
  type Theme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import { PortalHost } from "@rn-primitives/portal";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";

import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "@/store";
import {
  asyncStoragePersister,
  queryClient,
} from "@/shared/lib/tanstack-react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { usePreventScreenCapture } from "expo-screen-capture";

SplashScreen.preventAutoHideAsync();

const LIGHT_THEME: Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    ...NAV_THEME.light.colors,
  },
};
const DARK_THEME: Theme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    ...NAV_THEME.dark.colors,
  },
};

const MainScreen = () => {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
};

export default function RootLayout() {
  // const colorScheme = useColorScheme();
  const isDark = false; // Always use light theme by default
  usePreventScreenCapture();

  const [fontsLoaded, fontError] = useFonts({
    "Outfit-Regular": require("../assets/fonts/outfit/Outfit-Regular.ttf"),
    "Outfit-Medium": require("../assets/fonts/outfit/Outfit-Medium.ttf"),
    "Outfit-Bold": require("../assets/fonts/outfit/Outfit-Bold.ttf"),
    "Outfit-SemiBold": require("../assets/fonts/outfit/Outfit-SemiBold.ttf"),
    "Outfit-ExtraBold": require("../assets/fonts/outfit/Outfit-ExtraBold.ttf"),
    "Outfit-Black": require("../assets/fonts/outfit/Outfit-Black.ttf"),
    "Outfit-Light": require("../assets/fonts/outfit/Outfit-Light.ttf"),
    "Outfit-Thin": require("../assets/fonts/outfit/Outfit-Thin.ttf"),
    "Outfit-ExtraLight": require("../assets/fonts/outfit/Outfit-ExtraLight.ttf"),
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) return null;

  return (
    <View style={{ flex: 1 }}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <ThemeProvider value={isDark ? DARK_THEME : LIGHT_THEME}>
            <PersistQueryClientProvider
              client={queryClient}
              persistOptions={{
                persister: asyncStoragePersister,
                maxAge: 1000 * 60 * 60 * 24, // 24 hours
                dehydrateOptions: {
                  shouldDehydrateQuery: (query) => query.meta?.persist === true,
                },
              }}
            >
              <MainScreen />
              <StatusBar style={isDark ? "light" : "dark"} />
              <PortalHost />
            </PersistQueryClientProvider>
          </ThemeProvider>
        </PersistGate>
      </Provider>
    </View>
  );
}
