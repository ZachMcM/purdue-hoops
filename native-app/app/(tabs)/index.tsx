import { ScrollView, View } from "react-native";
import BoilerballNews from "~/components/custom/BoilerballNews";
import GymCard from "~/components/custom/GymCard";
import StatusButton from "~/components/user/StatusButton";

export default function Tab() {
  return (
    <View className="flex flex-1">
      <ScrollView keyboardShouldPersistTaps="handled">
        <View className="flex flex-col gap-8 px-6 py-10">
          <StatusButton />
          <GymCard gym="gold-and-black" />
          <GymCard gym="feature" />
          <GymCard gym="upper" />
          <BoilerballNews />
        </View>
      </ScrollView>
    </View>
  );
}
