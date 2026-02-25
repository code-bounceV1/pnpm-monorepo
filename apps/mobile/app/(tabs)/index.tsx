import { View } from "react-native";
import React, { useEffect } from "react";
import { Button, Text } from "@pnpm-monorepo/ui-mobile";
import { appConfig } from "../../app-config";

const HomeScreen = () => {
  useEffect(() => {
    // Example: log config to verify
    console.log(
      "App Config",
      appConfig,
      appConfig.environment,
      appConfig.apiUrl,
    );
  }, []);
  return (
    <View>
      <Text>
        <Text variant="h1" className="text-red-300">
          The Rainbow Forest Adventure {appConfig.apiUrl}
        </Text>
      </Text>
      <Button variant="destructive">
        <Text>Button</Text>
      </Button>
    </View>
  );
};

export default HomeScreen;
