import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Pressable, Alert } from 'react-native';
import { Stack, useLocalSearchParams, router } from 'expo-router';
import { Send, Clock, MessageSquare, CheckCircle, User, Shield } from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import { mockSupportTickets } from '@/mocks/support';
import { SupportTicket, SupportResponse } from '@/types';
import { useAuth } from '@/hooks/auth-store';

export default function SupportTicketDetailScreen() {
  const { id } = useLocalSearchParams();
  const { currentUser } = useAuth();
  const [newMessage, setNewMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Find the ticket by ID
  const ticket = mockSupportTickets.find(t => t.id === id);

  if (!ticket) {
    return (
      <View style={styles.container}>
        <Stack.Screen
          options={{
            title: 'Support Ticket',
            headerStyle: { backgroundColor: Colors.white },
            headerTintColor: Colors.text,
          }}
        />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Ticket not found</Text>
        </View>
      </View>
    );
  }

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, this would update the ticket with the new message
      Alert.alert('Message Sent', 'Your message has been added to the ticket.');
      setNewMessage('');
    } catch (error) {
      Alert.alert('Error', 'Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusIcon = (status: SupportTicket['status']) => {
    switch (status) {
      case 'new':
        return <Clock color={Colors.primary} size={20} />;
      case 'in_progress':
        return <MessageSquare color="#2196F3" size={20} />;
      case 'resolved':
        return <CheckCircle color={Colors.success} size={20} />;
      default:
        return <Clock color={Colors.textLight} size={20} />;
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
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: `Ticket #${ticket.id}`,
          headerStyle: { backgroundColor: Colors.white },
          headerTintColor: Colors.text,
        }}
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.ticketHeader}>
          <View style={styles.statusContainer}>
            {getStatusIcon(ticket.status)}
            <Text style={[styles.statusText, { color: getStatusColor(ticket.status) }]}>
              {ticket.status.replace('_', ' ').toUpperCase()}
            </Text>
          </View>
          <Text style={styles.ticketSubject}>{ticket.subject}</Text>
          <Text style={styles.ticketCategory}>
            {ticket.category.replace('_', ' ').toUpperCase()}
          </Text>
        </View>

        <View style={styles.messagesContainer}>
          {/* Original message */}
          <View style={styles.messageCard}>
            <View style={styles.messageHeader}>
              <View style={styles.userInfo}>
                <User color={Colors.primary} size={16} />
                <Text style={styles.userName}>You</Text>
              </View>
              <Text style={styles.messageDate}>
                {formatDate(ticket.dateCreated)}
              </Text>
            </View>
            <Text style={styles.messageText}>{ticket.message}</Text>
          </View>

          {/* Responses */}
          {ticket.responses.map((response) => (
            <View
              key={response.id}
              style={[
                styles.messageCard,
                response.isAdminResponse && styles.adminMessageCard,
              ]}
            >
              <View style={styles.messageHeader}>
                <View style={styles.userInfo}>
                  {response.isAdminResponse ? (
                    <Shield color={Colors.success} size={16} />
                  ) : (
                    <User color={Colors.primary} size={16} />
                  )}
                  <Text style={styles.userName}>
                    {response.isAdminResponse ? 'Support Team' : 'You'}
                  </Text>
                </View>
                <Text style={styles.messageDate}>
                  {formatDate(response.datePosted)}
                </Text>
              </View>
              <Text style={styles.messageText}>{response.message}</Text>
            </View>
          ))}
        </View>

        {ticket.status !== 'resolved' && ticket.status !== 'closed' && (
          <View style={styles.replyContainer}>
            <Text style={styles.replyTitle}>Add a reply</Text>
            <TextInput
              style={styles.replyInput}
              value={newMessage}
              onChangeText={setNewMessage}
              placeholder="Type your message here..."
              placeholderTextColor={Colors.textLight}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>
        )}
      </ScrollView>

      {ticket.status !== 'resolved' && ticket.status !== 'closed' && (
        <View style={styles.footer}>
          <Pressable
            style={[styles.sendButton, (!newMessage.trim() || isSubmitting) && styles.sendButtonDisabled]}
            onPress={handleSendMessage}
            disabled={!newMessage.trim() || isSubmitting}
          >
            <Send color={Colors.white} size={20} />
            <Text style={styles.sendButtonText}>
              {isSubmitting ? 'Sending...' : 'Send Reply'}
            </Text>
          </Pressable>
        </View>
      )}

      {ticket.status === 'resolved' && (
        <View style={styles.resolvedFooter}>
          <CheckCircle color={Colors.success} size={24} />
          <Text style={styles.resolvedText}>This ticket has been resolved</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  errorText: {
    fontSize: 18,
    color: Colors.textLight,
  },
  ticketHeader: {
    backgroundColor: Colors.white,
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600' as const,
    marginLeft: 8,
  },
  ticketSubject: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 8,
  },
  ticketCategory: {
    fontSize: 12,
    color: Colors.primary,
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  messagesContainer: {
    padding: 20,
  },
  messageCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  adminMessageCard: {
    backgroundColor: Colors.primaryLight,
    borderColor: Colors.primary,
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userName: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.text,
    marginLeft: 6,
  },
  messageDate: {
    fontSize: 12,
    color: Colors.textLight,
  },
  messageText: {
    fontSize: 15,
    color: Colors.text,
    lineHeight: 22,
  },
  replyContainer: {
    padding: 20,
    paddingTop: 0,
  },
  replyTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 12,
  },
  replyInput: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: Colors.text,
    height: 100,
    textAlignVertical: 'top',
  },
  footer: {
    padding: 20,
    paddingTop: 16,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  sendButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
  },
  sendButtonDisabled: {
    opacity: 0.6,
  },
  sendButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600' as const,
    marginLeft: 8,
  },
  resolvedFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  resolvedText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.success,
    marginLeft: 8,
  },
});