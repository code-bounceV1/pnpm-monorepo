import { FlatList, View } from "react-native";
import React from "react";
import { useMemo, useState } from "react";
import { SectionHeader } from "./section-header";
import DiaryCard from "@/features/diary/components/diary-card";
import EmptyList from "@/features/diary/components/empty-list";
import { Button, Text } from "@pnpm-monorepo/ui-mobile";

const Diaries = () => {
  const [showAll, setShowAll] = useState(false);

  const homeworkData = new Array(6)
    .fill(0)
    .map((_, idx) => ({ id: `hw-${idx}` }));

  const visibleData = useMemo(() => {
    if (showAll) return homeworkData;
    return homeworkData.slice(0, 2);
  }, [homeworkData, showAll]);

  const canShowMore = !showAll && homeworkData.length > 2;

  return (
    <View className="gap-3">
      <SectionHeader title="Diaries" href="/(tabs)/diary" />
      <FlatList
        data={visibleData}
        keyExtractor={(item) => item.id}
        renderItem={() => <DiaryCard />}
        scrollEnabled={false}
        removeClippedSubviews={false}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View className="h-3" />}
        ListFooterComponent={<View className="h-3" />}
        ListEmptyComponent={<EmptyList />}
      />
      {canShowMore ? (
        <Button
          variant="ghost"
          className="bg-white rounded-2xl shadow h-12"
          style={{ elevation: 1 }}
          onPress={() => setShowAll(true)}
        >
          <Text className="font-outfit-medium text-gray-500">
            View more diary notes
          </Text>
        </Button>
      ) : null}
    </View>
  );
};

export default Diaries;
