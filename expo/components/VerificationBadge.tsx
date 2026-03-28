import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Shield, Award } from 'lucide-react-native';
import { Colors } from '@/constants/colors';

interface VerificationBadgeProps {
  isVerified?: boolean;
  verificationMethod?: 'license' | 'quiz';
  size?: 'small' | 'medium';
}

export const VerificationBadge: React.FC<VerificationBadgeProps> = ({ 
  isVerified = false, 
  verificationMethod,
  size = 'small'
}) => {
  if (!isVerified) return null;

  const iconSize = size === 'small' ? 12 : 16;
  const containerStyle = size === 'small' ? styles.smallContainer : styles.mediumContainer;
  const textStyle = size === 'small' ? styles.smallText : styles.mediumText;

  return (
    <View style={[styles.container, containerStyle]}>
      {verificationMethod === 'license' ? (
        <Shield size={iconSize} color={Colors.white} />
      ) : (
        <Award size={iconSize} color={Colors.white} />
      )}
      <Text style={[styles.text, textStyle]}>
        {verificationMethod === 'license' ? 'Licensed' : 'Verified'}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.success,
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  smallContainer: {
    paddingHorizontal: 4,
    paddingVertical: 1,
  },
  mediumContainer: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  text: {
    color: Colors.white,
    fontWeight: '600' as const,
    marginLeft: 2,
  },
  smallText: {
    fontSize: 10,
  },
  mediumText: {
    fontSize: 12,
  },
});