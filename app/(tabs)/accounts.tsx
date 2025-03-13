import { Stack } from 'expo-router';
import AccountsScreen from '@/screens/AccountsScreen';

export default function AccountsTab() {
  return (
    <>
      <Stack.Screen options={{ title: 'Cuentas' }} />
      <AccountsScreen />
    </>
  );
}