import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getItemAsync } from "expo-secure-store";
import { Controller, FieldValues, useForm } from "react-hook-form";
import { ActivityIndicator, View } from "react-native";
import Toast from "react-native-toast-message";
import * as zod from "zod";
import { Text } from "~/components/ui/text";
import { useSession } from "../../providers/SessionProvider";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";

const schema = zod.object({
  email: zod
    .string()
    .min(1, { message: "Email is required." })
    .endsWith("@purdue.edu", { message: "Email must be a Purdue email." }),
  name: zod
    .string()
    .min(1, { message: "Name is required." })
    .max(50, { message: "Name must be less than 50 characters." }),
  username: zod
    .string()
    .min(1, { message: "Username is required." })
    .max(50, { message: "Username must be less than 50 characters." }),
});

type FormValues = zod.infer<typeof schema>;

export default function AccountForm() {
  const { session } = useSession();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      email: session?.user.email,
      name: session?.user.name,
      username: session?.user.username,
    },
  });

  const queryClient = useQueryClient();

  const { mutate: updateProfile, isPending: isProfileUpdating } = useMutation({
    mutationFn: async (reqBody: FormValues) => {
      const accessToken = await getItemAsync("Access-Token");
      const res = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/users/account`,
        {
          method: "PUT",
          body: JSON.stringify(reqBody),
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
    onSuccess: async () => {
      Toast.show({
        type: "success",
        text2: "Successfully updated account.",
      });

      queryClient.invalidateQueries({ queryKey: ["leaderboard"] });
      queryClient.invalidateQueries({ queryKey: ["session"] });
      queryClient.invalidateQueries({
        queryKey: ["users", { userId: session?.userId }],
      });
      queryClient.invalidateQueries({
        queryKey: ["gyms", { gymId: session?.user.hoopingStatus }],
      });
    },
    onError: (err) => {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: err.message,
      });
    },
  });

  async function onSubmit(data: FieldValues) {
    console.log("account form values: ", data);
    updateProfile(data as FormValues);
  }

  return (
    <View className="flex flex-col gap-6">
      <Text className="font-bold text-3xl">Account</Text>
      <View className="flex flex-row gap-4">
        <Controller
          control={control}
          rules={{ required: true }}
          render={({ field: { onChange, onBlur, value } }) => (
            <View className="flex flex-col gap-2 flex-1">
              <Label nativeID="username">Username</Label>
              <Input
                placeholder="zachedey"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
              {errors.username && (
                <Text className="text-red-600 font-medium">
                  {errors.username.message?.toString()}
                </Text>
              )}
            </View>
          )}
          name="username"
        />
        <Controller
          control={control}
          rules={{ required: true }}
          render={({ field: { onChange, onBlur, value } }) => (
            <View className="flex flex-col gap-2 flex-1">
              <Label nativeID="name">Name</Label>
              <Input
                placeholder="Zach Edey"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
              {errors.name && (
                <Text className="text-red-600 font-medium">
                  {errors.name.message?.toString()}
                </Text>
              )}
            </View>
          )}
          name="name"
        />
      </View>
      <Controller
        control={control}
        rules={{ required: true }}
        render={({ field: { onChange, onBlur, value } }) => (
          <View className="flex flex-col gap-2">
            <Label nativeID="email">Email</Label>
            <Input
              inputMode="email"
              placeholder="zachedey@purdue.edu"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
            {errors.email && (
              <Text className="text-red-600 font-medium">
                {errors.email.message?.toString()}
              </Text>
            )}
          </View>
        )}
        name="email"
      />
      <Button
        variant="gold"
        onPress={handleSubmit(onSubmit)}
        className="flex flex-row gap-2"
      >
        <Text className="text-background">Save</Text>
        <ActivityIndicator
          size="small"
          hidesWhenStopped
          animating={isProfileUpdating}
          className="text-background"
        />
      </Button>
    </View>
  );
}
