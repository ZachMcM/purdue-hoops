import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { getItemAsync } from "expo-secure-store";
import Toast from "react-native-toast-message";
import { View } from "react-native";
import { HoopingStatus, hoopingStatuses } from "~/constants/config";
import { Label } from "../ui/label";
import { useSession } from "../providers/SessionProvider";
import { Skeleton } from "../ui/skeleton";

export default function StatusButton() {
  const { session } = useSession();

  const queryClient = useQueryClient();

  const { data: status, isPending } = useQuery({
    queryKey: ["status"],
    queryFn: async (): Promise<string> => {
      const accessToken = await getItemAsync("Access-Token");
      const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/status`, {
        headers: {
          "Access-Token": accessToken!,
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error);
      }

      console.log(data);

      return data.hoopingStatus;
    },
  });

  const { mutate: updateStatus } = useMutation({
    mutationFn: async (status: string) => {
      const accessToken = await getItemAsync("Access-Token");
      const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/status`, {
        method: "PUT",
        body: JSON.stringify({
          status,
        }),
        headers: {
          "Content-Type": "application/json",
          "Access-Token": accessToken!,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message);
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leaderboard"] });
      queryClient.invalidateQueries({
        queryKey: ["gyms", { gymId: "gold-and-black" }],
      });
      queryClient.invalidateQueries({
        queryKey: ["gyms", { gymId: "feature" }],
      });
      queryClient.invalidateQueries({ queryKey: ["gyms", { gymId: "upper" }] });
      queryClient.invalidateQueries({
        queryKey: ["users", { user: session?.userId }],
      });
      queryClient.invalidateQueries({ queryKey: ["status"] });
    },
  });

  function handleUpdateStatus(newStatus: HoopingStatus) {
    if (newStatus === status) return;
    updateStatus(newStatus);
  }

  return (
    <View className="flex flex-row gap-4 justify-between items-center">
      <Label nativeID="status">Where are you playing?</Label>
      {isPending ? (
        <Skeleton className="h-4 w-20" />
      ) : (
        <Select
          className="flex-1"
          defaultValue={{
            value: status!,
            label:
              hoopingStatuses.find((s) => s.value === status)?.label! ||
              "Not Hooping",
          }}
        >
          <SelectTrigger>
            <SelectValue
              placeholder="Select a status"
              className="text-foreground text-sm"
            />
            <SelectContent>
              <SelectGroup>
                {hoopingStatuses.map((status) => (
                  <SelectItem
                    key={status.value}
                    value={status.value}
                    label={status.label}
                    onPress={() =>
                      handleUpdateStatus(status.value as HoopingStatus)
                    }
                  />
                ))}
              </SelectGroup>
            </SelectContent>
          </SelectTrigger>
        </Select>
      )}
    </View>
  );
}
