import { Stack } from "expo-router";

export default function RootLayout() {
  return <Stack>
  <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
  <Stack.Screen name="(tabs)/index" options={{ headerShown: false }} />
  </Stack>
}
//make notes on navigation
//make plasylist clickable and render playlist songs by id