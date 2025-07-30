import { Redirect } from 'expo-router';
import { useAuth } from '@/hooks/auth-store';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { Colors } from '@/constants/colors';
import { useEffect, useState } from 'react';

export default function IndexScreen() {
  const { isAuthenticated, isLoading, error } = useAuth();
  const [showContent, setShowContent] = useState(false);
  const [debugMode, setDebugMode] = useState(false);

  console.log('IndexScreen render - isLoading:', isLoading, 'isAuthenticated:', isAuthenticated);

  useEffect(() => {
    // Add a small delay to prevent flash of content
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 100);
    
    // Enable debug mode after 5 seconds if still loading
    const debugTimer = setTimeout(() => {
      if (isLoading) {
        console.log('Enabling debug mode due to long loading time');
        setDebugMode(true);
      }
    }, 5000);
    
    return () => {
      clearTimeout(timer);
      clearTimeout(debugTimer);
    };
  }, [isLoading]);

  if (!showContent) {
    console.log('Showing initial loading screen');
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Starting app...</Text>
      </View>
    );
  }

  if (isLoading && !debugMode) {
    console.log('Showing auth loading screen');
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Loading...</Text>
        <Text style={styles.debugText}>Checking authentication...</Text>
        {error && (
          <Text style={styles.errorText}>Error: {error}</Text>
        )}
      </View>
    );
  }

  if (debugMode) {
    console.log('Debug mode: bypassing auth check');
    return <Redirect href="/login" />;
  }

  if (isAuthenticated) {
    console.log('User authenticated, redirecting to tabs');
    return <Redirect href="/(tabs)" />;
  }

  console.log('User not authenticated, redirecting to login');
  return <Redirect href="/login" />;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
    gap: 16,
    padding: 20,
  },
  loadingText: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: '500' as const,
    textAlign: 'center',
  },
  debugText: {
    color: Colors.textLight,
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
  },
  errorText: {
    color: Colors.error,
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
  },
});