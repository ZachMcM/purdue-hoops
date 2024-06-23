import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getItemAsync } from "expo-secure-store";
import { Pressable, View } from "react-native";
import Toast from "react-native-toast-message";
import { useColorScheme } from "~/lib/useColorScheme";
import { FriendshipExtended } from "~/types/prisma";
import UserView from "../user/UserView";
import { Button } from "../ui/button";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";

export default function FriendRequest({
  friendRequest,
}: {
  friendRequest: FriendshipExtended;
}) {
  const user = friendRequest.outgoingUser;

  const queryClient = useQueryClient();

  const { mutate: removeFriend, isPending: removingFriendPending } =
    useMutation({
      mutationFn: async () => {
        const accessToken = await getItemAsync("Access-Token");

        const res = await fetch(
          `${process.env.EXPO_PUBLIC_API_URL}/friends/requests/${friendRequest?.id}`,
          {
            method: "DELETE",
            headers: {
              "Access-Token": accessToken!,
            },
          }
        );

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error);
        }

        return data;
      },
      onError: (err) => {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: err.message,
        });
      },
      onSuccess: (data) => {
        console.log("ratings query response: ", data);
        queryClient.invalidateQueries({
          queryKey: ["friends", { userId: user?.id }],
        });
        queryClient.invalidateQueries({
          queryKey: ["friends"],
        });
        queryClient.invalidateQueries({
          queryKey: ["friend-requests", { userId: user?.id }],
        });

        Toast.show({
          type: "success",
          text2: "Successfully removed friend.",
        });
      },
    });

  const { mutate: acceptFriend } = useMutation({
    mutationFn: async () => {
      const accessToken = await getItemAsync("Access-Token");

      const res = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/friends/requests/incoming/${friendRequest?.id}`,
        {
          method: "PUT",
          headers: {
            "Access-Token": accessToken!,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error);
      }

      return data;
    },
    onError: (err) => {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: err.message,
      });
    },
    onSuccess: (data) => {
      console.log("ratings query response: ", data);
      queryClient.invalidateQueries({
        queryKey: ["friends", { userId: user?.id }],
      });
      queryClient.invalidateQueries({
        queryKey: ["friends"],
      });
      queryClient.invalidateQueries({
        queryKey: ["friend-requests"],
      });

      Toast.show({
        type: "success",
        text2: "Successfully accepted friend.",
      });
    },
  });

  const { isDarkColorScheme } = useColorScheme();

  return (
    <View className="flex flex-row gap-4 items-center" key={friendRequest.id}>
      <Pressable
        className="w-full flex flex-1"
        onPress={() => router.push(`/(tabs)/users/${user.id}`)}
      >
        <UserView user={friendRequest.outgoingUser} />
      </Pressable>
      <View className="flex flex-row items-center gap-2.5">
        <Button size="icon" variant="gold" onPress={() => acceptFriend()}>
          <Feather
            name="check"
            size={20}
            color={isDarkColorScheme ? "black" : "white"}
          />
        </Button>
        <Button size="icon" variant="outline" onPress={() => removeFriend()}>
          <Feather
            name="x"
            size={20}
            color={isDarkColorScheme ? "white" : "black"}
          />
        </Button>
      </View>
    </View>
  );
}
