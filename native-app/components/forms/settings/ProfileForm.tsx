import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ImagePickerAsset } from "expo-image-picker";
import { getItemAsync } from "expo-secure-store";
import { Controller, FieldValues, useForm } from "react-hook-form";
import { ActivityIndicator, View } from "react-native";
import Toast from "react-native-toast-message";
import * as zod from "zod";
import ImageDropzone from "~/components/custom/ImageDropzone";
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
import { useSession } from "../../providers/SessionProvider";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";

const schema = zod.object({
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
  image: zod.custom<ImagePickerAsset>((v) => v).nullable(),
});

type FormValues = zod.infer<typeof schema>;

export default function ProfileForm() {
  const { session } = useSession();
  // TODO delete later
  console.log(
    "Skills: %s, %s",
    session?.user.primarySkill,
    session?.user.secondarySkill,
  );

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      height: {
        feet: session?.user.feet,
        inches: session?.user.inches,
      },
      weight: session?.user.weight,
      position: session?.user.position,
      primarySkill: session?.user.primarySkill,
      secondarySkill: session?.user.secondarySkill,
      image: null,
    },
  });

  const queryClient = useQueryClient();

  const { mutate: updateProfile, isPending: isProfileUpdating } = useMutation({
    mutationFn: async (reqBody: FormValues) => {
      const accessToken = await getItemAsync("Access-Token");
      const res = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/users/profile`,
        {
          method: "PUT",
          body: JSON.stringify(reqBody),
          headers: {
            "Access-Token": accessToken!,
            "Content-Type": "application/json",
          },
        },
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error);
      }

      return data;
    },
    onSuccess: () => {
      Toast.show({
        type: "success",
        text2: "Successfully updated profile.",
      });

      queryClient.invalidateQueries({ queryKey: ["leaderboard"] });
      queryClient.invalidateQueries({ queryKey: ["session"] });
      queryClient.invalidateQueries({
        queryKey: ["users", { userId: session?.userId }],
      });
      queryClient.invalidateQueries({
        queryKey: ["gyms", { gymId: session?.user.hoopingStatus }],
      });
    },
    onError: (err) => {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: err.message,
      });
    },
  });

  async function onSubmit(data: FieldValues) {
    updateProfile(data as FormValues);
  }

  return (
    <View className="flex flex-col gap-6">
      <Text className="font-bold text-3xl">Profile</Text>
      <View className="flex flex-col gap-10">
        <Controller
          control={control}
          rules={{ required: true }}
          render={({ field: { onChange } }) => (
            <View className="flex flex-col gap-2 flex-1">
              <View className="flex flex-row w-full justify-between items-center">
                <View className="flex flex-col gap-1">
                  <Text className="text-lg font-semibold">Image</Text>
                  <Text className="font-medium text-muted-foreground">
                    Edit your profile image.
                  </Text>
                </View>
                <ImageDropzone
                  updateForm={onChange}
                  initUrl={session?.user.image || ""}
                />
              </View>
              {errors.position && (
                <Text className="text-red-600 font-medium">
                  {errors.position.message?.toString()}
                </Text>
              )}
            </View>
          )}
          name="image"
        />
        <Controller
          control={control}
          rules={{ required: true }}
          render={({ field: { onChange, value } }) => (
            <View className="flex flex-col gap-2 flex-1">
              <View className="flex flex-row w-full justify-between items-center">
                <View className="flex flex-col">
                  <Text className="font-semibold text-lg">Postion</Text>
                  <Text className="font-medium text-muted-foreground">
                    Edit your position.
                  </Text>
                </View>
                <Select
                  defaultValue={{
                    value: value || "",
                    label:
                      positions.find(
                        (position) => position.value === session?.user.position,
                      )?.label || "",
                  }}
                >
                  <SelectTrigger className="w-[175px]">
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
              </View>
              {errors.position && (
                <Text className="text-red-600 font-medium">
                  {errors.position.message?.toString()}
                </Text>
              )}
            </View>
          )}
          name="position"
        />
        <View className="flex flex-col gap-6">
          <View className="flex flex-col gap-1">
            <Text className="text-lg font-semibold">Skills</Text>
            <Text className="font-medium text-muted-foreground">
              Edit your primary and secondary skills.
            </Text>
          </View>
          <View className="flex flex-row gap-4 items-center">
            <Controller
              control={control}
              rules={{ required: true }}
              render={({ field: { onChange, value } }) => (
                <View className="flex flex-col gap-2 flex-1">
                  <Label nativeID="primary-skill">Primary Skill</Label>
                  <Select
                    defaultValue={{
                      value: value || "",
                      label:
                        skills.find((skill) => skill.value === value)?.label ||
                        "",
                    }}
                  >
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
              render={({ field: { onChange, value } }) => (
                <View className="flex flex-col gap-2 flex-1">
                  <Label nativeID="secondary-skill">Secondary Skill</Label>
                  <Select
                    defaultValue={{
                      value: value || "",
                      label:
                        skills.find((skill) => skill.value === value)?.label ||
                        "",
                    }}
                  >
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
        </View>
        <View className="flex flex-col gap-6">
          <View className="flex flex-col gap-1">
            <Text className="font-semibold text-lg">Height</Text>
            <Text className="font-medium text-muted-foreground">
              Edit your height in feet and inches.
            </Text>
          </View>
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
                    onChangeText={onChange}
                    value={value?.toString()}
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
                    onChangeText={onChange}
                    value={value?.toString()}
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
              <View className="flex flex-row w-full justify-between items-center">
                <View className="flex flex-col gap-1">
                  <Text className="font-semibold text-lg">Weight (lbs)</Text>
                  <Text className="font-medium text-muted-foreground">
                    Edit your weight in pounds.
                  </Text>
                </View>
                <Input
                  inputMode="decimal"
                  className="w-[125px]"
                  placeholder="185"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value?.toString()}
                  keyboardType="numeric"
                />
              </View>
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
      <Button
        variant="gold"
        onPress={handleSubmit(onSubmit)}
        className="flex flex-row gap-2"
      >
        <Text className="text-background">Save</Text>
        <ActivityIndicator
          size="small"
          hidesWhenStopped
          animating={isProfileUpdating}
          className="text-background"
        />
      </Button>
    </View>
  );
}
