import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Pressable, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Colors } from '@/constants/colors';
import { CheckCircle, ArrowLeft } from 'lucide-react-native';
import { trpc } from '@/lib/trpc';

export default function PaymentSuccessScreen() {
  const { session_id } = useLocalSearchParams<{ session_id: string }>();
  const [sessionData, setSessionData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (session_id) {
      verifyPayment();
    }
  }, [session_id]);

  const verifyPayment = async () => {
    try {
      const result = await trpc.payments.verifySession.query({
        sessionId: session_id as string,
      });

      if (result.success) {
        setSessionData(result.session);
      } else {
        setError(result.error || 'Failed to verify payment');
      }
    } catch (err) {
      setError('Failed to verify payment');
    } finally {
      setLoading(false);
    }
  };

  const handleGoHome = () => {
    router.replace('/(tabs)');
  };

  const handleViewOrders = () => {
    router.push('/orders');
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Verifying payment...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Error: {error}</Text>
        <Pressable style={styles.button} onPress={handleGoHome}>
          <Text style={styles.buttonText}>Go Home</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.successContainer}>
        <CheckCircle size={80} color={Colors.success} />
        <Text style={styles.successTitle}>Payment Successful!</Text>
        <Text style={styles.successMessage}>
          Thank you for your purchase. Your order has been confirmed.
        </Text>

        {sessionData && (
          <View style={styles.detailsContainer}>
            <Text style={styles.detailsTitle}>Order Details</Text>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Amount:</Text>
              <Text style={styles.detailValue}>
                ${(sessionData.amountTotal / 100).toFixed(2)}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Payment ID:</Text>
              <Text style={styles.detailValue}>{sessionData.paymentIntentId}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Email:</Text>
              <Text style={styles.detailValue}>{sessionData.customerEmail}</Text>
            </View>
          </View>
        )}

        <View style={styles.buttonContainer}>
          <Pressable style={styles.primaryButton} onPress={handleViewOrders}>
            <Text style={styles.primaryButtonText}>View My Orders</Text>
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
  successContainer: {
    alignItems: 'center',
    maxWidth: 400,
    width: '100%',
  },
  successTitle: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: Colors.text,
    marginTop: 20,
    marginBottom: 12,
    textAlign: 'center',
  },
  successMessage: {
    fontSize: 16,
    color: Colors.textLight,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 30,
  },
  detailsContainer: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 20,
    width: '100%',
    marginBottom: 30,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  detailsTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 14,
    color: Colors.textLight,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '500' as const,
    color: Colors.text,
    flex: 1,
    textAlign: 'right',
  },
  buttonContainer: {
    width: '100%',
    gap: 12,
  },
  primaryButton: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
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
  loadingText: {
    fontSize: 16,
    color: Colors.textLight,
    marginTop: 16,
  },
  errorText: {
    fontSize: 16,
    color: Colors.error,
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 32,
  },
  buttonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600' as const,
  },
});