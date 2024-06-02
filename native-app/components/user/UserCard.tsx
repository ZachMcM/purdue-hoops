import { Image } from "react-native";
import { View } from "react-native";
import { PartialUser } from "~/types/prisma";
import { Text } from "../ui/text";

export default function UserCard({ user }: { user: PartialUser }) {
  return (
    <View className="flex flex-col gap-8">
      <View className="flex flex-row gap-4 items-center">
        <Image
          source={{ uri: user.image! }}
          className="bg-secondary rounded-full h-16 w-16"
        />
        <View className="flex flex-col gap-1">
          <Text className="text-muted-foreground font-semibold">
            @{user.username}
          </Text>
          <Text className="text-2xl font-bold">{user.name}</Text>
        </View>
      </View>
      <View className="flex flex-col gap-4">
        <View className="flex flex-row gap-4">
          <View className="w-24 h-24 border-border border-2 rounded-full">
            <View className="flex flex-1 justify-center items-center">
              <Text className="font-bold text-3xl text-foreground">
                {user.overallRating}
              </Text>
              <Text className="font-semibold text-muted-foreground text-sm">
                OVR
              </Text>
            </View>
          </View>
          <View className="rounded-lg p-4 bg-secondary flex-1 flex flex-col gap-1.5">
            <Text className="text-muted-foreground font-medium">Position</Text>
            <Text className="font-bold text-2xl uppercase">
              {user.position}
            </Text>
          </View>
        </View>
        <View className="flex flex-row gap-4">
          <View className="rounded-lg p-4 bg-secondary flex-1 flex flex-col gap-1.5">
            <Text className="text-muted-foreground font-medium">
              Primary Skill
            </Text>
            <Text className="font-bold text-lg capitalize">
              {user.primarySkill}
            </Text>
          </View>
          <View className="rounded-lg p-4 bg-secondary flex-1 flex flex-col gap-1.5">
            <Text className="text-muted-foreground font-medium">
              Secondary Skill
            </Text>
            <Text className="font-bold text-lg capitalize">
              {user.secondarySkill}
            </Text>
          </View>
        </View>
        <View className="flex flex-row gap-4">
          <View className="rounded-lg p-4 bg-secondary flex-1 flex flex-col gap-1.5">
            <Text className="text-muted-foreground font-medium">Height</Text>
            <Text className="font-bold text-xl capitalize">
              {user.feet}'{user.inches}"
            </Text>
          </View>
          <View className="rounded-lg p-4 bg-secondary flex-1 flex flex-col gap-1.5">
            <Text className="text-muted-foreground font-medium">Weight</Text>
            <Text className="font-bold text-xl capitalize">
              {user.weight?.toString()} lbs
            </Text>
          </View>
        </View>
        <View className="flex flex-row gap-4">
          <View className="rounded-lg p-4 bg-secondary flex-1 flex flex-col gap-1.5">
            <Text className="text-muted-foreground font-medium">
              Appearances
            </Text>
            <Text className="font-bold text-xl capitalize">
              {user.hoopSessions.length}
            </Text>
          </View>
          <View className="rounded-lg p-4 bg-secondary flex-1 flex flex-col gap-1.5">
            <Text className="text-muted-foreground font-medium">Ratings</Text>
            <Text className="font-bold text-xl capitalize">
              {user.incomingRatings.length}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}
