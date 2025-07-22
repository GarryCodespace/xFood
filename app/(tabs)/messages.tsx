import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  FlatList, 
  Pressable, 
  Image, 
  TextInput,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { Colors } from '@/constants/colors';
import { Send, ArrowLeft } from 'lucide-react-native';
import { mockUsers } from '@/mocks/users';
import { ChatMessage } from '@/types';
import { useToast } from '@/hooks/toast-store';

// Mock chat data
const mockChats = [
  {
    id: '1',
    otherUser: mockUsers[1],
    lastMessage: 'Is the sourdough still available?',
    timestamp: '2025-07-22T10:30:00Z',
    unreadCount: 2,
  },
  {
    id: '2',
    otherUser: mockUsers[2],
    lastMessage: 'Thank you for the delicious croissants!',
    timestamp: '2025-07-21T16:45:00Z',
    unreadCount: 0,
  },
];

const mockMessages: ChatMessage[] = [
  {
    id: '1',
    senderId: '2',
    receiverId: '1',
    message: 'Hi! I saw your sourdough post. Is it still available?',
    timestamp: '2025-07-22T10:25:00Z',
    read: true,
  },
  {
    id: '2',
    senderId: '1',
    receiverId: '2',
    message: 'Yes, it is! Would you like to pick it up today?',
    timestamp: '2025-07-22T10:27:00Z',
    read: true,
  },
  {
    id: '3',
    senderId: '2',
    receiverId: '1',
    message: 'Perfect! What time works for you?',
    timestamp: '2025-07-22T10:30:00Z',
    read: false,
  },
];

export default function MessagesTab() {
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [messageText, setMessageText] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>(mockMessages);
  const { showSuccess, showError } = useToast();

  const handleBackToChats = () => {
    setSelectedChat(null);
  };

  const handleSendMessage = async () => {
    if (messageText.trim() && selectedChat) {
      try {
        const newMessage: ChatMessage = {
          id: Date.now().toString(),
          senderId: '1', // Current user ID
          receiverId: selectedChat === '1' ? '2' : '1',
          message: messageText.trim(),
          timestamp: new Date().toISOString(),
          read: false,
        };
        
        setMessages(prev => [...prev, newMessage]);
        setMessageText('');
        showSuccess('Message sent!');
      } catch (error) {
        console.error('Failed to send message:', error);
        showError('Failed to send message. Please try again.');
      }
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return formatTime(timestamp);
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
    }
  };

  const renderChatItem = ({ item }: { item: typeof mockChats[0] }) => (
    <Pressable 
      style={styles.chatItem}
      onPress={() => setSelectedChat(item.id)}
    >
      <Image source={{ uri: item.otherUser.avatar }} style={styles.chatAvatar} />
      <View style={styles.chatContent}>
        <View style={styles.chatHeader}>
          <Text style={styles.chatName}>{item.otherUser.name}</Text>
          <Text style={styles.chatTime}>{formatDate(item.timestamp)}</Text>
        </View>
        <View style={styles.chatMessageRow}>
          <Text style={styles.chatMessage} numberOfLines={1}>
            {item.lastMessage}
          </Text>
          {item.unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadText}>{item.unreadCount}</Text>
            </View>
          )}
        </View>
      </View>
    </Pressable>
  );

  const renderMessage = ({ item }: { item: ChatMessage }) => {
    const isCurrentUser = item.senderId === '1'; // Mock current user ID
    
    return (
      <View style={[
        styles.messageContainer,
        isCurrentUser ? styles.currentUserMessage : styles.otherUserMessage
      ]}>
        <Text style={[
          styles.messageText,
          isCurrentUser ? styles.currentUserMessageText : styles.otherUserMessageText
        ]}>
          {item.message}
        </Text>
        <Text style={[
          styles.messageTime,
          isCurrentUser ? styles.currentUserMessageTime : styles.otherUserMessageTime
        ]}>
          {formatTime(item.timestamp)}
        </Text>
      </View>
    );
  };

  if (selectedChat) {
    const chat = mockChats.find(c => c.id === selectedChat);
    if (!chat) return null;

    return (
      <KeyboardAvoidingView 
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
      >
        <View style={styles.chatHeaderContainer}>
          <Pressable style={styles.backButton} onPress={handleBackToChats}>
            <ArrowLeft size={24} color={Colors.text} />
          </Pressable>
          <Image source={{ uri: chat.otherUser.avatar }} style={styles.headerAvatar} />
          <Text style={styles.headerName}>{chat.otherUser.name}</Text>
        </View>
        
        <FlatList
          data={messages.filter(msg => 
            (msg.senderId === '1' && msg.receiverId === selectedChat) ||
            (msg.senderId === selectedChat && msg.receiverId === '1')
          )}
          keyExtractor={(item) => item.id}
          renderItem={renderMessage}
          style={styles.messagesList}
          contentContainerStyle={styles.messagesContent}
        />
        
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.messageInput}
            placeholder="Type a message..."
            value={messageText}
            onChangeText={setMessageText}
            multiline
            maxLength={500}
          />
          <Pressable 
            style={[
              styles.sendButton,
              !messageText.trim() && styles.sendButtonDisabled
            ]}
            onPress={handleSendMessage}
            disabled={!messageText.trim()}
          >
            <Send size={20} color={Colors.white} />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={mockChats}
        keyExtractor={(item) => item.id}
        renderItem={renderChatItem}
        style={styles.chatsList}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No messages yet</Text>
            <Text style={styles.emptySubtext}>
              Start a conversation by messaging someone from their profile
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  chatsList: {
    flex: 1,
  },
  chatItem: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  chatAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  chatContent: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  chatHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray,
  },
  chatName: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  chatTime: {
    fontSize: 12,
    color: Colors.textLight,
  },
  chatMessageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chatMessage: {
    fontSize: 14,
    color: Colors.textLight,
    flex: 1,
  },
  unreadBadge: {
    backgroundColor: Colors.primary,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  unreadText: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: '600' as const,
  },
  backButton: {
    padding: 8,
  },
  headerAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginLeft: 12,
  },
  headerName: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.text,
    flex: 1,
    marginLeft: 12,
  },
  messagesList: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
  },
  messageContainer: {
    maxWidth: '80%',
    marginBottom: 12,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  currentUserMessage: {
    alignSelf: 'flex-end',
    backgroundColor: Colors.primary,
  },
  otherUserMessage: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.lightGray,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  currentUserMessageText: {
    color: Colors.white,
  },
  otherUserMessageText: {
    color: Colors.text,
  },
  messageTime: {
    fontSize: 11,
    marginTop: 4,
  },
  currentUserMessageTime: {
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'right',
  },
  otherUserMessageTime: {
    color: Colors.textLight,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.gray,
    alignItems: 'flex-end',
  },
  messageInput: {
    flex: 1,
    backgroundColor: Colors.lightGray,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    maxHeight: 100,
    fontSize: 14,
    color: Colors.text,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  sendButtonDisabled: {
    backgroundColor: Colors.gray,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: Colors.textLight,
    textAlign: 'center',
  },
});