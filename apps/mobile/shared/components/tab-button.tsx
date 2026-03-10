import { TabTriggerSlotProps } from "expo-router/ui";
import { Pressable, View, StyleSheet } from "react-native";
import { cn, Text } from "@pnpm-monorepo/ui-mobile";
import { LucideIcon } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";

type TabButtonProps = TabTriggerSlotProps & {
  icon: LucideIcon;
  label: string;
};

export function TabButton({
  icon: Icon,
  label,
  isFocused,
  ...props
}: TabButtonProps) {
  return (
    <Pressable {...props} className="flex-1 pt-3 items-center justify-center">
      {isFocused && (
        <LinearGradient
          colors={["#724B9E66", "#724B9E00"]}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
      )}
      <View className="items-center justify-center gap-1 w-full">
        <Icon
          size={24}
          color={isFocused ? "#724B9E" : "#767676"}
          strokeWidth={isFocused ? 2.5 : 2}
        />
        <Text
          className={cn(
            "text-xs font-outfit-medium",
            isFocused ? "text-[#724B9E]" : "text-[#767676]",
          )}
        >
          {label}
        </Text>
      </View>
    </Pressable>
  );
}
