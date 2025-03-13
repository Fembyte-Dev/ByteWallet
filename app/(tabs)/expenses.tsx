import { Stack } from 'expo-router';
import ExpensesScreen from '@/screens/ExpensesScreen';

export default function ExpensesTab() {
  return (
    <>
      <Stack.Screen options={{ title: 'Gastos' }} />
      <ExpensesScreen />
    </>
  );
}