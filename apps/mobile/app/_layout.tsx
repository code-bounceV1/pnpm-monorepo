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
import { useColorScheme } from "react-native";
import { PortalHost } from "@rn-primitives/portal";

const LIGHT_THEME: Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    ...NAV_THEME.light,
  },
};
const DARK_THEME: Theme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    ...NAV_THEME.dark,
  },
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <ThemeProvider value={false ? DARK_THEME : LIGHT_THEME}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style={isDark ? "light" : "dark"} />
      <PortalHost />
    </ThemeProvider>
  );
}
