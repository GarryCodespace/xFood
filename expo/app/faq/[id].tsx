import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Share } from 'react-native';
import { Stack, useLocalSearchParams, router } from 'expo-router';
import { ThumbsUp, ThumbsDown, Share2, MessageSquare } from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import { mockFAQs } from '@/mocks/support';

export default function FAQDetailScreen() {
  const { id } = useLocalSearchParams();
  const [isHelpful, setIsHelpful] = useState<boolean | null>(null);

  const faq = mockFAQs.find(f => f.id === id);

  if (!faq) {
    return (
      <View style={styles.container}>
        <Stack.Screen
          options={{
            title: 'FAQ',
            headerStyle: { backgroundColor: Colors.white },
            headerTintColor: Colors.text,
          }}
        />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>FAQ not found</Text>
        </View>
      </View>
    );
  }

  const handleHelpfulVote = (helpful: boolean) => {
    setIsHelpful(helpful);
    // In a real app, this would send the vote to the backend
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `${faq.question}\n\n${faq.answer}`,
        title: faq.question,
      });
    } catch (error) {
      console.error('Error sharing FAQ:', error);
    }
  };

  const handleContactSupport = () => {
    router.push('/contact-support');
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'FAQ',
          headerStyle: { backgroundColor: Colors.white },
          headerTintColor: Colors.text,
          headerRight: () => (
            <Pressable onPress={handleShare} style={styles.shareButton}>
              <Share2 color={Colors.text} size={20} />
            </Pressable>
          ),
        }}
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{faq.category}</Text>
          </View>
          <Text style={styles.question}>{faq.question}</Text>
        </View>

        <View style={styles.answerContainer}>
          <Text style={styles.answer}>{faq.answer}</Text>
        </View>

        <View style={styles.helpfulSection}>
          <Text style={styles.helpfulTitle}>Was this helpful?</Text>
          <View style={styles.helpfulButtons}>
            <Pressable
              style={[
                styles.helpfulButton,
                isHelpful === true && styles.helpfulButtonActive,
              ]}
              onPress={() => handleHelpfulVote(true)}
            >
              <ThumbsUp
                color={isHelpful === true ? Colors.white : Colors.success}
                size={20}
              />
              <Text
                style={[
                  styles.helpfulButtonText,
                  isHelpful === true && styles.helpfulButtonTextActive,
                ]}
              >
                Yes
              </Text>
            </Pressable>

            <Pressable
              style={[
                styles.helpfulButton,
                isHelpful === false && styles.helpfulButtonActive,
              ]}
              onPress={() => handleHelpfulVote(false)}
            >
              <ThumbsDown
                color={isHelpful === false ? Colors.white : Colors.error}
                size={20}
              />
              <Text
                style={[
                  styles.helpfulButtonText,
                  isHelpful === false && styles.helpfulButtonTextActive,
                ]}
              >
                No
              </Text>
            </Pressable>
          </View>

          {isHelpful !== null && (
            <Text style={styles.thankYouText}>
              {isHelpful
                ? 'Thank you for your feedback!'
                : 'Thanks for letting us know. We\'ll work on improving this article.'}
            </Text>
          )}
        </View>

        <View style={styles.stillNeedHelp}>
          <Text style={styles.stillNeedHelpTitle}>Still need help?</Text>
          <Text style={styles.stillNeedHelpText}>
            If this article didn't answer your question, our support team is here to help.
          </Text>
          <Pressable style={styles.contactButton} onPress={handleContactSupport}>
            <MessageSquare color={Colors.white} size={20} />
            <Text style={styles.contactButtonText}>Contact Support</Text>
          </Pressable>
        </View>

        <View style={styles.metadata}>
          <Text style={styles.metadataText}>
            This article has been viewed {faq.views} times
          </Text>
        </View>
      </ScrollView>
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
  shareButton: {
    padding: 8,
  },
  header: {
    backgroundColor: Colors.white,
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  categoryBadge: {
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: Colors.primary,
  },
  question: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: Colors.text,
    lineHeight: 32,
  },
  answerContainer: {
    backgroundColor: Colors.white,
    padding: 20,
    marginTop: 8,
  },
  answer: {
    fontSize: 16,
    color: Colors.text,
    lineHeight: 24,
  },
  helpfulSection: {
    backgroundColor: Colors.white,
    padding: 20,
    marginTop: 8,
    alignItems: 'center',
  },
  helpfulTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 16,
  },
  helpfulButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  helpfulButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
  },
  helpfulButtonActive: {
    backgroundColor: Colors.success,
    borderColor: Colors.success,
  },
  helpfulButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.text,
    marginLeft: 8,
  },
  helpfulButtonTextActive: {
    color: Colors.white,
  },
  thankYouText: {
    fontSize: 14,
    color: Colors.textLight,
    marginTop: 12,
    textAlign: 'center',
  },
  stillNeedHelp: {
    backgroundColor: Colors.primaryLight,
    padding: 20,
    marginTop: 8,
    alignItems: 'center',
  },
  stillNeedHelpTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 8,
  },
  stillNeedHelpText: {
    fontSize: 14,
    color: Colors.textLight,
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 20,
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  contactButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600' as const,
    marginLeft: 8,
  },
  metadata: {
    padding: 20,
    alignItems: 'center',
  },
  metadataText: {
    fontSize: 12,
    color: Colors.textLight,
  },
});