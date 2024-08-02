import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteItemAsync, getItemAsync, setItemAsync } from "expo-secure-store";
import { ReactNode, createContext, useContext } from "react";
import Toast from "react-native-toast-message";
import { Session, SessionProviderValues } from "~/types/session";

const SessionContext = createContext<SessionProviderValues | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();

  // the session variable

  const {
    data: session,
    isPending: isSessionPending,
    isFetching: isSessionFetching,
  } = useQuery({
    queryKey: ["session"],
    queryFn: async (): Promise<null | Session> => {
      console.log("session query");
      const accessToken = await getItemAsync("Access-Token");
      if (!accessToken) {
        return null;
      }
      const res = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/auth/session`,
        {
          headers: {
            "Access-Token": accessToken!,
          },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        return null;
      }

      return data;
    },
  });

  // sign in fucntion

  const { mutate: signIn, isPending: isSignInPending } = useMutation({
    mutationFn: async ({
      email,
      password,
    }: {
      email: string;
      password: string;
    }) => {
      const res = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/auth/signin`,
        {
          method: "POST",
          body: JSON.stringify({
            email,
            password,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await res.json();

      console.log("sign in data query: ", data);

      if (!res.ok) {
        throw new Error(data.error);
      }

      await setItemAsync("Access-Token", res.headers.get("Access-Token")!);
      return data;
    },
    onSuccess: () => {
      Toast.show({
        type: "success",
        text2: "Successfully signed in.",
      });

      queryClient.invalidateQueries({ queryKey: ["session"] });
    },
    onError: (err) => {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: err.message,
      });
    },
  });

  // function to set up the account

  const { mutate: setUp, isPending: isSetUpPending } = useMutation({
    mutationFn: async ({
      position,
      height,
      weight,
      primarySkill,
      secondarySkill
    }: {
      position: string,
      height: {
        inches: number,
        feet: number
      },
      weight: number,
      primarySkill: string,
      secondarySkill: string
    }) => {
      const accessToken = await getItemAsync("Access-Token");
      const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/users/account/setup`,
        {
          method: "PUT",
          headers: {
            "Access-Token": accessToken!,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            position,
            weight,
            primarySkill,
            secondarySkill,
            inches: height.inches,
            feet: height.feet
          })
        }
      )

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error)
      }

      return data
    },
    onError: (err) => {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: err.message,
      });
    },
    onSuccess: () => {
      Toast.show({
        type: "success",
        text2: "Successfully setup your account up.",
      });

      queryClient.invalidateQueries({ queryKey: ["session"] });
    },
  })

  // sign up function

  const { mutate: signUp, isPending: isSignUpPending } = useMutation({
    mutationFn: async ({
      name,
      username,
      email,
      password,
    }: {
      name: string;
      username: string;
      email: string;
      password: string;
    }) => {
      const res = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/auth/signup`,
        {
          headers: {
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify({
            name,
            username,
            email,
            password,
          }),
        }
      );

      const data = await res.json();

      console.log("sign up query response: ", data);

      if (!res.ok) {
        throw new Error(data.error);
      }

      await setItemAsync("Access-Token", res.headers.get("Access-Token")!);

      return data;
    },
    onError: (err) => {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: err.message,
      });
    },
    onSuccess: () => {
      Toast.show({
        type: "success",
        text2: "Successfully signed up.",
      });

      queryClient.invalidateQueries({ queryKey: ["session"] });
    },
  });

  // sign out function

  const { mutate: signOut, isPending: isSignOutPending } = useMutation({
    mutationFn: async () => {
      try {
        await deleteItemAsync("Access-Token");
      } catch (err) {
        throw new Error("Error signing out.");
      }
    },
    onSuccess: async () => {
      Toast.show({
        type: "success",
        text2: "Successfully signed out.",
      });

      queryClient.invalidateQueries({ queryKey: ["session"] });
    },
    onError: (err) => {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: err.message,
      });
    },
  });

  return (
    <SessionContext.Provider
      value={{
        session,
        signIn,
        signOut,
        signUp,
        isSessionPending,
        isSessionFetching,
        isSignInPending,
        isSignOutPending,
        isSignUpPending,
        isSetUpPending,
        setUp
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  return useContext(SessionContext) as SessionProviderValues;
}
