import React from 'react';
import { StyleSheet, View, Text, Image, Pressable } from 'react-native';
import { Users } from 'lucide-react-native';
import { PastryCircle } from '@/types';
import { Colors } from '@/constants/colors';
import { useRouter } from 'expo-router';

interface CircleCardProps {
  circle: PastryCircle;
}

export const CircleCard: React.FC<CircleCardProps> = ({ circle }) => {
  const router = useRouter();

  const handlePress = () => {
    router.push(`/circle/${circle.id}`);
  };

  return (
    <Pressable style={styles.container} onPress={handlePress}>
      <Image source={{ uri: circle.image }} style={styles.image} />
      <View style={styles.overlay} />
      <View style={styles.content}>
        <Text style={styles.title}>{circle.name}</Text>
        <View style={styles.typeTag}>
          <Text style={styles.typeText}>{circle.type}</Text>
        </View>
        <View style={styles.footer}>
          <View style={styles.memberCount}>
            <Users size={14} color={Colors.white} />
            <Text style={styles.memberText}>{circle.memberCount} members</Text>
          </View>
          {circle.isJoined && (
            <View style={styles.joinedBadge}>
              <Text style={styles.joinedText}>Joined</Text>
            </View>
          )}
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 160,
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  content: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.white,
    marginBottom: 8,
  },
  typeTag: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  typeText: {
    color: Colors.white,
    fontWeight: '500' as const,
    fontSize: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  memberCount: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  memberText: {
    fontSize: 12,
    color: Colors.white,
    marginLeft: 4,
  },
  joinedBadge: {
    backgroundColor: Colors.success,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  joinedText: {
    color: Colors.white,
    fontWeight: '500' as const,
    fontSize: 12,
  },
});