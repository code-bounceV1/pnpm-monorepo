import { View } from "react-native";
import { Text } from "@pnpm-monorepo/ui-mobile";
import Diaries from "@/features/home/components/diaries";
import Storybooks from "@/features/home/components/storybooks";
import Units from "@/features/home/components/units";
import Screen from "@/shared/components/screen";

const HomeScreen = () => {
  return (
    <Screen enableScroll>
      <View className="mb-3 gap-3">
        <View>
          <Text className="text-sm text-[#767676] font-outfit-medium">
            Good Morning,
          </Text>
          <Text className="text-3xl font-outfit-semibold">Karthikeyan</Text>
        </View>
        <Units />
        <Diaries />
        <Storybooks />
      </View>
    </Screen>
  );
};

export default HomeScreen;
