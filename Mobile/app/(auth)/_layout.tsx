import { Stack } from "expo-router";

export default function AuthLayout() {
  // Layout for authentication screens
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
    </Stack>
  );
}
