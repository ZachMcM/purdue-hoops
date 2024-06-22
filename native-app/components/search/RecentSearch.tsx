import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getItemAsync } from "expo-secure-store";
import { UserPreview } from "~/types/prisma";
import UserView from "../user/UserView";
import { Pressable, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { Text } from "../ui/text";
import { router } from "expo-router";
import { useColorScheme } from "~/lib/useColorScheme";

export default function RecentSearch({
  user,
  deleteSearchState,
  reset,
}: {
  user: UserPreview;
  deleteSearchState: () => void;
  reset: () => void;
}) {
  const queryClient = useQueryClient();

  const { isDarkColorScheme } = useColorScheme();

  const { mutate: deleteSearch } = useMutation({
    mutationFn: async ({ userId }: { userId: string }) => {
      console.log(userId);
      const accessToken = await getItemAsync("Access-Token");
      const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/searches`, {
        method: "DELETE",
        headers: {
          "Access-Token": accessToken!,
        },
        body: JSON.stringify({
          userId,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error);
      }

      return data;
    },
    onSuccess: () => {
      console.log("deleted recent search");
      queryClient.invalidateQueries({ queryKey: ["recentSearches"] });
    },
    onError: (err) => {
      console.error(err);
    },
  });

  return (
    <View key={user.id} className="flex flex-row gap-10 items-center">
      <Pressable
        className="w-full flex flex-1"
        onPress={() => {
          reset();
          router.navigate(`/(tabs)/users/${user.id}`);
        }}
      >
        <UserView user={user} />
      </Pressable>
      <Feather
        onPress={() => {
          deleteSearchState();
          deleteSearch({ userId: user.id });
        }}
        name="x"
        size={20}
        color={isDarkColorScheme ? "#a1a1aa" : "#71717a"}
      />
    </View>
  );
}
