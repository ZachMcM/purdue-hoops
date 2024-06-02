import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import { getItemAsync } from "expo-secure-store";
import { Pressable, View } from "react-native";
import { UserPreview } from "~/types/prisma";
import { Separator } from "../ui/separator";
import { Text } from "../ui/text";
import UserView from "../user/UserView";
import UserViewSkeleton from "../user/UserViewSkeleton";

export default function LeaderboardTable() {
  const { data: users, isPending } = useQuery({
    queryKey: ["leaderboard"],
    queryFn: async (): Promise<UserPreview[]> => {
      const accessToken = await getItemAsync("Access-Token");
      const res = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/users/leaderboard`,
        {
          headers: {
            "Access-Token": accessToken!,
          },
        },
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error);
      }

      return data;
    },
  });

  return (
    <View className="w-full flex flex-col gap-6">
      <Text className="font-bold text-3xl">Top 100 Leaderboard</Text>
      {isPending
        ? Array(10)
            .fill("")
            .map((_, i) => (
              <View key={i} className="flex flex-col gap-6">
                <UserViewSkeleton key={i} />
                {i !== 9 && <Separator />}
              </View>
            ))
        : users &&
          users.map((user, i) => (
            <View key={user.id} className="flex flex-col gap-6">
              <View key={user.id} className="flex flex-row gap-4 items-center">
                <Text className="text-4xl w-fit font-extrabold">{i + 1}.</Text>
                <Pressable
                  className="w-full flex flex-1"
                  onPress={() => router.navigate(`/(tabs)/users/${user.id}`)}
                >
                  <UserView user={user} />
                </Pressable>
              </View>
              {i !== users.length - 1 && <Separator />}
            </View>
          ))}
    </View>
  );
}
