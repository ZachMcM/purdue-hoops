import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import { getItemAsync } from "expo-secure-store";
import { Friendship } from "purdue-hoops-prisma-schema";
import { useEffect, useState } from "react";
import { Controller, FieldValues, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  ScrollView,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import * as zod from "zod";
import FriendButton from "~/components/friendship/FriendButton";
import { useSession } from "~/components/providers/SessionProvider";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Text } from "~/components/ui/text";
import UserCard from "~/components/user/UserCard";
import UserCardSkeleton from "~/components/user/UserCardSkeleton";
import { hoopingStatuses } from "~/constants/config";
import { PartialUser } from "~/types/prisma";

const schema = zod.object({
  value: zod.preprocess(
    (a) => parseInt(a as string),
    zod
      .number()
      .int()
      .min(60, { message: "Min rating is 60." })
      .max(99, { message: "Max rating is 99." })
  ),
});

type FormValues = zod.infer<typeof schema>;

export default function User() {
  const { id } = useLocalSearchParams();

  const { data: user, isPending } = useQuery({
    queryKey: ["users", { userId: id }],
    queryFn: async (): Promise<PartialUser> => {
      const accessToken = await getItemAsync("Access-Token");
      const res = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/users/${id}`,
        {
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
  });

  const { session } = useSession();

  const [dialog, setDialog] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(schema),
  });

  const queryClient = useQueryClient();

  // rating mutations

  const { mutate: updateRating, isPending: isRatingUpdating } = useMutation({
    mutationFn: async (body: FormValues) => {
      const accessToken = await getItemAsync("Access-Token");
      const res = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/users/${user?.id}/ratings`,
        {
          method: "PUT",
          body: JSON.stringify({
            value: body.value,
          }),
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
        queryKey: ["users", { userId: user?.id }],
      });
      queryClient.invalidateQueries({
        queryKey: ["gyms", { gymId: user?.hoopingStatus }],
      });
      queryClient.invalidateQueries({ queryKey: ["leaderboard"] });

      Toast.show({
        type: "success",
        text2: "Successfully updated the rating.",
      });

      setDialog(false);
    },
  });

  function onSubmit(data: FieldValues) {
    updateRating(data as FormValues);
  }

  return (
    <KeyboardAvoidingView behavior="padding" className="flex flex-1">
      <ScrollView keyboardShouldPersistTaps="handled">
        <View className="flex px-6 py-10">
          {isPending ? (
            <UserCardSkeleton />
          ) : (
            user && (
              <View className="flex flex-col gap-8">
                <UserCard user={user} />
                <View className="flex flex-row gap-3 items-center justify-center flex-wrap">
                  <Badge>
                    <Text>
                      {
                        hoopingStatuses.find(
                          (s) => s.value === user.hoopingStatus
                        )?.label
                      }
                    </Text>
                  </Badge>
                  {user.id !== session?.userId && (
                    <Dialog
                      open={dialog}
                      onOpenChange={(val) => {
                        setDialog(val);
                        reset();
                      }}
                    >
                      <DialogTrigger asChild>
                        <Button variant="ghost">
                          <Text>Rate User</Text>
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="w-[325px] md:w-[400px]">
                        <DialogHeader>
                          <DialogTitle>Rate {user.name}</DialogTitle>
                          <DialogDescription>
                            Enter a rating value from 60 to 99.
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                          <View className="flex flex-col gap-6 w-full">
                            <Controller
                              control={control}
                              rules={{ required: true }}
                              render={({
                                field: { onChange, value, onBlur },
                              }) => (
                                <View className="flex flex-col gap-2">
                                  <Label nativeID="value">Rating Value</Label>
                                  <Input
                                    placeholder="81"
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value?.toString() || ""}
                                    keyboardType="numeric"
                                  />
                                  {errors.value && (
                                    <Text className="text-red-600 font-medium">
                                      {errors.value.message?.toString()}
                                    </Text>
                                  )}
                                </View>
                              )}
                              name="value"
                            />
                            <Button
                              onPress={handleSubmit(onSubmit)}
                              className="flex flex-row gap-2"
                            >
                              <Text className="text-background">Save</Text>
                              <ActivityIndicator
                                size="small"
                                hidesWhenStopped
                                animating={isRatingUpdating}
                                className="text-background"
                              />
                            </Button>
                          </View>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  )}
                  <FriendButton user={user} />
                </View>
              </View>
            )
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
