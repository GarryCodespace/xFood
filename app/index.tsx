import { Redirect } from 'expo-router';
import { useAuth } from '@/hooks/auth-store';
import { View, Text } from 'react-native';
import { Colors } from '@/constants/colors';

export default function IndexScreen() {
  const { isAuthenticated, isLoading } = useAuth();

  console.log('IndexScreen render - isLoading:', isLoading, 'isAuthenticated:', isAuthenticated);

  if (isLoading) {
    console.log('Showing loading screen');
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.background }}>
        <Text style={{ color: Colors.text, fontSize: 16 }}>Loading...</Text>
      </View>
    );
  }

  if (isAuthenticated) {
    console.log('User authenticated, redirecting to tabs');
    return <Redirect href="/(tabs)" />;
  }

  console.log('User not authenticated, redirecting to login');
  return <Redirect href="/login" />;
}