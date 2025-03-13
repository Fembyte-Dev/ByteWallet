import { Stack } from 'expo-router';
import HomeScreen from '@/screens/HomeScreen';

export default function HomeTab() {
  return (
    <>
      <Stack.Screen options={{ title: 'Home' }} />
      <HomeScreen />
    </>
  );
}
