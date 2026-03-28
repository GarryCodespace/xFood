import React from 'react';
import { StyleSheet, View, Text, ScrollView, Pressable } from 'react-native';
import { router, Stack } from 'expo-router';
import { Colors } from '@/constants/colors';
import { Package, Clock, CheckCircle, ArrowLeft } from 'lucide-react-native';

// Mock orders data - in a real app, this would come from your backend
const mockOrders = [
  {
    id: 'ORDER-001',
    itemName: 'Chocolate Croissants',
    amount: 12.99,
    status: 'completed',
    date: '2024-01-15',
    seller: 'Sarah\'s Bakery',
    paymentId: 'pi_1234567890',
  },
  {
    id: 'ORDER-002',
    itemName: 'Sourdough Bread',
    amount: 8.50,
    status: 'pending',
    date: '2024-01-14',
    seller: 'Mike\'s Artisan Breads',
    paymentId: 'pi_0987654321',
  },
];

export default function OrdersScreen() {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle size={20} color={Colors.success} />;
      case 'pending':
        return <Clock size={20} color={Colors.accent1} />;
      default:
        return <Package size={20} color={Colors.textLight} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return Colors.success;
      case 'pending':
        return Colors.accent1;
      default:
        return Colors.textLight;
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: 'My Orders',
          headerLeft: () => (
            <Pressable onPress={() => router.back()} style={styles.backButton}>
              <ArrowLeft size={24} color={Colors.text} />
            </Pressable>
          ),
        }} 
      />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {mockOrders.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Package size={64} color={Colors.textLight} />
            <Text style={styles.emptyTitle}>No Orders Yet</Text>
            <Text style={styles.emptyMessage}>
              Your orders will appear here after you make a purchase.
            </Text>
          </View>
        ) : (
          <View style={styles.ordersContainer}>
            {mockOrders.map((order) => (
              <View key={order.id} style={styles.orderCard}>
                <View style={styles.orderHeader}>
                  <View style={styles.orderInfo}>
                    <Text style={styles.orderTitle}>{order.itemName}</Text>
                    <Text style={styles.orderSeller}>from {order.seller}</Text>
                  </View>
                  <View style={styles.statusContainer}>
                    {getStatusIcon(order.status)}
                    <Text style={[styles.statusText, { color: getStatusColor(order.status) }]}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </Text>
                  </View>
                </View>
                
                <View style={styles.orderDetails}>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Order ID:</Text>
                    <Text style={styles.detailValue}>{order.id}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Date:</Text>
                    <Text style={styles.detailValue}>{order.date}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Amount:</Text>
                    <Text style={styles.detailValue}>${order.amount.toFixed(2)}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Payment ID:</Text>
                    <Text style={styles.detailValue}>{order.paymentId}</Text>
                  </View>
                </View>

                <View style={styles.orderActions}>
                  <Pressable style={styles.actionButton}>
                    <Text style={styles.actionButtonText}>View Details</Text>
                  </Pressable>
                  {order.status === 'completed' && (
                    <Pressable style={styles.secondaryActionButton}>
                      <Text style={styles.secondaryActionButtonText}>Reorder</Text>
                    </Pressable>
                  )}
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  scrollView: {
    flex: 1,
  },
  ordersContainer: {
    padding: 16,
  },
  orderCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  orderInfo: {
    flex: 1,
  },
  orderTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 4,
  },
  orderSeller: {
    fontSize: 14,
    color: Colors.textLight,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500' as const,
  },
  orderDetails: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: Colors.textLight,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '500' as const,
    color: Colors.text,
  },
  orderActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    backgroundColor: Colors.primary,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  actionButtonText: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: '500' as const,
  },
  secondaryActionButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  secondaryActionButtonText: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: '500' as const,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    minHeight: 400,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600' as const,
    color: Colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyMessage: {
    fontSize: 16,
    color: Colors.textLight,
    textAlign: 'center',
    lineHeight: 24,
  },
});