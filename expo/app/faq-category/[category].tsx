import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Stack, useLocalSearchParams, router } from 'expo-router';
import { ChevronRight, Eye } from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import { mockFAQs } from '@/mocks/support';

export default function FAQCategoryScreen() {
  const { category } = useLocalSearchParams();
  const categoryName = typeof category === 'string' ? category : '';

  const categoryFAQs = mockFAQs.filter(
    faq => faq.category.toLowerCase() === categoryName.toLowerCase()
  );

  const displayCategoryName = categoryName.charAt(0).toUpperCase() + categoryName.slice(1);

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: displayCategoryName,
          headerStyle: { backgroundColor: Colors.white },
          headerTintColor: Colors.text,
        }}
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>{displayCategoryName}</Text>
          <Text style={styles.subtitle}>
            {categoryFAQs.length} article{categoryFAQs.length !== 1 ? 's' : ''} in this category
          </Text>
        </View>

        <View style={styles.faqList}>
          {categoryFAQs.map((faq) => (
            <Pressable
              key={faq.id}
              style={styles.faqItem}
              onPress={() => router.push(`/faq/${faq.id}`)}
            >
              <View style={styles.faqContent}>
                <Text style={styles.faqQuestion}>{faq.question}</Text>
                <Text style={styles.faqAnswer} numberOfLines={2}>
                  {faq.answer}
                </Text>
                <View style={styles.faqMeta}>
                  <View style={styles.viewCount}>
                    <Eye color={Colors.textLight} size={12} />
                    <Text style={styles.viewCountText}>{faq.views} views</Text>
                  </View>
                  {faq.isPopular && (
                    <View style={styles.popularBadge}>
                      <Text style={styles.popularText}>Popular</Text>
                    </View>
                  )}
                </View>
              </View>
              <ChevronRight color={Colors.textLight} size={20} />
            </Pressable>
          ))}
        </View>

        {categoryFAQs.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No articles found</Text>
            <Text style={styles.emptyText}>
              There are no FAQ articles in this category yet.
            </Text>
            <Pressable
              style={styles.contactButton}
              onPress={() => router.push('/contact-support')}
            >
              <Text style={styles.contactButtonText}>Contact Support</Text>
            </Pressable>
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
  content: {
    flex: 1,
  },
  header: {
    backgroundColor: Colors.white,
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
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
  },
  faqList: {
    padding: 20,
  },
  faqItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  faqContent: {
    flex: 1,
  },
  faqQuestion: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 8,
  },
  faqAnswer: {
    fontSize: 14,
    color: Colors.textLight,
    lineHeight: 20,
    marginBottom: 12,
  },
  faqMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  viewCount: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewCountText: {
    fontSize: 12,
    color: Colors.textLight,
    marginLeft: 4,
  },
  popularBadge: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  popularText: {
    fontSize: 10,
    fontWeight: '600' as const,
    color: Colors.white,
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
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.textLight,
    textAlign: 'center',
    marginBottom: 24,
  },
  contactButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  contactButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600' as const,
  },
});