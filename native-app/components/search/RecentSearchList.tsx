import { useState } from "react";
import { View } from "react-native";
import { UserPreview } from "~/types/prisma";
import { Text } from "../ui/text";
import RecentSearch from "./RecentSearch";

export default function RecentSearchList({
  users,
  reset,
}: {
  users?: UserPreview[];
  reset: () => void;
}) {
  const [recentSearches, setRecentSearches] = useState<
    UserPreview[] | undefined | null
  >(users);

  return recentSearches && recentSearches.length > 0 ? (
    <View className="flex flex-col gap-2">
      <Text className="font-bold text-lg">Recent</Text>
      <View className="flex flex-col gap-6">
        {recentSearches.map((user) => (
          <RecentSearch
            key={user.id}
            reset={reset}
            user={user}
            deleteSearchState={() =>
              setRecentSearches(recentSearches.filter((s) => s.id != user.id))
            }
          />
        ))}
      </View>
    </View>
  ) : (
    <Text className="w-full text-center font-medium">No recent searches.</Text>
  );
}
