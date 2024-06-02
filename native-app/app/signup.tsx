import { Link, Redirect } from "expo-router";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  ScrollView,
  View,
} from "react-native";
import SignUpForm from "~/components/forms/auth/SignUpForm";
import { useSession } from "~/components/providers/SessionProvider";
import { Text } from "~/components/ui/text";

export default function SignUp() {
  const { session, isSessionPending, isSessionFetching } = useSession();

  return isSessionPending || isSessionFetching ? (
    <View className="flex flex-1 justify-center items-center">
      <ActivityIndicator
        size="large"
      />
    </View>
  ) : !session ? (
    <KeyboardAvoidingView className="flex-1 flex" behavior="padding">
      <ScrollView keyboardShouldPersistTaps="handled">
        <View className="flex flex-col items-center justify-center px-4 py-10">
          <View className="flex flex-col gap-6 w-full border border-border rounded-lg p-6">
            <View className="flex flex-col gap-2">
              <Text className="font-bold text-3xl">Sign Up</Text>
              <Text className="text-lg text-muted-foreground font-medium">
                Create a Purdue Hoops account.
              </Text>
            </View>
            <SignUpForm />
            <Text className="text-center">
              Already have an account?{" "}
              <Link replace href="/signin" className="underline">
                Sign In
              </Link>
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  ) : (
    <Redirect href="/(tabs)" />
  );
}
