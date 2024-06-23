import { Feather } from "@expo/vector-icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { getItemAsync } from "expo-secure-store";
import { Pressable, View } from "react-native";
import { useColorScheme } from "~/lib/useColorScheme";
import { UserPreview } from "~/types/prisma";
import { Button } from "../ui/button";
import UserView from "../user/UserView";

export default function RecentSearch({
  user,
  reset,
}: {
  user: UserPreview;
  reset: () => void;
}) {
  const queryClient = useQueryClient();

  const { isDarkColorScheme } = useColorScheme();

  const { mutate: deleteSearch } = useMutation({
    mutationFn: async () => {
      console.log(user.id);
      const accessToken = await getItemAsync("Access-Token");
      const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/searches/${user.id}`, {
        method: "DELETE",
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
          router.push(`/(tabs)/users/${user.id}`);
        }}
      >
        <UserView user={user} />
      </Pressable>
      <Button
        size="icon"
        variant="ghost"
        onPress={() => {
          deleteSearch();
        }}
      >
        <Feather
          name="x"
          size={20}
          color={isDarkColorScheme ? "white" : "black"}
        />
      </Button>
    </View>
  );
}
