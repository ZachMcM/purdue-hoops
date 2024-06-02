import { View } from "react-native";
import { Skeleton } from "../ui/skeleton";
import { Text } from "../ui/text";

export default function UserCardSkeleton() {
  return (
    <View className="flex flex-col gap-8">
      <View className="flex flex-row gap-4 items-center">
        <Skeleton className="h-16 w-16 rounded-full" />
        <View className="flex flex-col gap-2">
          <Skeleton className="w-32 h-3" />
          <Skeleton className="w-64 h-4" />
        </View>
      </View>
      <View className="flex flex-col gap-4">
        <View className="flex flex-row gap-4">
          <Skeleton className="w-24 h-24 rounded-full" />
          <Skeleton className="rounded-lg flex flex-1" />
        </View>
        <View className="flex flex-row gap-4">
          <Skeleton className="rounded-lg h-24 flex flex-1" />
          <Skeleton className="rounded-lg h-24 flex flex-1" />
        </View>
        <View className="flex flex-row gap-4">
          <Skeleton className="rounded-lg h-24 flex flex-1" />

          <Skeleton className="rounded-lg h-24 flex flex-1" />
        </View>
        <View className="flex flex-row gap-4">
          <Skeleton className="rounded-lg h-24 flex flex-1" />

          <Skeleton className="rounded-lg h-24 flex flex-1" />
        </View>
      </View>
    </View>
  );
}
