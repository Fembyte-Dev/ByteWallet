import { Stack } from 'expo-router';
import DebtsScreen from '@/screens/DebtsScreen';

export default function DebtsTab() {
  return (
    <>
      <Stack.Screen options={{ title: 'Deudas' }} />
      <DebtsScreen />
    </>
  );
}