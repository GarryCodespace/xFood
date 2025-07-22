import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, Pressable, Image } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Colors } from '@/constants/colors';
import { DeliveryTracker } from '@/components/DeliveryTracker';
import { ArrowLeft, MessageCircle, Star } from 'lucide-react-native';
import { PastryOrder, DeliveryTracking } from '@/types';

// Mock order data
const mockOrder: PastryOrder = {
  id: '1',
  postId: '1',
  post: {
    id: '1',
    userId: '1',
    title: 'Artisan Sourdough Bread',
    description: 'Fresh artisan sourdough bread',
    ingredients: ['flour', 'water', 'salt', 'sourdough starter'],
    image: 'https://images.unsplash.com/photo-1585478259715-4d3f6a399cbd',
    deliveryOption: 'Delivery Available',
    location: 'Portland, OR',
    datePosted: '2025-07-22T12:00:00Z',
    likes: 0,
    comments: 0,
    tags: [],
    allergenTags: [],
    specialTags: [],
    user: {
      id: '1',
      name: 'Emma Baker',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
      kitchenType: 'Home Bakery',
      location: 'Portland, OR',
      rating: 4.8
    }
  },
  buyerId: '2',
  sellerId: '1',
  quantity: 2,
  totalAmount: 18.50,
  platformFee: 1.48,
  deliveryFee: 3.99,
  sellerEarnings: 13.03,
  paymentIntentId: 'pi_123456789',
  status: 'in_transit',
  orderDate: '2025-07-22T14:30:00Z',
  deliveryAddress: '123 Main St, Portland, OR 97201',
  specialInstructions: 'Please ring doorbell twice',
};

const mockTracking: DeliveryTracking = {
  id: '1',
  orderId: '1',
  provider: 'doordash',
  trackingId: 'DD-789456123',
  status: 'in_transit',
  driverName: 'Mike Johnson',
  driverPhone: '+1-555-0123',
  estimatedDelivery: '2025-07-22T16:15:00Z',
  trackingUrl: 'https://doordash.com/track/DD-789456123',
};

export default function OrderTrackingScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [order] = useState(mockOrder);
  const [tracking] = useState(mockTracking);
  const router = useRouter();

  const handleCallDriver = () => {
    // In a real app, this would initiate a phone call
    console.log('Calling driver:', tracking.driverPhone);
  };

  const handleViewMap = () => {
    // In a real app, this would open the tracking URL
    console.log('Opening tracking URL:', tracking.trackingUrl);
  };

  const handleMessageSeller = () => {
    router.push('/messages');
  };

  const handleRateOrder = () => {
    // In a real app, this would open a rating modal
    console.log('Rate order:', order.id);
  };

  const getStatusColor = () => {
    switch (order.status) {
      case 'pending': return Colors.primary;
      case 'confirmed': return Colors.primary;
      case 'preparing': return Colors.primary;
      case 'ready': return Colors.success;
      case 'in_transit': return Colors.primary;
      case 'delivered': return Colors.success;
      case 'cancelled': return Colors.error;
      default: return Colors.textLight;
    }
  };

  const getStatusText = () => {
    switch (order.status) {
      case 'pending': return 'Order Pending';
      case 'confirmed': return 'Order Confirmed';
      case 'preparing': return 'Being Prepared';
      case 'ready': return 'Ready for Pickup/Delivery';
      case 'in_transit': return 'Out for Delivery';
      case 'delivered': return 'Delivered';
      case 'cancelled': return 'Cancelled';
      default: return 'Unknown Status';
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color={Colors.text} />
        </Pressable>
        <Text style={styles.headerTitle}>Order Tracking</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.orderCard}>
        <View style={styles.orderHeader}>
          <Image source={{ uri: order.post.image }} style={styles.orderImage} />
          <View style={styles.orderInfo}>
            <Text style={styles.orderTitle}>{order.post.title}</Text>
            <Text style={styles.sellerName}>by {order.post.user.name}</Text>
            <Text style={styles.orderQuantity}>Quantity: {order.quantity}</Text>
          </View>
        </View>
        
        <View style={styles.statusContainer}>
          <View style={[styles.statusDot, { backgroundColor: getStatusColor() }]} />
          <Text style={[styles.statusText, { color: getStatusColor() }]}>
            {getStatusText()}
          </Text>
        </View>
      </View>

      {order.status === 'in_transit' && (
        <DeliveryTracker
          tracking={tracking}
          onCallDriver={handleCallDriver}
          onViewMap={handleViewMap}
        />
      )}

      <View style={styles.detailsCard}>
        <Text style={styles.sectionTitle}>Order Details</Text>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Order Date:</Text>
          <Text style={styles.detailValue}>
            {new Date(order.orderDate).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              hour: 'numeric',
              minute: '2-digit'
            })}
          </Text>
        </View>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Delivery Address:</Text>
          <Text style={styles.detailValue}>{order.deliveryAddress}</Text>
        </View>
        
        {order.specialInstructions && (
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Special Instructions:</Text>
            <Text style={styles.detailValue}>{order.specialInstructions}</Text>
          </View>
        )}
      </View>

      <View style={styles.priceCard}>
        <Text style={styles.sectionTitle}>Price Breakdown</Text>
        
        <View style={styles.priceRow}>
          <Text style={styles.priceLabel}>Subtotal ({order.quantity} items):</Text>
          <Text style={styles.priceValue}>
            ${(order.totalAmount - order.platformFee - (order.deliveryFee || 0)).toFixed(2)}
          </Text>
        </View>
        
        {order.deliveryFee && (
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Delivery Fee:</Text>
            <Text style={styles.priceValue}>${order.deliveryFee.toFixed(2)}</Text>
          </View>
        )}
        
        <View style={styles.priceRow}>
          <Text style={styles.priceLabel}>Service Fee:</Text>
          <Text style={styles.priceValue}>${order.platformFee.toFixed(2)}</Text>
        </View>
        
        <View style={[styles.priceRow, styles.totalRow]}>
          <Text style={styles.totalLabel}>Total:</Text>
          <Text style={styles.totalValue}>${order.totalAmount.toFixed(2)}</Text>
        </View>
      </View>

      <View style={styles.actionsCard}>
        <Pressable style={styles.actionButton} onPress={handleMessageSeller}>
          <MessageCircle size={20} color={Colors.primary} />
          <Text style={styles.actionButtonText}>Message Seller</Text>
        </Pressable>
        
        {order.status === 'delivered' && (
          <Pressable style={styles.actionButton} onPress={handleRateOrder}>
            <Star size={20} color={Colors.primary} />
            <Text style={styles.actionButtonText}>Rate Order</Text>
          </Pressable>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  placeholder: {
    width: 40,
  },
  orderCard: {
    backgroundColor: Colors.white,
    margin: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  orderHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  orderImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
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
  sellerName: {
    fontSize: 14,
    color: Colors.textLight,
    marginBottom: 4,
  },
  orderQuantity: {
    fontSize: 14,
    color: Colors.text,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.lightGray,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600' as const,
  },
  detailsCard: {
    backgroundColor: Colors.white,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: Colors.textLight,
    flex: 1,
  },
  detailValue: {
    fontSize: 14,
    color: Colors.text,
    flex: 2,
    textAlign: 'right',
  },
  priceCard: {
    backgroundColor: Colors.white,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  priceLabel: {
    fontSize: 14,
    color: Colors.textLight,
  },
  priceValue: {
    fontSize: 14,
    color: Colors.text,
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: Colors.lightGray,
    paddingTop: 8,
    marginTop: 4,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  totalValue: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  actionsCard: {
    backgroundColor: Colors.white,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.lightGray,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  actionButtonText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '600' as const,
    marginLeft: 8,
  },
});