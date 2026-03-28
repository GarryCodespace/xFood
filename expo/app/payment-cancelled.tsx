import React from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import { router } from 'expo-router';
import { Colors } from '@/constants/colors';
import { XCircle, ArrowLeft, RotateCcw } from 'lucide-react-native';

export default function PaymentCancelledScreen() {
  const handleGoHome = () => {
    router.replace('/(tabs)');
  };

  const handleTryAgain = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      <View style={styles.cancelledContainer}>
        <XCircle size={80} color={Colors.error} />
        <Text style={styles.cancelledTitle}>Payment Cancelled</Text>
        <Text style={styles.cancelledMessage}>
          Your payment was cancelled. No charges were made to your account.
        </Text>

        <View style={styles.buttonContainer}>
          <Pressable style={styles.primaryButton} onPress={handleTryAgain}>
            <RotateCcw size={20} color={Colors.white} />
            <Text style={styles.primaryButtonText}>Try Again</Text>
          </Pressable>
          
          <Pressable style={styles.secondaryButton} onPress={handleGoHome}>
            <ArrowLeft size={20} color={Colors.primary} />
            <Text style={styles.secondaryButtonText}>Back to Home</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  cancelledContainer: {
    alignItems: 'center',
    maxWidth: 400,
    width: '100%',
  },
  cancelledTitle: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: Colors.text,
    marginTop: 20,
    marginBottom: 12,
    textAlign: 'center',
  },
  cancelledMessage: {
    fontSize: 16,
    color: Colors.textLight,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
  },
  buttonContainer: {
    width: '100%',
    gap: 12,
  },
  primaryButton: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  primaryButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600' as const,
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    gap: 8,
  },
  secondaryButtonText: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: '500' as const,
  },
});