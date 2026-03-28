import '../global.css';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

export default function RootLayout() {
  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="home" />
        <Stack.Screen name="form" />
        <Stack.Screen name="result" />
        <Stack.Screen name="scanner" />
        <Stack.Screen name="profile/[id]" />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}

