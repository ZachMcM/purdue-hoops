import { ScrollView, View } from "react-native";
import LeaderboardTable from "~/components/custom/LeaderboardTable";

export default function Tab() {
  return (
    <View className="flex flex-1">
      <ScrollView keyboardShouldPersistTaps="handled">
        <View className="flex px-6 py-10">
          <LeaderboardTable />
        </View>
      </ScrollView>
    </View>
  );
}
