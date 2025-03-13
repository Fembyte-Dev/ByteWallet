import { Stack } from 'expo-router';
import IncomesScreen from '@/screens/IncomesScreen';

export default function IncomesTab() {
  return (
    <>
      <Stack.Screen options={{ title: 'Ingresos' }} />
      <IncomesScreen />
    </>
  );
}