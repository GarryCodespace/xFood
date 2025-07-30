import { Redirect } from 'expo-router';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Colors } from '@/constants/colors';
import { useState } from 'react';
import { router } from 'expo-router';

export default function IndexScreen() {
  const [showDebug, setShowDebug] = useState(false);

  console.log('IndexScreen rendering - simple test version');

  if (showDebug) {
    return (
      <View style={styles.debugContainer}>
        <Text style={styles.debugTitle}>Debug Screen</Text>
        <Text style={styles.debugText}>App is working!</Text>
        <Text style={styles.debugText}>Platform: {require('react-native').Platform.OS}</Text>
        <Pressable 
          style={styles.button}
          onPress={() => router.push('/login')}
        >
          <Text style={styles.buttonText}>Go to Login</Text>
        </Pressable>
        <Pressable 
          style={styles.button}
          onPress={() => router.push('/(tabs)')}
        >
          <Text style={styles.buttonText}>Go to Tabs</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pastry Share</Text>
      <Text style={styles.subtitle}>Welcome to the app!</Text>
      <Pressable 
        style={styles.button}
        onPress={() => setShowDebug(true)}
      >
        <Text style={styles.buttonText}>Show Debug Info</Text>
      </Pressable>
      <Pressable 
        style={styles.button}
        onPress={() => router.push('/login')}
      >
        <Text style={styles.buttonText}>Go to Login</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
    padding: 20,
  },
  debugContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
    padding: 20,
    gap: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: '700' as const,
    color: Colors.primary,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: Colors.text,
    marginBottom: 32,
    textAlign: 'center',
  },
  debugTitle: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 16,
  },
  debugText: {
    fontSize: 16,
    color: Colors.textLight,
    textAlign: 'center',
    marginBottom: 8,
  },
  button: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 12,
    minWidth: 200,
  },
  buttonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600' as const,
    textAlign: 'center',
  },
});