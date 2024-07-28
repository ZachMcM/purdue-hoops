import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getItemAsync } from "expo-secure-store";
import { useState } from "react";
import { ActivityIndicator, KeyboardAvoidingView, ScrollView, View } from "react-native";
import Toast from "react-native-toast-message";
import AccountForm from "~/components/forms/settings/AccountForm";
import ProfileForm from "~/components/forms/settings/ProfileForm";
import { useSession } from "~/components/providers/SessionProvider";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import { Text } from "~/components/ui/text";

export default function Tab() {
  const { signOut, isSignOutPending } = useSession();

  const queryClient = useQueryClient();

  const { mutate: deleteUser, isPending: isDeletionPending } = useMutation({
    mutationFn: async () => {
      const accessToken = await getItemAsync("Access-Token");
      const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/users`, {
        method: "DELETE",
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
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["session"] });
      queryClient.invalidateQueries({ queryKey: ["leaderboard"] });
      queryClient.invalidateQueries({
        queryKey: ["gyms", { gymId: data.hoopingStatus }],
      });

      setOpen(false);

      Toast.show({
        type: "success",
        text2: "Successfully deleted your account.",
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

  const [open, setOpen] = useState(false);

  return (
    <KeyboardAvoidingView behavior="padding" className="flex flex-1">
      <ScrollView keyboardShouldPersistTaps="handled">
        <View className="flex flex-col gap-8 px-6 py-10">
          <ProfileForm />
          <Separator />
          <AccountForm />
          <Separator />
          <View className="flex flex-col gap-4">
            <Text className="font-bold text-3xl">Danger Zone</Text>
            <Button
              onPress={signOut}
              className="flex flex-row gap-2 justify-center"
            >
              <Text>Sign Out</Text>
              {isSignOutPending && (
                <ActivityIndicator
                  size="small"
                  className="text-background"
                  hidesWhenStopped
                  animating={isSignOutPending}
                />
              )}
            </Button>
            <AlertDialog open={open} onOpenChange={setOpen}>
              <AlertDialogTrigger asChild>
                <Button variant="outline">
                  <Text>Delete Account</Text>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    your account and remove your data from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>
                    <Text>Cancel</Text>
                  </AlertDialogCancel>
                  <Button
                    onPress={() => deleteUser()}
                    className="flex flex-row gap-2 justify-center"
                  >
                    <Text className="text-background">Confirm</Text>
                    {isDeletionPending && (
                      <ActivityIndicator
                        size="small"
                        className="text-background"
                        hidesWhenStopped
                        animating={isDeletionPending}
                      />
                    )}
                  </Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
