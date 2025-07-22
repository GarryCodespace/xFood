import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Stack, router } from 'expo-router';
import { TasteProfileBuilder } from '@/components/TasteProfileBuilder';
import { useAuth } from '@/hooks/auth-store';
import { TasteProfile } from '@/types';
import { Colors } from '@/constants/colors';

export default function TasteProfileSetupScreen() {
  const { currentUser, updateProfile } = useAuth();

  const handleSaveProfile = async (profile: TasteProfile) => {
    console.log('handleSaveProfile called with:', profile);
    console.log('Current user:', currentUser);
    try {
      const result = await updateProfile({ tasteProfile: profile });
      console.log('updateProfile result:', result);
      if (result.success) {
        console.log('Profile saved successfully, navigating back');
        router.replace('/(tabs)');
      } else {
        console.error('Failed to save profile:', result.error);
      }
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };

  const handleSkip = () => {
    router.replace('/(tabs)');
  };

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: 'Taste Profile',
          headerStyle: { backgroundColor: Colors.background },
          headerTintColor: Colors.text,
        }} 
      />
      <TasteProfileBuilder
        initialProfile={currentUser?.tasteProfile}
        onSave={handleSaveProfile}
        onSkip={handleSkip}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
});