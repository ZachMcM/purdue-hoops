import { useQuery } from "@tanstack/react-query";
import * as Linking from "expo-linking";
import { Image, Pressable, View } from "react-native";
import { NewsStory } from "~/types/purduesports";
import { Skeleton } from "../ui/skeleton";
import { Text } from "../ui/text";

export default function BoilerballNews() {
  const { data: stories, isPending } = useQuery({
    queryKey: ["boilerball-news"],
    queryFn: async (): Promise<NewsStory[]> => {
      const res = await fetch(process.env.EXPO_PUBLIC_NEWS_API_URL!);
      const data = await res.json();

      if (!res.ok) {
        throw new Error("There was an error loading the Boilerball news.");
      }

      const stories = data.items as NewsStory[];
      stories.length = 3;

      return stories;
    },
    staleTime: 1000 * 60 * 60 * 24,
  });

  return (
    <View className="flex flex-col gap-6">
      <Text className="font-bold text-3xl">Boilerball News</Text>

      {isPending
        ? Array(3)
            .fill("")
            .map((_, i) => (
              <View
                key={i}
                className="flex flex-row w-full items-center justify-between border border-accent rounded-lg"
              >
                <Skeleton className="h-28 w-28 rounded-r-none" />
                <View className="p-4 flex flex-1 flex-col gap-3">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-3.5 w-52" />
                </View>
              </View>
            ))
        : stories &&
          stories.map((story) => (
            <Pressable
              onPress={() => {
                Linking.openURL(
                  process.env.EXPO_PUBLIC_PURDUE_SPORTS_URL + story.contentUrl,
                );
              }}
              key={story.contentId}
              className="flex flex-row w-full items-center justify-between border border-accent rounded-lg"
            >
              <Image
                source={{
                  uri:
                    process.env.EXPO_PUBLIC_PURDUE_SPORTS_URL +
                    story.contentImageUrl,
                }}
                className="h-full w-28 rounded-l-lg rounded-r-none bg-secondary"
              />
              <View className="p-5 flex flex-1 flex-col gap-1">
                <Text className="text-muted-foreground text-xs">
                  {new Date(story.contentDate).toLocaleDateString()}
                </Text>
                <Text className="font-medium text-sm">
                  {story.contentTitle}
                </Text>
              </View>
            </Pressable>
          ))}
    </View>
  );
}
