import React from 'react';
import { StyleSheet, View, Text, Image, Pressable } from 'react-native';
import { Star, MapPin, MessageCircle, Award } from 'lucide-react-native';
import { User } from '@/types';
import { Colors } from '@/constants/colors';
import { VerificationBadge } from './VerificationBadge';

interface ProfileHeaderProps {
  user: User;
  isCurrentUser?: boolean;
  onEditProfile?: () => void;
  onMessage?: () => void;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({ 
  user, 
  isCurrentUser = false,
  onEditProfile,
  onMessage
}) => {
  const getLocationDisplay = () => {
    switch (user.locationPrivacy) {
      case 'hidden': return 'Location hidden';
      case 'city': return user.location.split(',')[0]; // Show only city
      default: return user.location; // Show full location
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <Image source={{ uri: user.avatar }} style={styles.avatar} />
        
        <View style={styles.infoContainer}>
          <View style={styles.nameRow}>
            <Text style={styles.name}>{user.name}</Text>
            <VerificationBadge 
              isVerified={user.isVerified} 
              verificationMethod={user.verificationMethod}
              size="medium"
            />
          </View>
          
          <View style={styles.ratingContainer}>
            <Star size={16} color={Colors.primary} fill={Colors.primary} />
            <Text style={styles.rating}>{user.rating.toFixed(1)}</Text>
          </View>
          
          <View style={styles.locationContainer}>
            <MapPin size={14} color={Colors.textLight} />
            <Text style={styles.location}>{getLocationDisplay()}</Text>
          </View>
          
          <View style={styles.kitchenTypeContainer}>
            <Text style={styles.kitchenType}>{user.kitchenType}</Text>
          </View>
        </View>
      </View>
      
      {user.bakePoints !== undefined && (
        <View style={styles.pointsContainer}>
          <Award size={16} color={Colors.primary} />
          <Text style={styles.points}>{user.bakePoints} BakePoints</Text>
        </View>
      )}
      
      <View style={styles.buttonContainer}>
        {isCurrentUser ? (
          <Pressable style={styles.editButton} onPress={onEditProfile}>
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </Pressable>
        ) : (
          <Pressable style={styles.messageButton} onPress={onMessage}>
            <MessageCircle size={16} color={Colors.white} />
            <Text style={styles.messageButtonText}>Message</Text>
          </Pressable>
        )}
      </View>
      
      {user.bio && (
        <Text style={styles.bio}>{user.bio}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: Colors.white,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  topRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
    borderWidth: 3,
    borderColor: Colors.primary,
  },
  infoContainer: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  name: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.text,
    marginRight: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  rating: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.text,
    marginLeft: 4,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  location: {
    fontSize: 14,
    color: Colors.textLight,
    marginLeft: 4,
  },
  kitchenTypeContainer: {
    backgroundColor: Colors.accent1,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  kitchenType: {
    fontSize: 12,
    fontWeight: '500' as const,
    color: Colors.accent2,
  },
  pointsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  points: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.primary,
    marginLeft: 4,
  },
  buttonContainer: {
    marginBottom: 16,
  },
  editButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  editButtonText: {
    color: Colors.white,
    fontWeight: '600' as const,
    fontSize: 14,
  },
  messageButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  messageButtonText: {
    color: Colors.white,
    fontWeight: '600' as const,
    fontSize: 14,
    marginLeft: 4,
  },
  bio: {
    fontSize: 14,
    color: Colors.text,
    lineHeight: 20,
  },
});