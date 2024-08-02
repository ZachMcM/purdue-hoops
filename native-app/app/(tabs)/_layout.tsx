import { Feather } from "@expo/vector-icons";
import { Redirect, Tabs } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import Icon from "~/components/custom/Icon";
import { useSession } from "~/components/providers/SessionProvider";

export default function TabLayout() {
  const { session, isSessionPending, isSessionFetching } = useSession();

  return isSessionPending || isSessionFetching ? (
    <View className="flex flex-1 justify-center items-center">
      <ActivityIndicator size="large" />
    </View>  ) : !session ? (
    <Redirect href="/signin" />
  ) : !session?.user.inches ||
  !session.user.position ||
  !session.user.primarySkill ||
  !session.user.feet ||
  !session.user.secondarySkill ||
  !session.user.weight ? <Redirect href="/setup"/> : (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          title: "Purdue Hoops",
          headerTitle: () => <Icon />,
          tabBarShowLabel: false,
          tabBarIcon: ({ focused, color }) => (
            <Feather
              name="home"
              size={18}
              color={
                focused ? "#ceb888" : color
              }
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarShowLabel: false,
          tabBarIcon: ({ focused, color }) => (
            <Feather
              name="user"
              size={18}
              color={
                focused ? "#ceb888" : color
              }
            />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarShowLabel: false,
          tabBarIcon: ({ focused, color }) => (
            <Feather
              name="settings"
              size={18}
              color={
                focused ? "#ceb888" : color
              }
            />
          ),
        }}
      />
      <Tabs.Screen
        name="users/[id]"
        options={{
          title: "Purdue Hoops",
          tabBarShowLabel: false,
          href: null,
        }}
      />

      <Tabs.Screen
        name="leaderboard"
        options={{
          title: "Leaderboard",
          tabBarShowLabel: false,
          tabBarIcon: ({ focused, color }) => (
            <Feather
              name="award"
              size={18}
              color={
                focused ? "#ceb888" : color
              }
            />
          ),
        }}
      />
      <Tabs.Screen
        name="friends"
        options={{
          title: "Friends",
          tabBarShowLabel: false,
          tabBarIcon: ({ focused, color }) => (
            <Feather
              name="users"
              size={18}
              color={
                focused ? "#ceb888" : color
              }
            />
          ),
        }}
      />
    </Tabs>
  );
}
