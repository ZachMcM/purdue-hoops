import { Feather } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Controller, FieldValues, useForm } from "react-hook-form";
import { ActivityIndicator, View } from "react-native";
import * as zod from "zod";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Text } from "~/components/ui/text";
import {
  positions,
  positionsEnum,
  skills,
  skillsEnum,
} from "~/constants/config";
import { useColorScheme } from "~/lib/useColorScheme";
import { cn } from "~/lib/utils";
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
    height: zod.object({
      feet: zod.preprocess(
        (a) => parseInt(a as string),
        zod.number().int().min(1, { message: "Feet must be at least 1." }),
      ),
      inches: zod.preprocess(
        (a) => parseInt(a as string),
        zod
          .number()
          .int()
          .min(0, { message: "Inches must be at least 0" })
          .max(11, { message: "Inches must be less than 12." }),
      ),
    }),
    weight: zod.preprocess(
      (a) => parseFloat(a as string),
      zod.number().min(1, { message: "Weight must be at least 1." }),
    ),
    position: zod.enum(positionsEnum, { message: "Invalid position." }),
    primarySkill: zod.enum(skillsEnum, { message: "Invalid skill." }),
    secondarySkill: zod.enum(skillsEnum, { message: "Invalid skill." }),
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
    getValues,
    trigger,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      position: positions[0].value,
      primarySkill: skills[0].value,
      secondarySkill: skills[0].value,
      height: {
        feet: undefined,
        inches: undefined,
      },
      username: "",
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      weight: undefined
    }
  });

  const { isDarkColorScheme } = useColorScheme();

  const { signUp, isSignUpPending } = useSession();

  const [formStep, setFormStep] = useState(0);

  function onSubmit(data: FieldValues) {
    delete data.confirmPassword;
    signUp(data as Omit<FormValues, "confirmPassword">);
  }

  return (
    <View className="flex flex-col gap-6">
      <View className={cn(formStep == 1 ? "hidden" : "flex", "flex-col gap-6")}>
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
              <Label nativeID="email">Email</Label>
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
      <View className={cn(formStep == 0 ? "hidden" : "flex", "flex-col gap-6")}>
        <Controller
          control={control}
          rules={{ required: true }}
          render={({ field: { onChange } }) => (
            <View className="flex flex-col gap-2 flex-1">
              <Label nativeID="position">Position</Label>
              <Select defaultValue={positions[0]}>
                <SelectTrigger className="w-[250px]">
                  <SelectValue
                    className="text-foreground text-sm"
                    placeholder="Select a position"
                  />
                  <SelectContent>
                    <SelectGroup>
                      {positions.map((position) => (
                        <SelectItem
                          key={position.value}
                          value={position.value}
                          label={position.label}
                          onPress={() => onChange(position.value)}
                        >
                          <SelectLabel>{position.label}</SelectLabel>
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </SelectTrigger>
              </Select>
              {errors.position && (
                <Text className="text-red-600 font-medium">
                  {errors.position.message?.toString()}
                </Text>
              )}
            </View>
          )}
          name="position"
        />
        <View className="flex flex-row gap-4 items-center">
          <Controller
            control={control}
            rules={{ required: true }}
            render={({ field: { onChange } }) => (
              <View className="flex flex-col gap-2 flex-1">
                <Label nativeID="primary-skill">Primary Skill</Label>
                <Select defaultValue={skills[0]}>
                  <SelectTrigger>
                    <SelectValue
                      className="text-foreground text-sm"
                      placeholder="Select a primary skill"
                    />
                    <SelectContent>
                      <SelectGroup>
                        {skills.map((skill) => (
                          <SelectItem
                            key={skill.value}
                            value={skill.value}
                            label={skill.label}
                            onPress={() => onChange(skill.value)}
                          >
                            <SelectLabel>{skill.label}</SelectLabel>
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </SelectTrigger>
                </Select>
                {errors.primarySkill && (
                  <Text className="text-red-600 font-medium">
                    {errors.primarySkill.message?.toString()}
                  </Text>
                )}
              </View>
            )}
            name="primarySkill"
          />
          <Controller
            control={control}
            rules={{ required: true }}
            render={({ field: { onChange } }) => (
              <View className="flex flex-col gap-2 flex-1">
                <Label nativeID="secondary-skill">Secondary Skill</Label>
                <Select defaultValue={skills[0]}>
                  <SelectTrigger>
                    <SelectValue
                      className="text-foreground text-sm"
                      placeholder="Select a primary skill"
                    />
                    <SelectContent>
                      <SelectGroup>
                        {skills.map((skill) => (
                          <SelectItem
                            key={skill.value}
                            value={skill.value}
                            label={skill.label}
                            onPress={() => onChange(skill.value)}
                          >
                            <SelectLabel>{skill.label}</SelectLabel>
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </SelectTrigger>
                </Select>
                {errors.secondarySkill && (
                  <Text className="text-red-600 font-medium">
                    {errors.secondarySkill.message?.toString()}
                  </Text>
                )}
              </View>
            )}
            name="secondarySkill"
          />
        </View>
        <View className="flex flex-col gap-2">
          <Text className="dark:text-white text-lg font-semibold">Height</Text>
          <View className="flex flex-row gap-4">
            <Controller
              control={control}
              rules={{ required: true }}
              render={({ field: { onChange, onBlur, value } }) => (
                <View className="flex flex-col gap-2 flex-1">
                  <Label nativeID="feet">Feet</Label>
                  <Input
                    inputMode="numeric"
                    placeholder="6"
                    onBlur={onBlur}
                    onChangeText={(val) => onChange(Number(val))}
                    value={value}
                    keyboardType="numeric"
                  />
                  {errors.height?.feet && (
                    <Text className="text-red-600 font-medium">
                      {errors.height.feet.message?.toString()}
                    </Text>
                  )}
                </View>
              )}
              name="height.feet"
            />
            <Controller
              control={control}
              rules={{ required: true }}
              render={({ field: { onChange, onBlur, value } }) => (
                <View className="flex flex-col gap-2 flex-1">
                  <Label nativeID="inches">Inches</Label>
                  <Input
                    inputMode="numeric"
                    placeholder="4"
                    onBlur={onBlur}
                    onChangeText={(val) => onChange(Number(val))}
                    value={value}
                    keyboardType="numeric"
                  />

                  {errors.height?.inches && (
                    <Text className="text-red-600 font-medium">

                      {errors.height?.inches.message?.toString()}
                    </Text>
                  )}
                </View>
              )}
              name="height.inches"
            />
          </View>
        </View>
        <Controller
          control={control}
          rules={{ required: true }}
          render={({ field: { onChange, onBlur, value } }) => (
            <View className="flex flex-col gap-2 flex-1">
              <Label nativeID="weight">Weight (lbs)</Label>
              <Input
                inputMode="decimal"
                placeholder="185"
                onBlur={onBlur}
                onChangeText={(val) => onChange(Number(val))}
                value={value}
                keyboardType="numeric"
              />
              {errors.weight && (
                <Text className="text-red-600 font-medium">
                  {errors?.weight.message?.toString()}
                </Text>
              )}
            </View>
          )}
          name="weight"
        />
      </View>
      <View className="flex flex-row gap-4 items-center">
        <Button
          variant="ghost"
          className={cn(
            formStep == 0 ? "hidden" : "flex",
            "flex-row gap-2 items-center",
          )}
          onPress={() => setFormStep(0)}
        >
          <Feather
            name="arrow-left"
            size={18}
            color={isDarkColorScheme ? "white" : "black"}
          />
          <Text>Back</Text>
        </Button>
        <Button
          variant="gold"
          onPress={handleSubmit(onSubmit)}
          className={cn(
            formStep == 0 ? "hidden" : "flex",
            "flex-row gap-2 items-center",
          )}
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
        <Button
          variant="gold"
          onPress={() => {
            const usernameState = control.getFieldState("username");
            const nameState = control.getFieldState("name");
            const emailState = control.getFieldState("email");
            const passwordState = control.getFieldState("password");
            const confirmPasswordState =
              control.getFieldState("confirmPassword");

            trigger([
              "username",
              "name",
              "email",
              "password",
              "confirmPassword",
            ]);

            if (!usernameState.isDirty || usernameState.invalid) return;
            if (!nameState.isDirty || nameState.invalid) return;
            if (!emailState.isDirty || emailState.invalid) return;
            if (!passwordState.isDirty || passwordState.invalid) return;
            if (!confirmPasswordState.isDirty || confirmPasswordState.invalid)
              return;
            if (getValues("password") !== getValues("confirmPassword")) return;

            setFormStep(1);
          }}
          className={cn(
            formStep == 1 ? "hidden" : "flex",
            "flex-row gap-2 items-center",
          )}
        >
          <Text className="text-background">Next Step</Text>
          <Feather
            name="arrow-right"
            size={18}
            color={isDarkColorScheme ? "#09090b" : "white"}
          />
        </Button>
      </View>
    </View>
  );
}
