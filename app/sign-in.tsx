// app/sign-in.tsx
import { SignedIn } from "@clerk/clerk-expo";
import { View } from "react-native";

export default function SignInScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <SignedIn />
    </View>
  );
}
