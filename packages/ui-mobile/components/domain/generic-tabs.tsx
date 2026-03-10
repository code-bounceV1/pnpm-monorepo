import React from "react";
import { Text } from "@/components/ui/text";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

export type TabVariant = "default" | "yellow";

export interface TabItem {
  label: string;
  value: string;
  tabContent: React.ReactNode;
}

interface GenericTabsProps {
  tabs: TabItem[];
  value: string;
  onChange: (value: string) => void;
  variant?: TabVariant;
  className?: string;
}

const variantStyles: Record<
  TabVariant,
  {
    list: string;
    trigger: (isActive: boolean) => string;
    text: string;
  }
> = {
  default: {
    list: "bg-muted h-9 rounded-lg p-[3px]",
    trigger: (isActive) =>
      cn(
        "flex-1 h-full rounded-md",
        isActive
          ? "bg-background dark:border-foreground/10 dark:bg-input/30"
          : "",
      ),
    text: "text-sm font-medium text-foreground dark:text-muted-foreground",
  },
  yellow: {
    list: "bg-white dark:bg-white h-14 rounded-2xl border px-3 border-[#F3F4F6] dark:border-[#F3F4F6]",
    trigger: (isActive) =>
      cn(
        "flex-1 h-10 rounded-2xl",
        isActive ? "bg-[#EED13F] dark:bg-[#EED13F]" : "",
      ),
    text: "text-base font-outfit-bold text-[#1F1F1F] dark:text-[#1F1F1F]",
  },
};

export const GenericTabs: React.FC<GenericTabsProps> = ({
  tabs,
  value,
  onChange,
  variant = "default",
  className,
}) => {
  const styles = variantStyles[variant];

  return (
    <Tabs
      value={value}
      onValueChange={onChange}
      className={cn("flex-1", className)}
    >
      <TabsList
        style={variant === "yellow" ? { elevation: 1 } : undefined}
        className={styles.list}
      >
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            className={styles.trigger(value === tab.value)}
          >
            <Text className={styles.text}>{tab.label}</Text>
          </TabsTrigger>
        ))}
      </TabsList>

      {tabs.map((tab) => (
        <TabsContent key={tab.value} value={tab.value} className="flex-1">
          {tab.tabContent}
        </TabsContent>
      ))}
    </Tabs>
  );
};
