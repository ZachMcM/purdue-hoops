import { Redirect } from "expo-router";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  ScrollView,
  View,
} from "react-native";
import SetUpForm from "~/components/forms/auth/SetUpForm";
import { useSession } from "~/components/providers/SessionProvider";
import { Text } from "~/components/ui/text";

export default function SetUp() {
  const { session, isSessionPending, isSessionFetching } = useSession();

  return isSessionPending || isSessionFetching ? (
    <View className="flex flex-1 justify-center items-center">
      <ActivityIndicator
        size="large"
      />
    </View>
  ) : session && (!session?.user.inches ||
  !session.user.position ||
  !session.user.primarySkill ||
  !session.user.feet ||
  !session.user.secondarySkill ||
  !session.user.weight) ? (
    <KeyboardAvoidingView className="flex-1 flex" behavior="padding">
      <ScrollView keyboardShouldPersistTaps="handled">
        <View className="flex flex-col items-center justify-center px-4 py-10">
          <View className="flex flex-col gap-6 w-full border border-border rounded-lg p-6">
            <View className="flex flex-col gap-2">
              <Text className="font-bold text-3xl">Set Up</Text>
              <Text className="text-lg text-muted-foreground font-medium">
                Set up your Purdue Hoops account.
              </Text>
            </View>
            <SetUpForm />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  ) : (
    <Redirect href="/(tabs)" />
  );
}
