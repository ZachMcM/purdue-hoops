import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import { getItemAsync } from "expo-secure-store";
import { View } from "react-native";
import { HoopingStatus, hoopingStatuses } from "~/constants/config";
import { UserPreview } from "~/types/prisma";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Skeleton } from "../ui/skeleton";
import { Text } from "../ui/text";
import UserView from "../user/UserView";

export default function GymCard({ gym }: { gym: HoopingStatus }) {
  const gymName = hoopingStatuses.find((g) => g.value === gym)?.label!;

  const { data, isPending } = useQuery({
    queryKey: ["gyms", { gymId: gym }],
    queryFn: async (): Promise<UserPreview[]> => {
      const accessToken = await getItemAsync("Access-Token");
      const res = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/gyms?gym=${gym}`,
        {
          headers: {
            "Access-Token": accessToken!,
            "Content-Type": "application/json",
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
    <Card>
      <CardHeader>
        <CardTitle>{gymName}</CardTitle>
        <CardDescription>Check the status of the {gymName}.</CardDescription>
      </CardHeader>
      <CardContent>
        <View className="flex flex-row items-center justify-between">
          {isPending ? (
            <Skeleton className="h-4 w-20" />
          ) : (
            <Text className="font-medium font-sm">
              {data?.length || 0} Hoopers
            </Text>
          )}
          {isPending ? (
            <Skeleton className="h-9 w-32" />
          ) : (
            data &&
            data.length != 0 && (
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="sm" variant="gold">
                    <Text className="text-background text-sm font-medium">
                      View Players
                    </Text>
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>View Players</DialogTitle>
                    <DialogDescription>
                      View {gymName} players and their ratings.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <View className="flex flex-col gap-3">
                      {data.map((user) => (
                        <DialogClose
                          key={user.id}
                          className="w-full"
                          onPress={() =>
                            router.navigate(`/(tabs)/users/${user.id}`)
                          }
                        >
                          <UserView user={user} />
                        </DialogClose>
                      ))}
                    </View>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )
          )}
        </View>
      </CardContent>
    </Card>
  );
}
