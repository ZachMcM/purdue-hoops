import { useQuery } from "@tanstack/react-query";
import { getItemAsync } from "expo-secure-store";
import { Pressable, View } from "react-native";
import { FriendshipExtended } from "~/types/prisma";
import { useSession } from "../providers/SessionProvider";
import { Text } from "../ui/text";
import UserView from "../user/UserView";
import UserViewSkeleton from "../user/UserViewSkeleton";
import FriendRequest from "./FriendRequest";
import { router } from "expo-router";

export default function FriendList() {
  const { session } = useSession();

  const { data: friendships, isPending: allFriendsPending } = useQuery({
    queryKey: ["friends"],
    queryFn: async (): Promise<FriendshipExtended[]> => {
      const accessToken = await getItemAsync("Access-Token");

      const res = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/friends/all`,
        {
          headers: {
            "Access-Token": accessToken!,
          },
        }
      );

      const data = await res.json();
      return data;
    },
  });

  const { data: friendRequests, isPending: friendRequestsPending } = useQuery({
    queryKey: ["friend-requests"],
    queryFn: async (): Promise<FriendshipExtended[]> => {
      const accessToken = await getItemAsync("Access-Token");

      const res = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/friends/requests/incoming`,
        {
          headers: {
            "Access-Token": accessToken!,
          },
        }
      );

      const data = await res.json();
      return data;
    },
  });

  return (
    <View className="flex flex-col gap-10">
      <View className="flex flex-col gap-4">
        <Text className="font-bold text-lg">All Friends</Text>
        <View className="flex flex-col gap-6">
          {allFriendsPending ? (
            Array(3)
              .fill("")
              .map((_, i) => <UserViewSkeleton key={i} />)
          ) : friendships && friendships.length > 0 ? (
            friendships.map((friend) => {
              const user =
                friend.incomingId == session?.userId
                  ? friend.outgoingUser
                  : friend.incomingUser;

              return (
                <Pressable
                  onPress={() => router.push(`/(tabs)/users/${user.id}`)}
                >
                  <UserView key={friend.id} user={user} />
                </Pressable>
              );
            })
          ) : (
            <Text className="w-full text-center font-medium">
              No friends found.
            </Text>
          )}
        </View>
      </View>
      <View className="flex flex-col gap-4">
        <Text className="font-bold text-lg">Friend Requests</Text>
        <View className="flex flex-col gap-6">
          {friendRequestsPending ? (
            Array(3)
              .fill("")
              .map((_, i) => <UserViewSkeleton key={i} />)
          ) : friendRequests && friendRequests.length > 0 ? (
            friendRequests.map((friend) => (
              <FriendRequest friendRequest={friend} key={friend.id} />
            ))
          ) : (
            <Text className="w-full text-center font-medium">
              No friend requests.
            </Text>
          )}
        </View>
      </View>
    </View>
  );
}
