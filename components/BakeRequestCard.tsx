import React from 'react';
import { StyleSheet, View, Text, Pressable, Image } from 'react-native';
import { Clock, DollarSign, MessageSquare } from 'lucide-react-native';
import { BakeRequest } from '@/types';
import { Colors } from '@/constants/colors';

interface BakeRequestCardProps {
  request: BakeRequest;
  onPress?: () => void;
  onRespond?: (requestId: string) => void;
  showRespondButton?: boolean;
}

export const BakeRequestCard: React.FC<BakeRequestCardProps> = ({ 
  request, 
  onPress, 
  onRespond,
  showRespondButton = true
}) => {
  const deadline = new Date(request.deadline);
  const isExpired = deadline < new Date();
  
  const formatDeadline = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const getStatusColor = () => {
    if (isExpired) return Colors.textLight;
    switch (request.status) {
      case 'fulfilled': return Colors.success;
      case 'closed': return Colors.textLight;
      default: return Colors.primary;
    }
  };

  const getStatusText = () => {
    if (isExpired) return 'Expired';
    switch (request.status) {
      case 'fulfilled': return 'Fulfilled';
      case 'closed': return 'Closed';
      default: return 'Open';
    }
  };

  return (
    <Pressable style={styles.container} onPress={onPress}>
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <Image source={{ uri: request.requester?.avatar }} style={styles.avatar} />
          <View>
            <Text style={styles.username}>{request.requester?.name}</Text>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor() }]}>
              <Text style={styles.statusText}>{getStatusText()}</Text>
            </View>
          </View>
        </View>
        
        {request.budget && (
          <View style={styles.budgetContainer}>
            <DollarSign size={14} color={Colors.success} />
            <Text style={styles.budget}>${request.budget}</Text>
          </View>
        )}
      </View>
      
      <Text style={styles.title}>{request.title}</Text>
      <Text style={styles.description} numberOfLines={2}>
        {request.description}
      </Text>
      
      <View style={styles.footer}>
        <View style={styles.deadlineContainer}>
          <Clock size={14} color={isExpired ? Colors.error : Colors.textLight} />
          <Text style={[
            styles.deadline,
            isExpired && styles.expiredDeadline
          ]}>
            {isExpired ? 'Expired' : `Due ${formatDeadline(deadline)}`}
          </Text>
        </View>
        
        <View style={styles.responseInfo}>
          <MessageSquare size={14} color={Colors.textLight} />
          <Text style={styles.responseCount}>
            {request.responses.length} response{request.responses.length !== 1 ? 's' : ''}
          </Text>
        </View>
      </View>
      
      {showRespondButton && request.status === 'open' && !isExpired && (
        <Pressable 
          style={styles.respondButton}
          onPress={() => onRespond?.(request.id)}
        >
          <Text style={styles.respondButtonText}>Respond to Request</Text>
        </Pressable>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  username: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 2,
  },
  statusBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  statusText: {
    fontSize: 10,
    color: Colors.white,
    fontWeight: '600' as const,
  },
  budgetContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.lightGray,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  budget: {
    fontSize: 12,
    fontWeight: '700' as const,
    color: Colors.success,
    marginLeft: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: Colors.textLight,
    lineHeight: 20,
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  deadlineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deadline: {
    fontSize: 12,
    color: Colors.textLight,
    marginLeft: 4,
  },
  expiredDeadline: {
    color: Colors.error,
    fontWeight: '600' as const,
  },
  responseInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  responseCount: {
    fontSize: 12,
    color: Colors.textLight,
    marginLeft: 4,
  },
  respondButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  respondButtonText: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: '600' as const,
  },
});