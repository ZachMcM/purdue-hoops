import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, FieldValues, useForm } from "react-hook-form";
import { ActivityIndicator, View } from "react-native";
import * as zod from "zod";
import { Text } from "~/components/ui/text";
import { useSession } from "../../providers/SessionProvider";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";

const schema = zod.object({
  email: zod.string().min(1, { message: "Email or username is required." }),
  password: zod.string().min(1, { message: "Password is required." }),
});

type FormValues = zod.infer<typeof schema>;

export default function SignInForm() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const { signIn, isSignInPending } = useSession();

  function onSubmit(data: FieldValues) {
    console.log("sign in form values: ", data);
    signIn(data as FormValues);
  }

  return (
    <View className="flex flex-col gap-6">
      <Controller
        control={control}
        rules={{ required: true }}
        render={({ field: { onChange, onBlur, value } }) => (
          <View className="flex flex-col gap-2">
            <Label nativeID="email">Email or username</Label>
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

      <Button
        variant="gold"
        onPress={handleSubmit(onSubmit)}
        className="flex flex-row gap-2"
      >
        <Text className="text-background">Sign In</Text>
        <ActivityIndicator
          size="small"
          className="text-background"
          hidesWhenStopped
          animating={isSignInPending}
        />
      </Button>
    </View>
  );
}
