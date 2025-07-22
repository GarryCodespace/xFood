import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, RefreshControl } from 'react-native';
import { Stack, router } from 'expo-router';
import { Clock, MessageSquare, AlertCircle, CheckCircle, XCircle } from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import { mockSupportTickets } from '@/mocks/support';
import { SupportTicket } from '@/types';
import { useAuth } from '@/hooks/auth-store';

export default function SupportTicketsScreen() {
  const { currentUser } = useAuth();
  const [tickets, setTickets] = useState<SupportTicket[]>(mockSupportTickets);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<'all' | 'new' | 'in_progress' | 'resolved'>('all');

  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  const filteredTickets = tickets.filter(ticket => {
    if (filter === 'all') return true;
    return ticket.status === filter;
  });

  const getStatusIcon = (status: SupportTicket['status']) => {
    switch (status) {
      case 'new':
        return <Clock color={Colors.primary} size={16} />;
      case 'in_progress':
        return <MessageSquare color="#2196F3" size={16} />;
      case 'resolved':
        return <CheckCircle color={Colors.success} size={16} />;
      case 'closed':
        return <XCircle color={Colors.textLight} size={16} />;
      default:
        return <Clock color={Colors.textLight} size={16} />;
    }
  };

  const getStatusColor = (status: SupportTicket['status']) => {
    switch (status) {
      case 'new':
        return Colors.primary;
      case 'in_progress':
        return '#2196F3';
      case 'resolved':
        return Colors.success;
      case 'closed':
        return Colors.textLight;
      default:
        return Colors.textLight;
    }
  };

  const getPriorityColor = (priority: SupportTicket['priority']) => {
    switch (priority) {
      case 'urgent':
        return Colors.error;
      case 'high':
        return '#FF9800';
      case 'medium':
        return '#2196F3';
      case 'low':
        return Colors.success;
      default:
        return Colors.textLight;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const filterOptions = [
    { key: 'all', label: 'All' },
    { key: 'new', label: 'New' },
    { key: 'in_progress', label: 'In Progress' },
    { key: 'resolved', label: 'Resolved' },
  ];

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'My Support Tickets',
          headerStyle: { backgroundColor: Colors.white },
          headerTintColor: Colors.text,
        }}
      />

      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {filterOptions.map((option) => (
            <Pressable
              key={option.key}
              style={[
                styles.filterButton,
                filter === option.key && styles.filterButtonActive,
              ]}
              onPress={() => setFilter(option.key as any)}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  filter === option.key && styles.filterButtonTextActive,
                ]}
              >
                {option.label}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {filteredTickets.length === 0 ? (
          <View style={styles.emptyState}>
            <MessageSquare color={Colors.textLight} size={48} />
            <Text style={styles.emptyTitle}>No support tickets</Text>
            <Text style={styles.emptyText}>
              {filter === 'all'
                ? "You haven't submitted any support requests yet."
                : `No ${filter.replace('_', ' ')} tickets found.`}
            </Text>
            <Pressable
              style={styles.createButton}
              onPress={() => router.push('/contact-support')}
            >
              <Text style={styles.createButtonText}>Contact Support</Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.ticketsList}>
            {filteredTickets.map((ticket) => (
              <Pressable
                key={ticket.id}
                style={styles.ticketCard}
                onPress={() => router.push(`/support-ticket/${ticket.id}`)}
              >
                <View style={styles.ticketHeader}>
                  <View style={styles.ticketStatus}>
                    {getStatusIcon(ticket.status)}
                    <Text
                      style={[
                        styles.statusText,
                        { color: getStatusColor(ticket.status) },
                      ]}
                    >
                      {ticket.status.replace('_', ' ').toUpperCase()}
                    </Text>
                  </View>
                  <View style={styles.ticketMeta}>
                    <View
                      style={[
                        styles.priorityBadge,
                        { backgroundColor: getPriorityColor(ticket.priority) },
                      ]}
                    >
                      <Text style={styles.priorityText}>
                        {ticket.priority.toUpperCase()}
                      </Text>
                    </View>
                  </View>
                </View>

                <Text style={styles.ticketSubject}>{ticket.subject}</Text>
                <Text style={styles.ticketMessage} numberOfLines={2}>
                  {ticket.message}
                </Text>

                <View style={styles.ticketFooter}>
                  <Text style={styles.ticketCategory}>
                    {ticket.category.replace('_', ' ').toUpperCase()}
                  </Text>
                  <Text style={styles.ticketDate}>
                    {formatDate(ticket.dateCreated)}
                  </Text>
                </View>

                {ticket.isEscalated && (
                  <View style={styles.escalatedBadge}>
                    <AlertCircle color={Colors.error} size={12} />
                    <Text style={styles.escalatedText}>Escalated</Text>
                  </View>
                )}
              </Pressable>
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
  filterContainer: {
    backgroundColor: Colors.white,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: Colors.lightGray,
  },
  filterButtonActive: {
    backgroundColor: Colors.primary,
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '500' as const,
    color: Colors.textLight,
  },
  filterButtonTextActive: {
    color: Colors.white,
  },
  content: {
    flex: 1,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    marginTop: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600' as const,
    color: Colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.textLight,
    textAlign: 'center',
    marginBottom: 24,
  },
  createButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  createButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600' as const,
  },
  ticketsList: {
    padding: 20,
  },
  ticketCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    position: 'relative',
  },
  ticketHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  ticketStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600' as const,
    marginLeft: 6,
  },
  ticketMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priorityBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: '600' as const,
    color: Colors.white,
  },
  ticketSubject: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 8,
  },
  ticketMessage: {
    fontSize: 14,
    color: Colors.textLight,
    lineHeight: 20,
    marginBottom: 12,
  },
  ticketFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ticketCategory: {
    fontSize: 12,
    color: Colors.primary,
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  ticketDate: {
    fontSize: 12,
    color: Colors.textLight,
  },
  escalatedBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFEBEE',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  escalatedText: {
    fontSize: 10,
    fontWeight: '600' as const,
    color: Colors.error,
    marginLeft: 4,
  },
});