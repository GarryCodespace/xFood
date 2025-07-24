import React, { useState } from 'react';
import { StyleSheet, View, Text, Pressable, Alert, ActivityIndicator, Modal, Platform, Linking } from 'react-native';
import { Colors } from '@/constants/colors';
import { CreditCard, Lock, CheckCircle } from 'lucide-react-native';
import { trpcClient } from '@/lib/trpc';
import { stripePromise } from '@/lib/stripe';

interface PaymentProcessorProps {
  visible: boolean;
  onClose: () => void;
  amount: number;
  currency?: string;
  sellerId: string;
  buyerId: string;
  itemId: string;
  itemTitle: string;
  onSuccess?: (paymentId: string) => void;
  onError?: (error: string) => void;
}

export const PaymentProcessor: React.FC<PaymentProcessorProps> = ({
  visible,
  onClose,
  amount,
  currency = 'USD',
  sellerId,
  buyerId,
  itemId,
  itemTitle,
  onSuccess,
  onError,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const platformFeePercent = 8; // 8% platform fee
  const platformFee = amount * (platformFeePercent / 100);
  const sellerAmount = amount - platformFee;

  const handlePayment = async () => {
    setIsProcessing(true);

    try {
      // Create checkout session
      const result = await trpcClient.payments.createCheckoutSession.mutate({
        itemName: itemTitle,
        itemPrice: amount,
        userEmail: 'user@example.com', // You should get this from your auth context
        sellerId,
        buyerId,
        itemId,
        platformFeePercent,
      });

      if (result.success && result.sessionId) {
        if (Platform.OS === 'web') {
          // For web, redirect to Stripe Checkout
          if (result.url) {
            window.location.href = result.url;
          }
        } else {
          // For mobile, open Stripe Checkout in browser
          if (result.url) {
            await Linking.openURL(result.url);
          }
        }
        
        // Close the modal since user is being redirected
        onClose();
      } else {
        throw new Error(result.error || 'Payment session creation failed');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Payment failed';
      onError?.(errorMessage);
      Alert.alert('Payment Failed', errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    if (!isProcessing) {
      onClose();
    }
  };

  if (isComplete) {
    return (
      <Modal visible={visible} transparent animationType="fade">
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <View style={styles.successContainer}>
              <CheckCircle size={48} color={Colors.success} />
              <Text style={styles.successTitle}>Payment Successful!</Text>
              <Text style={styles.successMessage}>
                Your payment has been processed successfully.
              </Text>
            </View>
          </View>
        </View>
      </Modal>
    );
  }

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <View style={styles.header}>
            <Text style={styles.title}>Complete Payment</Text>
            <Pressable onPress={handleClose} disabled={isProcessing}>
              <Text style={styles.closeButton}>✕</Text>
            </Pressable>
          </View>

          <View style={styles.content}>
            <View style={styles.itemInfo}>
              <Text style={styles.itemTitle}>{itemTitle}</Text>
              <Text style={styles.itemPrice}>${amount.toFixed(2)}</Text>
            </View>

            <View style={styles.breakdown}>
              <View style={styles.breakdownRow}>
                <Text style={styles.breakdownLabel}>Item Price</Text>
                <Text style={styles.breakdownValue}>${amount.toFixed(2)}</Text>
              </View>
              <View style={styles.breakdownRow}>
                <Text style={styles.breakdownLabel}>Platform Fee ({platformFeePercent}%)</Text>
                <Text style={styles.breakdownValue}>${platformFee.toFixed(2)}</Text>
              </View>
              <View style={[styles.breakdownRow, styles.totalRow]}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalValue}>${amount.toFixed(2)}</Text>
              </View>
              <View style={styles.breakdownRow}>
                <Text style={styles.breakdownLabel}>Seller Receives</Text>
                <Text style={styles.breakdownValue}>${sellerAmount.toFixed(2)}</Text>
              </View>
            </View>

            <View style={styles.securityInfo}>
              <Lock size={16} color={Colors.success} />
              <Text style={styles.securityText}>
                Secure payment powered by Stripe
              </Text>
            </View>

            <Pressable
              style={[styles.payButton, isProcessing && styles.payButtonDisabled]}
              onPress={handlePayment}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <ActivityIndicator color={Colors.white} />
              ) : (
                <>
                  <CreditCard size={20} color={Colors.white} />
                  <Text style={styles.payButtonText}>
                    Pay ${amount.toFixed(2)}
                  </Text>
                </>
              )}
            </Pressable>

            <Text style={styles.disclaimer}>
              By completing this payment, you agree to our terms of service and refund policy.
            </Text>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modal: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  title: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  closeButton: {
    fontSize: 18,
    color: Colors.textLight,
    padding: 4,
  },
  content: {
    padding: 20,
  },
  itemInfo: {
    marginBottom: 20,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: Colors.primary,
  },
  breakdown: {
    backgroundColor: Colors.lightGray,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  breakdownLabel: {
    fontSize: 14,
    color: Colors.textLight,
  },
  breakdownValue: {
    fontSize: 14,
    color: Colors.text,
    fontWeight: '500' as const,
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: 8,
    marginTop: 8,
    marginBottom: 8,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  totalValue: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  securityInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  securityText: {
    fontSize: 12,
    color: Colors.success,
    marginLeft: 4,
    fontWeight: '500' as const,
  },
  payButton: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  payButtonDisabled: {
    opacity: 0.6,
  },
  payButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600' as const,
    marginLeft: 8,
  },
  disclaimer: {
    fontSize: 12,
    color: Colors.textLight,
    textAlign: 'center',
    lineHeight: 16,
  },
  successContainer: {
    alignItems: 'center',
    padding: 40,
  },
  successTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  successMessage: {
    fontSize: 14,
    color: Colors.textLight,
    textAlign: 'center',
  },
});