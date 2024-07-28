import { Image, View } from "react-native";
import { UserPreview } from "~/types/prisma";
import { Text } from "../ui/text";
import { hoopingStatuses } from "~/constants/config";
import { cn } from "~/lib/utils";

export default function UserView({ user }: { user: UserPreview }) {
  const isActive =
    user.hoopingStatus !== "not-hooping" &&
    hoopingStatuses.map((s) => s.value).includes(user.hoopingStatus);

  return (
    <View className="flex flex-row w-full justify-between items-center">
      <View className="flex flex-row gap-3 items-center">
        <Image
          className="bg-secondary h-14 w-14 rounded-full"
          source={{ uri: user.image! }}
        />
        <View className="flex flex-col gap-1">
          <View className="flex flex-col">
            <Text className="text-sm text-muted-foreground font-medium capitalize">({user.primarySkill} / {user.secondarySkill})</Text>
            <Text className="text-lg font-bold">{user.name}</Text>
          </View>
          <View className="flex flex-row gap-1 items-center">
            <View
              className={cn(
                "h-1.5 w-1.5 rounded-full",
                isActive ? "bg-green-600" : "bg-red-600"
              )}
            ></View>
            <Text
              className={cn(
                "text-xs font-medium",
                isActive ? "text-green-600" : "text-red-600"
              )}
            >
              {
                hoopingStatuses.find((s) => s.value == user.hoopingStatus)
                  ?.label || "Not Hooping"
              }
            </Text>
          </View>
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
