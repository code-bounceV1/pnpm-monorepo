import React from "react";
import { ScrollView } from "react-native";
import { type Edge, SafeAreaView } from "react-native-safe-area-context";
import { cn } from "@pnpm-monorepo/ui-mobile";

const Screen = ({
  children,
  enableScroll = false,
  edges = ["top", "left", "right"],
  className,
  scrollViewClassName,
}: {
  children: React.ReactNode;
  enableScroll?: boolean;
  edges?: Edge[];
  className?: string;
  scrollViewClassName?: string;
}) => {
  if (enableScroll)
    return (
      <SafeAreaView
        className={cn("flex-1 bg-[#F9F8F6]", className)}
        edges={edges}
      >
        <ScrollView className={cn("flex-1 px-4", scrollViewClassName)}>
          {children}
        </ScrollView>
      </SafeAreaView>
    );

  return (
    <SafeAreaView
      className={cn("flex-1 bg-[#F9F8F6] px-4", className)}
      edges={edges}
    >
      {children}
    </SafeAreaView>
  );
};

export default Screen;
