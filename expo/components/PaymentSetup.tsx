import React, { useState } from 'react';
import { StyleSheet, View, Text, Pressable, Alert, ActivityIndicator } from 'react-native';
import { Colors } from '@/constants/colors';
import { CreditCard, Shield, CheckCircle } from 'lucide-react-native';
import { apiService } from '@/utils/api';

interface PaymentSetupProps {
  onSetupComplete?: () => void;
  isRequired?: boolean;
}

export const PaymentSetup: React.FC<PaymentSetupProps> = ({ 
  onSetupComplete,
  isRequired = false 
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSetup, setIsSetup] = useState(false);

  const handleSetupPayments = async () => {
    setIsLoading(true);

    try {
      // Create Stripe Connect account
      const data = await apiService.setupPayments({
        userId: 'current_user_id', // Replace with actual user ID
        businessType: 'individual',
        country: 'US',
        email: 'user@example.com', // Replace with actual user email
      });

      if (!data.success) {
        throw new Error('Failed to setup payments');
      }
      
      if (data.onboardingUrl) {
        // In a real app, you would open this URL in a web browser
        // For now, we'll simulate successful setup
        Alert.alert(
          'Payment Setup',
          'Please complete your payment setup in the browser that just opened.',
          [
            {
              text: 'I completed setup',
              onPress: () => {
                setIsSetup(true);
                Alert.alert(
                  'Payment Setup Complete!',
                  'You can now receive payments for your recipes and pastries.',
                  [{ text: 'OK', onPress: onSetupComplete }]
                );
              }
            },
            {
              text: 'Cancel',
              style: 'cancel'
            }
          ]
        );
      } else {
        setIsSetup(true);
        Alert.alert(
          'Payment Setup Complete!',
          'You can now receive payments for your recipes and pastries.',
          [{ text: 'OK', onPress: onSetupComplete }]
        );
      }
    } catch (error) {
      console.error('Payment setup error:', error);
      Alert.alert(
        'Setup Failed',
        'Failed to setup payments. Please try again or contact support.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (isSetup) {
    return (
      <View style={styles.setupComplete}>
        <CheckCircle size={24} color={Colors.success} />
        <Text style={styles.setupCompleteText}>Payment setup complete</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <CreditCard size={24} color={Colors.primary} />
        <Text style={styles.title}>Set Up Payments</Text>
      </View>
      
      <Text style={styles.description}>
        {isRequired 
          ? 'You need to set up payments to sell premium recipes and pastries.'
          : 'Set up payments to start earning from your recipes and pastries.'
        }
      </Text>
      
      <View style={styles.features}>
        <View style={styles.feature}>
          <Shield size={16} color={Colors.success} />
          <Text style={styles.featureText}>Secure payments via Stripe</Text>
        </View>
        <View style={styles.feature}>
          <Shield size={16} color={Colors.success} />
          <Text style={styles.featureText}>Automatic fee calculation</Text>
        </View>
        <View style={styles.feature}>
          <Shield size={16} color={Colors.success} />
          <Text style={styles.featureText}>Weekly payouts</Text>
        </View>
      </View>
      
      <Pressable 
        style={[styles.setupButton, isLoading && styles.setupButtonLoading]}
        onPress={handleSetupPayments}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color={Colors.white} />
        ) : (
          <Text style={styles.setupButtonText}>Set Up Payments</Text>
        )}
      </Pressable>
      
      <Text style={styles.disclaimer}>
        By setting up payments, you agree to Stripe's terms of service and our marketplace fee of 8%.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 20,
    margin: 16,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.text,
    marginLeft: 8,
  },
  description: {
    fontSize: 14,
    color: Colors.textLight,
    lineHeight: 20,
    marginBottom: 16,
  },
  features: {
    marginBottom: 20,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  featureText: {
    fontSize: 14,
    color: Colors.text,
    marginLeft: 8,
  },
  setupButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  setupButtonLoading: {
    opacity: 0.7,
  },
  setupButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600' as const,
  },
  disclaimer: {
    fontSize: 12,
    color: Colors.textLight,
    textAlign: 'center',
    lineHeight: 16,
  },
  setupComplete: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.lightGray,
    padding: 12,
    borderRadius: 8,
    margin: 16,
  },
  setupCompleteText: {
    fontSize: 14,
    color: Colors.success,
    fontWeight: '600' as const,
    marginLeft: 8,
  },
});