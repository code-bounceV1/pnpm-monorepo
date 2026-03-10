import { cn } from "@pnpm-monorepo/ui-mobile";
import React, { useRef, useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
  Platform,
} from "react-native";
import type PagerViewType from "react-native-pager-view";
import PagerView from "./pager-view";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export interface Tab {
  key: string;
  label: string;
  icon?: React.ReactNode;
  badge?: number;
  component?: React.ReactNode;
}

export interface TabPagerViewProps {
  tabs: Tab[];
  renderScene?: (tab: Tab, index: number) => React.ReactNode;
  initialIndex?: number;
  onTabChange?: (index: number, tab: Tab) => void;
  /** Minimum tab button width in px */
  tabMinWidth?: number;
  /** Toggle dark mode */
  dark?: boolean;
  /** className for the root container */
  className?: string;
  /**
   * className for the tab bar wrapper (the outermost bar View).
   * Useful for overriding background, border, shadow, elevation.
   * @example tabBarClassName="bg-blue-900 border-blue-700"
   */
  tabBarClassName?: string;
  /**
   * className for the horizontal ScrollView content container
   * that holds all the tab triggers (the "list" of tabs).
   * Useful for overriding padding, gap, alignment.
   * @example tabBarListClassName="px-2 gap-1"
   */
  tabBarListClassName?: string;
  /**
   * className applied to every tab trigger TouchableOpacity.
   * Useful for overriding padding, border-radius, background.
   * @example tabBarTriggerClassName="rounded-full px-4 py-2"
   */
  tabBarTriggerClassName?: string;
  /**
   * className applied to the active tab trigger.
   * Merged on top of tabBarTriggerClassName.
   * @example tabBarTriggerActiveClassName="bg-violet-100"
   */
  tabBarTriggerActiveClassName?: string;
  /**
   * className for the tab label Text.
   * @example tabBarLabelClassName="text-sm uppercase tracking-widest"
   */
  tabBarLabelClassName?: string;
  /**
   * className for the active tab label Text.
   * Merged on top of tabBarLabelClassName.
   */
  tabBarLabelActiveClassName?: string;
  /**
   * className for the sliding indicator bar.
   * Note: width/translateX are always animated via inline style —
   * only visual overrides like bg-*, h-*, rounded-* work here.
   * @example tabBarIndicatorClassName="bg-blue-500 h-1 rounded-none"
   */
  tabBarIndicatorClassName?: string;
}

// ─── Tab Bar ──────────────────────────────────────────────────────────────────

interface TabBarProps extends Pick<
  TabPagerViewProps,
  | "tabBarClassName"
  | "tabBarListClassName"
  | "tabBarTriggerClassName"
  | "tabBarTriggerActiveClassName"
  | "tabBarLabelClassName"
  | "tabBarLabelActiveClassName"
  | "tabBarIndicatorClassName"
> {
  tabs: Tab[];
  activeIndex: number;
  onTabPress: (index: number) => void;
  tabMinWidth: number;
  dark: boolean;
}

const TabBar: React.FC<TabBarProps> = ({
  tabs,
  activeIndex,
  onTabPress,
  tabMinWidth,
  dark,
  tabBarClassName,
  tabBarListClassName,
  tabBarTriggerClassName,
  tabBarTriggerActiveClassName,
  tabBarLabelClassName,
  tabBarLabelActiveClassName,
}) => {
  const scrollViewRef = useRef<ScrollView>(null);
  const tabWidths = useRef<number[]>([]);
  const tabOffsets = useRef<number[]>([]);

  const indicatorX = useRef(new Animated.Value(0)).current;
  const indicatorW = useRef(new Animated.Value(tabMinWidth)).current;
  const indicatorOpacity = useRef(new Animated.Value(0)).current;

  const scrollToTab = useCallback(
    (index: number) => {
      // Wait a frame to ensure layout is measured
      requestAnimationFrame(() => {
        const x = tabOffsets.current[index];
        const w = tabWidths.current[index];

        // Only scroll if we have valid layout data
        if (x !== undefined && w !== undefined) {
          scrollViewRef.current?.scrollTo({
            x: Math.max(0, x - SCREEN_WIDTH / 2 + w / 2),
            animated: true,
          });
        }
      });
    },
    [tabMinWidth],
  );

  const animateIndicator = useCallback(
    (index: number) => {
      // Wait a frame to ensure layout is measured
      requestAnimationFrame(() => {
        const x = tabOffsets.current[index];
        const w = tabWidths.current[index];

        // Only animate if we have valid layout data
        if (x !== undefined && w !== undefined) {
          Animated.parallel([
            Animated.spring(indicatorX, {
              toValue: x,
              useNativeDriver: false,
              tension: 70,
              friction: 10,
            }),
            Animated.spring(indicatorW, {
              toValue: w,
              useNativeDriver: false,
              tension: 70,
              friction: 10,
            }),
            Animated.timing(indicatorOpacity, {
              toValue: 1,
              duration: 120,
              useNativeDriver: false,
            }),
          ]).start();
        }
      });
    },
    [indicatorX, indicatorW, indicatorOpacity, tabMinWidth],
  );

  const handleLayout = useCallback(
    (index: number, x: number, width: number) => {
      tabOffsets.current[index] = x;
      tabWidths.current[index] = width;
      if (index === activeIndex) {
        indicatorX.setValue(x);
        indicatorW.setValue(width);
        indicatorOpacity.setValue(1);
      }
    },
    [activeIndex, indicatorX, indicatorW, indicatorOpacity],
  );

  const handlePress = useCallback(
    (index: number) => {
      onTabPress(index);
      scrollToTab(index);
      animateIndicator(index);
    },
    [onTabPress, scrollToTab, animateIndicator],
  );

  React.useEffect(() => {
    scrollToTab(activeIndex);
    animateIndicator(activeIndex);
  }, [activeIndex, scrollToTab, animateIndicator]);

  return (
    /* ── Tab Bar wrapper ── */
    <View
      className={cn(
        "border-b shadow-sm h-10 rounded-lg overflow-hidden",
        dark ? "bg-zinc-900 border-zinc-800" : "bg-white border-zinc-200",
        tabBarClassName,
      )}
    >
      {/* ── Tab Bar List (scrollable row of triggers) ── */}
      <ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        bounces={false}
        contentContainerStyle={{ alignItems: "stretch" }}
        contentContainerClassName={cn(tabBarListClassName)}
      >
        {tabs.map((tab, index) => {
          const isActive = index === activeIndex;

          return (
            <React.Fragment key={tab.key}>
              {/* ── Tab Bar Trigger ── */}
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => handlePress(index)}
                onLayout={(e) => {
                  const { x, width } = e.nativeEvent.layout;
                  handleLayout(index, x, width);
                }}
                style={{
                  minWidth: tabMinWidth,
                  ...(isActive && { backgroundColor: "#B83F5C" }),
                }}
                className={cn(
                  // base trigger styles
                  "flex-row items-center justify-center h-full px-3",
                  tabBarTriggerClassName,
                  // active override
                  isActive && tabBarTriggerActiveClassName,
                )}
                accessibilityRole="tab"
                accessibilityState={{ selected: isActive }}
              >
                {/* Icon */}
                {tab.icon && (
                  <View className="mr-1.5">
                    {React.isValidElement(tab.icon)
                      ? React.cloneElement(
                        tab.icon as React.ReactElement<any>,
                        {
                          color: isActive
                            ? "#ffffff"
                            : dark
                              ? "#71717a"
                              : "#a1a1aa",
                        },
                      )
                      : tab.icon}
                  </View>
                )}

                {/* ── Tab Bar Label ── */}
                <Text
                  numberOfLines={1}
                  style={{ letterSpacing: 0.4 }}
                  className={cn(
                    // base label styles
                    "text-xs",
                    // default theme colors & weights (can be overridden by user)
                    isActive
                      ? "text-white"
                      : dark
                        ? "text-zinc-500"
                        : "text-zinc-400",
                    // user base styles (applies to all labels)
                    tabBarLabelClassName,
                    // user active override (applies only when active, highest priority)
                    isActive && tabBarLabelActiveClassName,
                  )}
                >
                  {tab.label}
                </Text>

                {/* ── Badge ── */}
                {tab.badge != null && tab.badge > 0 && (
                  <View
                    className={cn(
                      "ml-1.5 min-w-[16px] h-4 rounded-full items-center justify-center px-1",
                      isActive
                        ? "bg-white/30"
                        : dark
                          ? "bg-zinc-700"
                          : "bg-zinc-300",
                    )}
                  >
                    <Text
                      className={cn(
                        "font-semibold",
                        isActive
                          ? "text-white"
                          : dark
                            ? "text-zinc-400"
                            : "text-zinc-600",
                      )}
                      style={{ fontSize: 10, lineHeight: 14 }}
                    >
                      {tab.badge > 99 ? "99+" : tab.badge}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>

              {/* Separator — uses alignSelf stretch via parent alignItems:stretch */}
              {index < tabs.length - 1 && (
                <View
                  className={cn(
                    "w-[1px] self-stretch",
                    dark ? "bg-zinc-700" : "bg-zinc-300",
                  )}
                />
              )}
            </React.Fragment>
          );
        })}
      </ScrollView>
    </View>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

export const TabPagerView: React.FC<TabPagerViewProps> = ({
  tabs,
  renderScene,
  initialIndex = 0,
  onTabChange,
  tabMinWidth = 100,
  dark = false,
  className,
  tabBarClassName,
  tabBarListClassName,
  tabBarTriggerClassName,
  tabBarTriggerActiveClassName,
  tabBarLabelClassName,
  tabBarLabelActiveClassName,
  tabBarIndicatorClassName,
}) => {
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const pagerRef = useRef<PagerViewType>(null);

  const handleTabPress = useCallback(
    (index: number) => {
      pagerRef.current?.setPage(index);
      setActiveIndex(index);
      onTabChange?.(index, tabs[index]);
    },
    [tabs, onTabChange],
  );

  const handlePageSelected = useCallback(
    (e: { nativeEvent: { position: number } }) => {
      const index = e.nativeEvent.position;
      setActiveIndex(index);
      onTabChange?.(index, tabs[index]);
    },
    [tabs, onTabChange],
  );

  return (
    <View
      className={cn("flex-1", dark ? "bg-zinc-950" : "bg-zinc-50", className)}
    >
      <TabBar
        tabs={tabs}
        activeIndex={activeIndex}
        onTabPress={handleTabPress}
        tabMinWidth={tabMinWidth}
        dark={dark}
        tabBarClassName={tabBarClassName}
        tabBarListClassName={tabBarListClassName}
        tabBarTriggerClassName={tabBarTriggerClassName}
        tabBarTriggerActiveClassName={tabBarTriggerActiveClassName}
        tabBarLabelClassName={tabBarLabelClassName}
        tabBarLabelActiveClassName={tabBarLabelActiveClassName}
        tabBarIndicatorClassName={tabBarIndicatorClassName}
      />

      <PagerView
        ref={pagerRef}
        style={{ flex: 1 }}
        initialPage={initialIndex}
        onPageSelected={handlePageSelected}
        overdrag
      >
        {tabs.map((tab, index) => (
          <View key={tab.key} className="flex-1">
            {tab.component ?? renderScene?.(tab, index)}
          </View>
        ))}
      </PagerView>
    </View>
  );
};

export default TabPagerView;
