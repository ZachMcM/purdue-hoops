import { Image, Text, View } from "react-native";
import { Skeleton } from "../ui/skeleton";

export default function UserViewSkeleton() {
  return (
    <View className="flex flex-row gap-3 items-center">
      <Skeleton className="h-12 w-12 rounded-full" />
      <View className="flex flex-col gap-2">
        <Skeleton className="h-3 w-56" />
        <Skeleton className="h-4 w-44" />
      </View>
    </View>
  );
}
