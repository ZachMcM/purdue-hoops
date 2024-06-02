import {
  ImagePickerAsset,
  MediaTypeOptions,
  launchImageLibraryAsync,
} from "expo-image-picker";
import { useState } from "react";
import { Image, Text, View } from "react-native";
import { Button } from "../ui/button";

export default function ImageDropzone({
  initUrl,
  updateForm,
}: {
  initUrl?: string;
  updateForm: (file: ImagePickerAsset) => void;
}) {
  const [url, setUrl] = useState(initUrl);

  async function pickImage() {
    const result = await launchImageLibraryAsync({
      mediaTypes: MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
      base64: true,
    });

    console.log(result.assets ? result.assets[0].mimeType : "no file");

    if (!result.canceled) {
      updateForm(result.assets[0]);
      setUrl(result.assets[0].uri);
    }
  }

  return (
    <View className="flex flex-col gap-4">
      <Image
        source={url ? { uri: url } : {}}
        className="h-16 w-16 bg-secondary rounded-full relative"
      />
      <Button onPress={pickImage} className=" !opacity-0 absolute inset-0">
        <Text>Upload Image</Text>
      </Button>
    </View>
  );
}
