import React from 'react';
import { StyleSheet, Pressable, View } from 'react-native';
import { Plus } from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import { useRouter } from 'expo-router';

export const CreatePostButton: React.FC = () => {
  const router = useRouter();

  const handlePress = () => {
    router.push('/create-post');
  };

  return (
    <View style={styles.container}>
      <Pressable style={styles.button} onPress={handlePress}>
        <Plus size={24} color={Colors.white} />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 24,
    right: 24,
  },
  button: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
});