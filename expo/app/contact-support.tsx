import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Pressable, Alert, Platform } from 'react-native';
import { Stack, router } from 'expo-router';
import { Picker } from '@react-native-picker/picker';
import { Paperclip, Send, X } from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import { supportCategories } from '@/mocks/support';
import { useAuth } from '@/hooks/auth-store';
import { useToast } from '@/hooks/toast-store';
import { apiService } from '@/utils/api';

export default function ContactSupportScreen() {
  const { currentUser } = useAuth();
  const { showSuccess, showError } = useToast();
  const [category, setCategory] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [attachments, setAttachments] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!category || !subject.trim() || !message.trim()) {
      showError('Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Send support request to backend
      const result = await apiService.submitSupportRequest({
        category,
        subject,
        message,
        userEmail: currentUser?.email || 'anonymous@example.com',
        userName: currentUser?.name || 'Anonymous User',
        userId: currentUser?.id || 'anonymous',
        timestamp: new Date().toISOString(),
        supportEmail: 'support@xfood.com', // Replace with your actual email
      });

      if (!result.success) {
        throw new Error('Failed to submit support request');
      }

      showSuccess(`Support request submitted successfully!${result.ticketId ? ` Ticket ID: ${result.ticketId}` : ''}`);
      
      setTimeout(() => {
        router.back();
      }, 1500);

      // Clear form
      setCategory('');
      setSubject('');
      setMessage('');
      setAttachments([]);
    } catch (error) {
      console.error('Support submission error:', error);
      showError('Failed to submit support request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddAttachment = () => {
    // In a real app, this would open file picker
    Alert.alert(
      'Add Attachment',
      'File attachment feature will be available soon.',
      [{ text: 'OK' }]
    );
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Contact Support',
          headerStyle: { backgroundColor: Colors.white },
          headerTintColor: Colors.text,
        }}
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>How can we help you?</Text>
          <Text style={styles.subtitle}>
            Describe your issue and we'll get back to you as soon as possible.
          </Text>
        </View>

        <View style={styles.form}>
          <View style={styles.field}>
            <Text style={styles.label}>Category *</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={category}
                onValueChange={setCategory}
                style={styles.picker}
              >
                <Picker.Item label="Select a category..." value="" />
                {supportCategories.map((cat) => (
                  <Picker.Item
                    key={cat.value}
                    label={cat.label}
                    value={cat.value}
                  />
                ))}
              </Picker>
            </View>
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Subject *</Text>
            <TextInput
              style={styles.input}
              value={subject}
              onChangeText={setSubject}
              placeholder="Brief description of your issue"
              placeholderTextColor={Colors.textLight}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Message *</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={message}
              onChangeText={setMessage}
              placeholder="Please provide as much detail as possible about your issue..."
              placeholderTextColor={Colors.textLight}
              multiline
              numberOfLines={6}
              textAlignVertical="top"
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Attachments (Optional)</Text>
            <Pressable style={styles.attachmentButton} onPress={handleAddAttachment}>
              <Paperclip color={Colors.primary} size={20} />
              <Text style={styles.attachmentText}>Add file or screenshot</Text>
            </Pressable>
            
            {attachments.map((attachment, index) => (
              <View key={index} style={styles.attachmentItem}>
                <Text style={styles.attachmentName}>{attachment}</Text>
                <Pressable onPress={() => removeAttachment(index)}>
                  <X color={Colors.textLight} size={16} />
                </Pressable>
              </View>
            ))}
          </View>

          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>What happens next?</Text>
            <Text style={styles.infoText}>
              • We'll review your request within 24 hours{'\n'}
              • You'll receive updates via email and in-app notifications{'\n'}
              • You can track your ticket status in "My Support Tickets"
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Pressable
          style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          <Send color={Colors.white} size={20} />
          <Text style={styles.submitButtonText}>
            {isSubmitting ? 'Submitting...' : 'Submit Request'}
          </Text>
        </Pressable>
      </View>
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
  header: {
    padding: 20,
    paddingBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textLight,
    lineHeight: 22,
  },
  form: {
    padding: 20,
    paddingTop: 0,
  },
  field: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 8,
  },
  pickerContainer: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    color: Colors.text,
  },
  input: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: Colors.text,
  },
  textArea: {
    height: 120,
    paddingTop: 12,
  },
  attachmentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    borderStyle: 'dashed',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  attachmentText: {
    marginLeft: 8,
    fontSize: 16,
    color: Colors.primary,
  },
  attachmentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.lightGray,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginTop: 8,
  },
  attachmentName: {
    fontSize: 14,
    color: Colors.text,
  },
  infoBox: {
    backgroundColor: Colors.primaryLight,
    padding: 16,
    borderRadius: 12,
    marginTop: 8,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: Colors.textLight,
    lineHeight: 20,
  },
  footer: {
    padding: 20,
    paddingTop: 16,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600' as const,
    marginLeft: 8,
  },
});