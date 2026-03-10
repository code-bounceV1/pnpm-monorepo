import { View, Pressable, useWindowDimensions } from "react-native";
import React, { useState, useMemo, useCallback, useEffect } from "react";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  cancelAnimation,
  useAnimatedReaction,
  runOnJS,
} from "react-native-reanimated";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react-native";
import {
  startOfWeek,
  addWeeks,
  format,
  addDays,
  isToday,
  isSameDay,
  isWithinInterval,
  endOfWeek,
} from "date-fns";

const SCREEN_HORIZONTAL_PADDING = 32;
const CELL_GAP = 4;
const NUM_DAYS = 7;
const ANIMATION_DURATION = 250;

interface HorizontalCalendarProps {
  value?: Date;
  onChange?: (date: Date) => void;
}

const HorizontalCalendar = ({ value, onChange }: HorizontalCalendarProps) => {
  const { width: screenWidth } = useWindowDimensions();
  const [currentWeekStart, setCurrentWeekStart] = useState(
    startOfWeek(value || new Date(), { weekStartsOn: 1 }),
  );
  const [isAnimating, setIsAnimating] = useState(false);

  const selectedDate = value || new Date();

  const translateX = useSharedValue(0);
  const opacity = useSharedValue(1);
  // Shared value to signal animation completion back to JS thread
  const animationDone = useSharedValue(0);

  // Sync currentWeekStart when value changes and is outside the current week
  useEffect(() => {
    if (value) {
      const weekEnd = endOfWeek(currentWeekStart, { weekStartsOn: 1 });
      const isInCurrentWeek = isWithinInterval(value, {
        start: currentWeekStart,
        end: weekEnd,
      });

      if (!isInCurrentWeek) {
        setCurrentWeekStart(startOfWeek(value, { weekStartsOn: 1 }));
      }
    }
  }, [value]);

  // Watch animationDone on the UI thread and bridge back to JS state safely
  useAnimatedReaction(
    () => animationDone.value,
    (current, previous) => {
      if (current === 1 && previous === 0) {
        runOnJS(setIsAnimating)(false);
        animationDone.value = 0;
      }
    },
  );

  const cellWidth = useMemo(
    () =>
      (screenWidth - SCREEN_HORIZONTAL_PADDING - CELL_GAP * (NUM_DAYS - 1)) /
      NUM_DAYS,
    [screenWidth],
  );

  const days = useMemo(
    () =>
      Array.from({ length: NUM_DAYS }).map((_, idx) =>
        addDays(currentWeekStart, idx),
      ),
    [currentWeekStart],
  );

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
    opacity: opacity.value,
  }));

  const animateTransition = useCallback(
    (direction: "left" | "right") => {
      cancelAnimation(translateX);
      cancelAnimation(opacity);

      // Snap off-screen instantly
      translateX.value = direction === "left" ? -screenWidth : screenWidth;
      opacity.value = 0;

      // Slide in
      translateX.value = withTiming(0, {
        duration: ANIMATION_DURATION,
        easing: Easing.out(Easing.cubic),
      });

      // Fade in — signal JS when done via shared value (avoids runOnJS in callback)
      opacity.value = withTiming(
        1,
        { duration: ANIMATION_DURATION },
        (finished) => {
          if (finished) {
            animationDone.value = 1;
          }
        },
      );
    },
    [screenWidth, translateX, opacity, animationDone],
  );

  const handlePrevWeek = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentWeekStart((prev) => addWeeks(prev, -1));
    animateTransition("right");
  }, [isAnimating, animateTransition]);

  const handleNextWeek = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentWeekStart((prev) => addWeeks(prev, 1));
    animateTransition("left");
  }, [isAnimating, animateTransition]);

  return (
    <View className="gap-1">
      <View className="flex-row items-center justify-between mb-2">
        <Button
          variant="outline"
          size="icon"
          className="rounded-full size-7"
          onPress={handlePrevWeek}
          disabled={isAnimating}
          style={{ elevation: 1 }}
        >
          <Icon as={ChevronLeft} />
        </Button>
        <Text className="text-[#364153] text-sm font-outfit-bold">
          {format(selectedDate, "MMM dd, yyyy")}
          {isToday(selectedDate) && " (Today)"}
        </Text>
        <Button
          variant="outline"
          size="icon"
          className="rounded-full size-7"
          onPress={handleNextWeek}
          disabled={isAnimating}
          style={{ elevation: 1 }}
        >
          <Icon as={ChevronRight} />
        </Button>
      </View>

      <Animated.View
        style={[{ flexDirection: "row", gap: CELL_GAP }, animatedStyle]}
      >
        {days.map((day) => {
          const today = isToday(day);
          const selected = isSameDay(day, selectedDate);

          const containerClass = cn(
            "items-center justify-center rounded-2xl border",
            selected && "border-2 border-[#7B52AB] bg-[#7B52AB]",
            today && !selected && "bg-[#EED13F]/20 border-2 border-[#EED13F]",
            !selected && !today && "bg-white border-[#F0F0F0]",
          );

          const textClass = cn(
            "text-[10px] font-outfit-medium uppercase",
            selected ? "text-white" : "text-[#99A1AF]",
          );
          const dateClass = cn(
            "text-base font-outfit-bold",
            selected ? "text-white" : "text-[#4A5565]",
          );

          return (
            <Pressable
              key={format(day, "yyyy-MM-dd")}
              onPress={() => onChange?.(day)}
              className={containerClass}
              style={{ width: cellWidth, height: 69 }}
            >
              <Text className={textClass}>{format(day, "EEE")}</Text>
              <Text className={dateClass}>{format(day, "d")}</Text>
              {today && (
                <View
                  className={cn(
                    "h-1.5 w-1.5 rounded-full",
                    selected ? "bg-white" : "bg-[#EED13F]",
                  )}
                />
              )}
            </Pressable>
          );
        })}
      </Animated.View>
    </View>
  );
};

export { HorizontalCalendar };
