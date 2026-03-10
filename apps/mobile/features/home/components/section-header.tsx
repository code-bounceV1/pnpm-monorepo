import React from "react";
import { View } from "react-native";
import { useRouter, type Href } from "expo-router";

import { Badge, Button, Text } from "@pnpm-monorepo/ui-mobile";
import { ChevronRight } from "lucide-react-native";

export interface SectionHeaderProps {
  title: string;
  badge?: string;
  viewAllLabel?: string;
  /** Preferred: pass an onPress handler for the View All action. */
  onViewAllPress?: () => void;
  /** Convenience: navigate via expo-router if provided (used when onViewAllPress is not set). */
  href?: Href;
  /** Backward-compatible alias for href. Prefer href. */
  navigateTo?: Href;
  startIcon?: React.ReactNode;
}

export function SectionHeader({
  title,
  badge,
  viewAllLabel = "View All",
  onViewAllPress,
  href,
  navigateTo,
  startIcon,
}: SectionHeaderProps) {
  const router = useRouter();

  const target = href ?? navigateTo;
  const canAutoNavigate = typeof target === "string" && target.startsWith("/");

  const handleViewAllPress =
    onViewAllPress ??
    (canAutoNavigate ? () => router.push(target as Href) : undefined);

  return (
    <View className="flex-row items-center justify-between">
      <View className="flex-row items-center gap-2">
        {startIcon}
        <Text className="text-lg font-outfit-semibold text-[#101828]">
          {title}
        </Text>
        {badge ? (
          <Badge variant="outline" className="border-[#FFC9C9] bg-[#FFE2E2]">
            <Text className="text-[#E7000B] text-[10px] font-outfit-bold">
              {badge}
            </Text>
          </Badge>
        ) : null}
      </View>

      <Button
        variant="link"
        disabled={!handleViewAllPress}
        onPress={handleViewAllPress}
        className="h-min gap-0.5 px-0"
      >
        <Text className="text-[#4F39F6] text-xs font-outfit-bold">
          {viewAllLabel}
        </Text>
        <ChevronRight size={14} color="#4F39F6" />
      </Button>
    </View>
  );
}
