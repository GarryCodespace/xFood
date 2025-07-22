import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, FlatList, Pressable } from 'react-native';
import { PastryCard } from '@/components/PastryCard';
import { CircleCard } from '@/components/CircleCard';
import { TagList } from '@/components/TagList';
import { mockPosts } from '@/mocks/posts';
import { mockCircles } from '@/mocks/circles';
import { Colors } from '@/constants/colors';
import { Search as SearchIcon, X } from 'lucide-react-native';

// Extract all unique tags from posts and circles
const allTags = Array.from(
  new Set([
    ...mockPosts.flatMap(post => post.tags),
    ...mockCircles.flatMap(circle => circle.tags)
  ])
).sort();

export default function DiscoverScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'posts' | 'circles'>('posts');

  const handleSelectTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag) 
        : [...prev, tag]
    );
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  // Filter posts based on search query and selected tags
  const filteredPosts = mockPosts.filter(post => {
    const matchesSearch = searchQuery === '' || 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTags = selectedTags.length === 0 ||
      selectedTags.some(tag => post.tags.includes(tag));
    
    return matchesSearch && matchesTags;
  });

  // Filter circles based on search query and selected tags
  const filteredCircles = mockCircles.filter(circle => {
    const matchesSearch = searchQuery === '' || 
      circle.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      circle.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTags = selectedTags.length === 0 ||
      selectedTags.some(tag => circle.tags.includes(tag));
    
    return matchesSearch && matchesTags;
  });

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <SearchIcon size={20} color={Colors.textLight} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search pastries, circles, bakers..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={Colors.textLight}
          />
          {searchQuery.length > 0 && (
            <Pressable onPress={clearSearch} style={styles.clearButton}>
              <X size={16} color={Colors.textLight} />
            </Pressable>
          )}
        </View>
      </View>

      <TagList 
        tags={allTags} 
        selectedTags={selectedTags}
        onSelectTag={handleSelectTag}
      />

      <View style={styles.tabContainer}>
        <Pressable
          style={[
            styles.tab,
            activeTab === 'posts' && styles.activeTab
          ]}
          onPress={() => setActiveTab('posts')}
        >
          <Text 
            style={[
              styles.tabText,
              activeTab === 'posts' && styles.activeTabText
            ]}
          >
            Pastries
          </Text>
        </Pressable>
        <Pressable
          style={[
            styles.tab,
            activeTab === 'circles' && styles.activeTab
          ]}
          onPress={() => setActiveTab('circles')}
        >
          <Text 
            style={[
              styles.tabText,
              activeTab === 'circles' && styles.activeTabText
            ]}
          >
            Circles
          </Text>
        </Pressable>
      </View>

      {activeTab === 'posts' ? (
        <FlatList
          data={filteredPosts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <PastryCard post={item} />}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No pastries found</Text>
            </View>
          }
        />
      ) : (
        <FlatList
          data={filteredCircles}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <CircleCard circle={item} />}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No circles found</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  searchContainer: {
    padding: 16,
    backgroundColor: Colors.white,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.lightGray,
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    color: Colors.text,
    fontSize: 14,
  },
  clearButton: {
    padding: 4,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray,
  },
  tab: {
    paddingVertical: 12,
    marginRight: 24,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: Colors.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.textLight,
  },
  activeTabText: {
    color: Colors.primary,
  },
  listContent: {
    padding: 16,
  },
  emptyContainer: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: Colors.textLight,
    textAlign: 'center',
  },
});