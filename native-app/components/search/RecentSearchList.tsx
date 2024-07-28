import { useQuery } from "@tanstack/react-query";
import { getItemAsync } from "expo-secure-store";
import { View } from "react-native";
import { UserPreview } from "~/types/prisma";
import { Text } from "../ui/text";
import RecentSearch from "./RecentSearch";
import UserViewSkeleton from "../user/UserViewSkeleton";

export default function RecentSearchList({ reset }: { reset: () => void }) {
  const { data: recentSearches, isPending: recentSearchesPending } = useQuery({
    queryKey: ["recentSearches"],
    queryFn: async (): Promise<UserPreview[]> => {
      const accessToken = await getItemAsync("Access-Token");
      const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/searches`, {
        headers: {
          "Access-Token": accessToken!,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error);
      }

      return data;
    },
  });

  return (
    <View className="flex flex-col gap-4">
      <Text className="font-bold text-lg">Recent Searches</Text>
      <View className="flex flex-col gap-6">
        {recentSearchesPending ? (
          Array(3)
            .fill("")
            .map((_, i) => <UserViewSkeleton key={i} />)
        ) : recentSearches && recentSearches.length > 0 ? (
          recentSearches.map((user) => (
            <RecentSearch key={user.id} reset={reset} user={user} />
          ))
        ) : (
          <Text className="w-full text-center font-medium">
            No recent searches.
          </Text>
        )}
      </View>
    </View>
  );
}
