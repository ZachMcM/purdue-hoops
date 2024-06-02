import { Link, Redirect } from "expo-router";
import { ActivityIndicator, KeyboardAvoidingView, ScrollView, View } from "react-native";
import SignInForm from "~/components/forms/auth/SignInForm";
import { useSession } from "~/components/providers/SessionProvider";
import { Text } from "~/components/ui/text";

export default function SignIn() {
  const { session, isSessionFetching, isSessionPending } = useSession();

  return isSessionPending || isSessionFetching ? (
    <View className="flex flex-1 justify-center items-center">
      <ActivityIndicator size="large" />
    </View> ) : !session ? (
    <KeyboardAvoidingView className="flex-1 flex" behavior="padding">
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          flex: 1,
          display: "flex",
        }}
      >
        <View className="flex flex-1 flex-col items-center justify-center px-4 py-10">
          <View className="flex flex-col gap-6 w-full border border-border rounded-lg p-8">
            <View className="flex flex-col gap-2">
              <Text className="font-bold text-3xl">Sign In</Text>
              <Text className="text-lg text-muted-foreground font-medium">
                Sign in to your Purdue Hoops account.
              </Text>
            </View>
            <SignInForm />
            <Text className="text-center">
              Don't have an account?{" "}
              <Link replace href="/signup" className="underline">
                Sign Up
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
