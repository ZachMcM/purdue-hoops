import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { getItemAsync } from "expo-secure-store";
import debounce from "lodash.debounce";
import { useCallback, useState } from "react";
import { KeyboardAvoidingView, Pressable, ScrollView, View } from "react-native";
import { useSession } from "~/components/providers/SessionProvider";
import RecentSearchList from "~/components/search/RecentSearchList";
import { Input } from "~/components/ui/input";
import UserView from "~/components/user/UserView";
import UserViewSkeleton from "~/components/user/UserViewSkeleton";
import { UserPreview } from "~/types/prisma";

export default function Tabs() {
  const { session } = useSession();

  const [query, setQuery] = useState("");

  const queryClient = useQueryClient();

  const { mutate: addRecentSearch } = useMutation({
    mutationFn: async ({ userId }: { userId: string }) => {
      const accessToken = await getItemAsync("Access-Token");
      const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/searches`, {
        method: "POST",
        headers: {
          "Access-Token": accessToken!,
          "Content-Type": "application/json",
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
      queryClient.invalidateQueries({ queryKey: ["recentSearches"] });
    },
  });

  const { data: recentSearches } = useQuery({
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
    initialData: session?.user.outgoingSearches,
  });

  const {
    data: searchResults,
    refetch,
    isPending,
  } = useQuery({
    queryKey: ["search"],
    queryFn: async (): Promise<UserPreview[]> => {
      if (!query || query.trim().length == 0) return [];
      const accessToken = await getItemAsync("Access-Token");
      const res = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/users/search?query=${query}`,
        {
          headers: {
            "Access-Token": accessToken!,
          },
        }
      );

      const data = await res.json();

      console.log("search results", data);

      if (!res.ok) {
        throw new Error(data.error);
      }

      return data;
    },
  });

  const request = debounce(async () => {
    refetch();
  }, 150);

  const debounceRequest = useCallback(() => {
    request();
  }, []);

  return (
    <KeyboardAvoidingView behavior="padding" className="flex flex-1">
      <ScrollView keyboardShouldPersistTaps="handled">
        <View className="flex flex-col gap-10 px-6 py-10">
          <View className="flex flex-col gap-6">
            <Input
              value={query}
              onChangeText={(val) => {
                setQuery(val);
                debounceRequest();
              }}
              placeholder="Search for users..."
            />
            {query.trim().length == 0 && (
              <RecentSearchList
                users={recentSearches as UserPreview[]}
                reset={() => {
                  setQuery("");
                  debounceRequest();
                }}
              />
            )}
            {query.trim().length > 0 &&
              (isPending
                ? Array(3)
                    .fill("")
                    .map((_, i) => <UserViewSkeleton key={i} />)
                : searchResults &&
                  searchResults.length > 0 &&
                  searchResults.map((user) => (
                    <Pressable
                      key={user.id}
                      className="flex w-full"
                      onPress={() => {
                        addRecentSearch({ userId: user.id });
                        setQuery("");
                        debounceRequest();
                        router.replace(`/(tabs)/users/${user.id}`);
                      }}
                    >
                      <UserView user={user} key={user.id} />
                    </Pressable>
                  )))}
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
