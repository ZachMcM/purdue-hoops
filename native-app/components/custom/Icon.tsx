import { Image } from "react-native";

export default function Icon({ className }: { className?: string }) {
  return (
    <Image className="h-8 w-8 rounded-md" source={require('../../assets/images/icon.png')}/>
  )
}