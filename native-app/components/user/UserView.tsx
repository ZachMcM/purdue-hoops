import { Image, View } from "react-native";
import { UserPreview } from "~/types/prisma";
import { Text } from "../ui/text";

export default function UserView({ user }: { user: UserPreview }) {
  return (
    <View className="flex flex-row w-full justify-between items-center">
      <View className="flex flex-row gap-3 items-center">
        <Image
          className="bg-secondary h-12 w-12 rounded-full"
          source={{ uri: user.image! }}
        />
        <View className="flex flex-col">
          <Text className="text-sm text-muted-foreground font-medium capitalize">
            {user.primarySkill} / {user.secondarySkill}
          </Text>
          <Text className="text-lg font-bold">{user.name}</Text>
        </View>
      </View>
      <View className="flex justify-center items-center p-4">
        <Text className="font-bold text-xl text-foreground">
          {user.overallRating}
        </Text>
        <Text className="font-semibold text-xs text-muted-foreground">OVR</Text>
      </View>
    </View>
  );
}
