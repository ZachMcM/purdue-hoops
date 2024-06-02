import { Redirect } from "expo-router";
import { ScrollView, View } from "react-native";
import { useSession } from "~/components/providers/SessionProvider";
import StatusButton from "~/components/user/StatusButton";
import UserCard from "~/components/user/UserCard";
import { PartialUser } from "~/types/prisma";

export default function Tab() {
  const { session } = useSession();

  if (!session) {
    return <Redirect href="/signin" />;
  }

  return (
    <View className="flex flex-1">
      <ScrollView keyboardShouldPersistTaps="handled">
        <View className="flex flex-col gap-8 px-6 py-10">
          <UserCard user={session.user as unknown as PartialUser} />
          <StatusButton />
        </View>
      </ScrollView>
    </View>
  );
}
