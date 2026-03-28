import React from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import { Colors } from '@/constants/colors';
import { Truck, MapPin, Clock, Phone, ExternalLink, X } from 'lucide-react-native';
import { DeliveryTracking } from '@/types';

interface DeliveryTrackerProps {
  tracking: DeliveryTracking;
  onCallDriver?: () => void;
  onViewMap?: () => void;
}

export const DeliveryTracker: React.FC<DeliveryTrackerProps> = ({ 
  tracking, 
  onCallDriver,
  onViewMap 
}) => {
  const getStatusColor = () => {
    switch (tracking.status) {
      case 'assigned': return Colors.primary;
      case 'picked_up': return Colors.primary;
      case 'in_transit': return Colors.primary;
      case 'delivered': return Colors.success;
      case 'cancelled': return Colors.error;
      default: return Colors.textLight;
    }
  };

  const getStatusText = () => {
    switch (tracking.status) {
      case 'assigned': return 'Driver assigned';
      case 'picked_up': return 'Order picked up';
      case 'in_transit': return 'On the way';
      case 'delivered': return 'Delivered';
      case 'cancelled': return 'Cancelled';
      default: return 'Unknown status';
    }
  };

  const getStatusIcon = () => {
    switch (tracking.status) {
      case 'assigned': return <MapPin size={16} color={getStatusColor()} />;
      case 'picked_up': return <Truck size={16} color={getStatusColor()} />;
      case 'in_transit': return <Truck size={16} color={getStatusColor()} />;
      case 'delivered': return <MapPin size={16} color={getStatusColor()} />;
      case 'cancelled': return <X size={16} color={getStatusColor()} />;
      default: return <Clock size={16} color={getStatusColor()} />;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.statusContainer}>
          {getStatusIcon()}
          <Text style={[styles.statusText, { color: getStatusColor() }]}>
            {getStatusText()}
          </Text>
        </View>
        
        <View style={styles.providerBadge}>
          <Text style={styles.providerText}>
            {tracking.provider === 'doordash' ? 'DoorDash' : 
             tracking.provider === 'ubereats' ? 'Uber Eats' : 'Self Delivery'}
          </Text>
        </View>
      </View>
      
      {tracking.driverName && (
        <View style={styles.driverInfo}>
          <Text style={styles.driverName}>Driver: {tracking.driverName}</Text>
          {tracking.estimatedDelivery && (
            <View style={styles.estimatedTime}>
              <Clock size={14} color={Colors.textLight} />
              <Text style={styles.estimatedTimeText}>
                ETA: {new Date(tracking.estimatedDelivery).toLocaleTimeString('en-US', {
                  hour: 'numeric',
                  minute: '2-digit'
                })}
              </Text>
            </View>
          )}
        </View>
      )}
      
      <View style={styles.actions}>
        {tracking.driverPhone && tracking.status === 'in_transit' && (
          <Pressable style={styles.actionButton} onPress={onCallDriver}>
            <Phone size={16} color={Colors.primary} />
            <Text style={styles.actionButtonText}>Call Driver</Text>
          </Pressable>
        )}
        
        {tracking.trackingUrl && (
          <Pressable style={styles.actionButton} onPress={onViewMap}>
            <ExternalLink size={16} color={Colors.primary} />
            <Text style={styles.actionButtonText}>Track on Map</Text>
          </Pressable>
        )}
      </View>
      
      <Text style={styles.trackingId}>
        Tracking ID: {tracking.trackingId}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 16,
    fontWeight: '600' as const,
    marginLeft: 8,
  },
  providerBadge: {
    backgroundColor: Colors.lightGray,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  providerText: {
    fontSize: 12,
    color: Colors.textLight,
    fontWeight: '500' as const,
  },
  driverInfo: {
    marginBottom: 12,
  },
  driverName: {
    fontSize: 14,
    color: Colors.text,
    fontWeight: '500' as const,
    marginBottom: 4,
  },
  estimatedTime: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  estimatedTimeText: {
    fontSize: 12,
    color: Colors.textLight,
    marginLeft: 4,
  },
  actions: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.lightGray,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 12,
  },
  actionButtonText: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: '500' as const,
    marginLeft: 4,
  },
  trackingId: {
    fontSize: 12,
    color: Colors.textLight,
    textAlign: 'center',
  },
});