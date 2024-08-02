import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, FieldValues, useForm } from "react-hook-form";
import { ActivityIndicator, View } from "react-native";
import * as zod from "zod";
import { useSession } from "~/components/providers/SessionProvider";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
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

const schema = zod.object({
  height: zod.object({
    feet: zod.preprocess(
      (a) => parseInt(a as string),
      zod.number().int().min(1, { message: "Feet must be at least 1." })
    ),
    inches: zod.preprocess(
      (a) => parseInt(a as string),
      zod
        .number()
        .int()
        .min(0, { message: "Inches must be at least 0" })
        .max(11, { message: "Inches must be less than 12." })
    ),
  }),
  weight: zod.preprocess(
    (a) => parseFloat(a as string),
    zod.number().min(1, { message: "Weight must be at least 1." })
  ),
  position: zod.enum(positionsEnum, { message: "Invalid position." }),
  primarySkill: zod.enum(skillsEnum, { message: "Invalid skill." }),
  secondarySkill: zod.enum(skillsEnum, { message: "Invalid skill." }),
});

type FormValues = zod.infer<typeof schema>;

export default function SetUpForm() {
  const { setUp, isSetUpPending } = useSession()

  const {
    control,
    handleSubmit,
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
      weight: undefined,
    },
  });

  function onSubmit(data: FieldValues) {
    setUp(data as FormValues)
  }

  return (
    <View className="flex flex-col gap-6">
      <View className="flex-col gap-6">
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
      <Button
        variant="gold"
        onPress={handleSubmit(onSubmit)}
        className="flex-row gap-2 items-center"
      >
        <Text className="text-background">Set Up Account</Text>
        { isSetUpPending && (
          <ActivityIndicator
            size="small"
            className="text-background"
            hidesWhenStopped
            animating={isSetUpPending}
          />
        )}
      </Button>
    </View>
  );
}
