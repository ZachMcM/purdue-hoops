import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, FieldValues, useForm } from "react-hook-form";
import { ActivityIndicator, View } from "react-native";
import * as zod from "zod";
import { Text } from "~/components/ui/text";
import { useSession } from "../../providers/SessionProvider";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";

const schema = zod
  .object({
    email: zod
      .string()
      .min(1, { message: "Email is required." })
      .endsWith("@purdue.edu", { message: "Email must be a Purdue email." }),
    password: zod
      .string()
      .min(8, { message: "Password can't be less than 8 characters." }),
    confirmPassword: zod
      .string()
      .min(8, { message: "Password can't be less than 8 characters." }),
    name: zod
      .string()
      .min(1, { message: "Name is required." })
      .max(50, { message: "Name must be less than 50 characters." }),
    username: zod
      .string()
      .min(1, { message: "Username is required." })
      .max(50, { message: "Username must be less than 50 characters." }),
  })
  .refine(({ password, confirmPassword }) => confirmPassword === password, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type FormValues = zod.infer<typeof schema>;

export default function SignUpForm() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      username: "",
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const { signUp, isSignUpPending } = useSession();

  function onSubmit(data: FieldValues) {
    delete data.confirmPassword;
    signUp(data as Omit<FormValues, "confirmPassword">);
  }

  return (
    <View className="flex flex-col gap-6">
      <View className="flex flex-col gap-6">
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
              <Label nativeID="email">Email (must end in purdue.edu)</Label>
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
        <Controller
          control={control}
          rules={{ required: true }}
          render={({ field: { onChange, onBlur, value } }) => (
            <View className="flex flex-col gap-2">
              <Label nativeID="password">Password</Label>
              <Input
                secureTextEntry
                placeholder=""
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
              {errors.password && (
                <Text className="text-red-600 font-medium">
                  {errors.password.message?.toString()}
                </Text>
              )}
            </View>
          )}
          name="password"
        />
        <Controller
          control={control}
          rules={{ required: true }}
          render={({ field: { onChange, onBlur, value } }) => (
            <View className="flex flex-col gap-2">
              <Label nativeID="confirmPassword">Confirm Password</Label>
              <Input
                secureTextEntry
                placeholder=""
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
              {errors.confirmPassword && (
                <Text className="text-red-600 font-medium">
                  {errors.confirmPassword.message?.toString()}
                </Text>
              )}
            </View>
          )}
          name="confirmPassword"
        />
      </View>

      <Button
        variant="gold"
        onPress={handleSubmit(onSubmit)}
        className="flex-row gap-2 items-center"
      >
        <Text className="text-background">Sign Up</Text>
        {isSignUpPending && (
          <ActivityIndicator
            size="small"
            className="text-background"
            hidesWhenStopped
            animating={isSignUpPending}
          />
        )}
      </Button>
    </View>
  );
}
