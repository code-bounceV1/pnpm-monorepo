import { View } from "react-native";
import React from "react";
import { Button, Text } from "@pnpm-monorepo/ui-mobile";

const HomeScreen = () => {
  return (
    <View>
      <Text>
        <Text variant="h1" className="text-red-300">
          The Rainbow Forest Adventure
        </Text>
      </Text>
      <Button variant="destructive">
        <Text>Button</Text>
      </Button>
    </View>
  );
};

export default HomeScreen;
