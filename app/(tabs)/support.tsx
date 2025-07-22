import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Pressable, Alert } from 'react-native';
import { Search, MessageSquare, FileText, ChevronRight } from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import { useSupport } from '@/hooks/support-store';
import { FAQ } from '@/types';
import { mockFAQs, supportCategories } from '@/mocks/support';
import { router } from 'expo-router';

export default function SupportScreen() {
  const { faqs, searchFAQs, getPopularFAQs, getFAQCategories } = useSupport();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredFAQs, setFilteredFAQs] = useState<FAQ[]>(mockFAQs);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setFilteredFAQs(mockFAQs);
    } else {
      const filtered = mockFAQs.filter(
        (faq: FAQ) =>
          faq.question.toLowerCase().includes(query.toLowerCase()) ||
          faq.answer.toLowerCase().includes(query.toLowerCase()) ||
          faq.category.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredFAQs(filtered);
    }
  };

  const faqCategories = Array.from(new Set(filteredFAQs.map(faq => faq.category)));
  const popularFAQs = filteredFAQs.filter(faq => faq.isPopular).slice(0, 3);

  const handleContactSupport = () => {
    router.push('/contact-support');
  };

  const handleViewTickets = () => {
    router.push('/support-tickets');
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Help & Support</Text>
        <Text style={styles.subtitle}>Find answers or get help from our team</Text>
      </View>

      <View style={styles.searchContainer}>
        <Search color={Colors.textLight} size={20} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search help articles..."
          value={searchQuery}
          onChangeText={handleSearch}
          placeholderTextColor={Colors.textLight}
        />
      </View>

      <View style={styles.quickActions}>
        <Pressable style={styles.actionButton} onPress={handleContactSupport}>
          <MessageSquare color={Colors.primary} size={24} />
          <View style={styles.actionContent}>
            <Text style={styles.actionTitle}>Contact Support</Text>
            <Text style={styles.actionSubtitle}>Get help from our team</Text>
          </View>
          <ChevronRight color={Colors.textLight} size={20} />
        </Pressable>

        <Pressable style={styles.actionButton} onPress={handleViewTickets}>
          <FileText color={Colors.primary} size={24} />
          <View style={styles.actionContent}>
            <Text style={styles.actionTitle}>My Support Tickets</Text>
            <Text style={styles.actionSubtitle}>View your support requests</Text>
          </View>
          <ChevronRight color={Colors.textLight} size={20} />
        </Pressable>
      </View>

      {popularFAQs.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Popular Questions</Text>
          {popularFAQs.map((faq) => (
            <Pressable
              key={faq.id}
              style={styles.faqItem}
              onPress={() => router.push(`/faq/${faq.id}`)}
            >
              <Text style={styles.faqQuestion}>{faq.question}</Text>
              <Text style={styles.faqCategory}>{faq.category}</Text>
              <ChevronRight color={Colors.textLight} size={16} />
            </Pressable>
          ))}
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Browse by Category</Text>
        {faqCategories.map((category) => {
          const categoryFAQs = filteredFAQs.filter(faq => faq.category === category);
          return (
            <Pressable
              key={category}
              style={styles.categoryItem}
              onPress={() => router.push(`/faq-category/${category.toLowerCase()}`)}
            >
              <View style={styles.categoryContent}>
                <Text style={styles.categoryTitle}>{category}</Text>
                <Text style={styles.categoryCount}>
                  {categoryFAQs.length} article{categoryFAQs.length !== 1 ? 's' : ''}
                </Text>
              </View>
              <ChevronRight color={Colors.textLight} size={20} />
            </Pressable>
          );
        })}
      </View>

      {searchQuery && filteredFAQs.length === 0 && (
        <View style={styles.noResults}>
          <Text style={styles.noResultsTitle}>No results found</Text>
          <Text style={styles.noResultsText}>
            Try different keywords or contact our support team for help.
          </Text>
          <Pressable style={styles.contactButton} onPress={handleContactSupport}>
            <Text style={styles.contactButtonText}>Contact Support</Text>
          </Pressable>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    padding: 20,
    paddingTop: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textLight,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    marginHorizontal: 20,
    marginBottom: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: Colors.text,
  },
  quickActions: {
    marginHorizontal: 20,
    marginBottom: 24,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  actionContent: {
    flex: 1,
    marginLeft: 12,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 4,
  },
  actionSubtitle: {
    fontSize: 14,
    color: Colors.textLight,
  },
  section: {
    marginHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 16,
  },
  faqItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  faqQuestion: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500' as const,
    color: Colors.text,
    marginBottom: 4,
  },
  faqCategory: {
    fontSize: 12,
    color: Colors.textLight,
    backgroundColor: Colors.lightGray,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 8,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  categoryContent: {
    flex: 1,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: '500' as const,
    color: Colors.text,
    marginBottom: 4,
  },
  categoryCount: {
    fontSize: 14,
    color: Colors.textLight,
  },
  noResults: {
    alignItems: 'center',
    padding: 40,
  },
  noResultsTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 8,
  },
  noResultsText: {
    fontSize: 14,
    color: Colors.textLight,
    textAlign: 'center',
    marginBottom: 20,
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