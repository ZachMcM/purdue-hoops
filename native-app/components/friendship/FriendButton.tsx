import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getItemAsync } from "expo-secure-store";
import { Friendship } from "purdue-hoops-prisma-schema";
import { ActivityIndicator, View } from "react-native";
import Toast from "react-native-toast-message";
import { PartialUser } from "~/types/prisma";
import { useSession } from "../providers/SessionProvider";
import { Button } from "../ui/button";
import { Text } from "../ui/text";

export default function FriendButton({ user }: { user: PartialUser }) {
  const { session } = useSession();

  const queryClient = useQueryClient();

  const {
    data: friendship,
    isFetching,
    isPending,
  } = useQuery({
    queryKey: ["friends", { userId: user.id }],
    queryFn: async (): Promise<Friendship | null> => {
      const accessToken = await getItemAsync("Access-Token");

      const res = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/friends/status/${user.id}`,
        {
          headers: {
            "Access-Token": accessToken!,
          },
        }
      );

      const data = await res.json();

      console.log("Friendship", data);

      return data;
    },
  });

  const { mutate: addFriend, isPending: addingFriendPending } = useMutation({
    mutationFn: async () => {
      const accessToken = await getItemAsync("Access-Token");

      const res = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/friends/requests`,
        {
          method: "POST",
          headers: {
            "Access-Token": accessToken!,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            incomingId: user?.id,
          }),
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

      Toast.show({
        type: "success",
        text2: "Successfully sent request.",
      });
    },
  });

  const { mutate: removeFriend, isPending: removingFriendPending } =
    useMutation({
      mutationFn: async () => {
        const accessToken = await getItemAsync("Access-Token");

        const res = await fetch(
          `${process.env.EXPO_PUBLIC_API_URL}/friends/requests/${friendship?.id}`,
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

        Toast.show({
          type: "success",
          text2: "Successfully removed friend.",
        });
      },
    });

  const { mutate: acceptFriend, isPending: acceptingFriendPending } =
    useMutation({
      mutationFn: async () => {
        const accessToken = await getItemAsync("Access-Token");

        const res = await fetch(
          `${process.env.EXPO_PUBLIC_API_URL}/friends/requests/incoming/${friendship?.id}`,
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

        Toast.show({
          type: "success",
          text2: "Successfully accepted friend.",
        });
      },
    });

  return (
    <>
      {isFetching || isPending ? (
        <Button size="sm" variant="gold" className="animate-pulse w-36" />
      ) : !friendship ? (
        <Button
          onPress={() => addFriend()}
          className="flex flex-row items-center gap-2 w-36"
          size="sm"
          variant="gold"
        >
          <Text>Add Friend</Text>
          {addingFriendPending && (
            <ActivityIndicator
              size="small"
              hidesWhenStopped
              animating={addingFriendPending}
              className="text-background"
            />
          )}
        </Button>
      ) : friendship?.status == "accepted" ? (
        <Button
          onPress={() => removeFriend()}
          className="flex flex-row items-center gap-2 w-36"
          size="sm"
          variant="gold"
        >
          <Text>Remove Friend</Text>
          {removingFriendPending && (
            <ActivityIndicator
              size="small"
              hidesWhenStopped
              animating={removingFriendPending}
              className="text-background"
            />
          )}
        </Button>
      ) : (
        friendship?.status == "pending" &&
        friendship?.incomingId == session?.userId && (
          <View className="flex flex-row items-center flex-wrap gap-2">
            <Button
              onPress={() => acceptFriend()}
              className="flex flex-row items-center gap-3 w-36"
              size="sm"
              variant="gold"
            >
              <Text>Accept Friend</Text>
              {acceptingFriendPending && (
                <ActivityIndicator
                  size="small"
                  hidesWhenStopped
                  animating={acceptingFriendPending}
                  className="text-background"
                />
              )}
            </Button>
            <Button
              onPress={() => removeFriend()}
              className="flex flex-row items-center gap-2 w-36"
              size="sm"
              variant="destructive"
            >
              <Text>Reject Friend</Text>
              {acceptingFriendPending && (
                <ActivityIndicator
                  size="small"
                  hidesWhenStopped
                  animating={acceptingFriendPending}
                  className="text-background"
                />
              )}
            </Button>
          </View>
        )
      )}
    </>
  );
}
