import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TextInput, 
  Pressable, 
  ScrollView,
  ActivityIndicator,
  Alert
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Colors } from '@/constants/colors';
import { Flag } from 'lucide-react-native';

const reportReasons = [
  { value: 'spam', label: 'Spam or unwanted content' },
  { value: 'inappropriate', label: 'Inappropriate content' },
  { value: 'unsafe', label: 'Food safety concerns' },
  { value: 'other', label: 'Other' },
];

export default function ReportScreen() {
  const [selectedReason, setSelectedReason] = useState<string>('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { postId, userId } = useLocalSearchParams<{ postId?: string; userId?: string }>();

  const handleSubmitReport = async () => {
    if (!selectedReason) {
      Alert.alert('Error', 'Please select a reason for reporting');
      return;
    }

    if (selectedReason === 'other' && !description.trim()) {
      Alert.alert('Error', 'Please provide a description for your report');
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      Alert.alert(
        'Report Submitted',
        'Thank you for your report. Our team will review it and take appropriate action.',
        [{ text: 'OK', onPress: () => router.back() }]
      );
    }, 1500);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Flag size={24} color={Colors.primary} />
          <Text style={styles.title}>Report {postId ? 'Post' : 'User'}</Text>
        </View>
        
        <Text style={styles.subtitle}>
          Help us keep the community safe by reporting content that violates our guidelines.
        </Text>
        
        <Text style={styles.sectionTitle}>Reason for reporting:</Text>
        
        <View style={styles.reasonsContainer}>
          {reportReasons.map((reason) => (
            <Pressable
              key={reason.value}
              style={[
                styles.reasonButton,
                selectedReason === reason.value && styles.selectedReasonButton
              ]}
              onPress={() => setSelectedReason(reason.value)}
            >
              <View style={[
                styles.radioButton,
                selectedReason === reason.value && styles.selectedRadioButton
              ]}>
                {selectedReason === reason.value && (
                  <View style={styles.radioButtonInner} />
                )}
              </View>
              <Text style={[
                styles.reasonText,
                selectedReason === reason.value && styles.selectedReasonText
              ]}>
                {reason.label}
              </Text>
            </Pressable>
          ))}
        </View>
        
        <View style={styles.inputContainer}>
          <Text style={styles.label}>
            Additional details {selectedReason === 'other' ? '(required)' : '(optional)'}:
          </Text>
          <TextInput
            style={styles.textArea}
            placeholder="Please provide more details about your report..."
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            maxLength={500}
          />
          <Text style={styles.characterCount}>
            {description.length}/500
          </Text>
        </View>
        
        <View style={styles.disclaimer}>
          <Text style={styles.disclaimerText}>
            Reports are reviewed by our moderation team. False reports may result in action against your account.
          </Text>
        </View>
        
        <Pressable 
          style={[
            styles.submitButton,
            !selectedReason && styles.submitButtonDisabled,
            isLoading && styles.submitButtonLoading
          ]}
          onPress={handleSubmitReport}
          disabled={!selectedReason || isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color={Colors.white} />
          ) : (
            <Text style={styles.submitButtonText}>Submit Report</Text>
          )}
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: Colors.text,
    marginLeft: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textLight,
    lineHeight: 24,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 16,
  },
  reasonsContainer: {
    marginBottom: 24,
  },
  reasonButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.gray,
  },
  selectedReasonButton: {
    borderColor: Colors.primary,
    backgroundColor: Colors.secondary,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.gray,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedRadioButton: {
    borderColor: Colors.primary,
  },
  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.primary,
  },
  reasonText: {
    fontSize: 16,
    color: Colors.text,
    flex: 1,
  },
  selectedReasonText: {
    fontWeight: '600' as const,
  },
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 8,
  },
  textArea: {
    backgroundColor: Colors.white,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    color: Colors.text,
    borderWidth: 1,
    borderColor: Colors.gray,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  characterCount: {
    fontSize: 12,
    color: Colors.textLight,
    textAlign: 'right',
    marginTop: 4,
  },
  disclaimer: {
    backgroundColor: Colors.lightGray,
    padding: 12,
    borderRadius: 8,
    marginBottom: 24,
  },
  disclaimerText: {
    fontSize: 12,
    color: Colors.textLight,
    lineHeight: 18,
  },
  submitButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: Colors.gray,
  },
  submitButtonLoading: {
    opacity: 0.7,
  },
  submitButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600' as const,
  },
});