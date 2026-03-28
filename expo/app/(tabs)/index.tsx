import React, { useState } from 'react';
import { StyleSheet, View, Text, FlatList, RefreshControl, Pressable, SectionList, TextInput } from 'react-native';
import { Filter, Settings, Sparkles, Search, MapPin } from 'lucide-react-native';
import { router } from 'expo-router';
import { PastryCard } from '@/components/PastryCard';
import { TagList } from '@/components/TagList';
import { CreatePostButton } from '@/components/CreatePostButton';
import { AdvancedFilters } from '@/components/AdvancedFilters';
import { useRecommendations } from '@/hooks/recommendations-store';
import { useAuth } from '@/hooks/auth-store';
import { mockPosts } from '@/mocks/posts';
import { Colors } from '@/constants/colors';

// Extract all unique tags from posts
const allTags = Array.from(
  new Set(mockPosts.flatMap(post => post.tags))
).sort();

export default function HomeScreen() {
  const { currentUser } = useAuth();
  const { 
    filteredPosts, 
    getPostsByCategory, 
    searchFilters, 
    applyFilters, 
    clearFilters, 
    hasActiveFilters,
    isRecommendationsEnabled,
    toggleRecommendations,
    trackInteraction
  } = useRecommendations();
  
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'all' | 'categories'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [locationQuery, setLocationQuery] = useState('');

  const handleSelectTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag) 
        : [...prev, tag]
    );
  };

  const searchFilteredPosts = filteredPosts.filter(post => {
    const matchesSearch = !searchQuery || 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.user?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesLocation = !locationQuery || 
      post.location.toLowerCase().includes(locationQuery.toLowerCase());
    
    return matchesSearch && matchesLocation;
  });

  const tagFilteredPosts = selectedTags.length > 0
    ? searchFilteredPosts.filter(post => 
        selectedTags.some(tag => post.tags.includes(tag))
      )
    : searchFilteredPosts;

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  const handlePostPress = (postId: string) => {
    trackInteraction({ type: 'view', postId });
  };

  const handleContactBaker = (userId: string) => {
    router.push(`/(tabs)/messages?userId=${userId}`);
  };

  const renderSearchHeader = () => (
    <View style={styles.searchContainer}>
      <View style={styles.searchInputContainer}>
        <Search size={20} color={Colors.textLight} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search pastries, circles, bakers..."
          placeholderTextColor={Colors.textLight}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <Pressable 
          style={[styles.filterIconButton, hasActiveFilters && styles.activeFilterIconButton]}
          onPress={() => setShowFilters(true)}
        >
          <Filter size={20} color={hasActiveFilters ? Colors.white : Colors.primary} />
        </Pressable>
      </View>
      
      <View style={styles.locationInputContainer}>
        <MapPin size={20} color={Colors.textLight} />
        <TextInput
          style={styles.locationInput}
          placeholder="Filter by location..."
          placeholderTextColor={Colors.textLight}
          value={locationQuery}
          onChangeText={setLocationQuery}
        />
      </View>
    </View>
  );

  const renderHeader = () => (
    <>
      <View style={styles.headerContainer}>
        <View style={styles.titleContainer}>
          <Text style={styles.heading}>
            {isRecommendationsEnabled && currentUser?.tasteProfile ? 'For You' : 'Fresh Bakes'}
          </Text>
          {isRecommendationsEnabled && currentUser?.tasteProfile && (
            <Sparkles size={20} color={Colors.primary} />
          )}
        </View>
        
        <View style={styles.headerActions}>
          {!currentUser?.tasteProfile && (
            <Pressable 
              style={styles.setupButton}
              onPress={() => router.push('/taste-profile-setup')}
            >
              <Settings size={16} color={Colors.primary} />
              <Text style={styles.setupButtonText}>Setup Taste Profile</Text>
            </Pressable>
          )}
          
          <Pressable 
            style={[styles.filterButton, hasActiveFilters && styles.activeFilterButton]}
            onPress={() => setShowFilters(true)}
          >
            <Filter size={16} color={hasActiveFilters ? Colors.white : Colors.primary} />
            <Text style={[
              styles.filterButtonText,
              hasActiveFilters && styles.activeFilterButtonText
            ]}>
              Filters
            </Text>
          </Pressable>
        </View>
      </View>

      {currentUser?.tasteProfile && (
        <View style={styles.recommendationToggle}>
          <Pressable 
            style={[styles.toggleButton, isRecommendationsEnabled && styles.activeToggleButton]}
            onPress={toggleRecommendations}
          >
            <Text style={[
              styles.toggleButtonText,
              isRecommendationsEnabled && styles.activeToggleButtonText
            ]}>
              Smart Recommendations
            </Text>
          </Pressable>
          <Pressable 
            style={[styles.toggleButton, !isRecommendationsEnabled && styles.activeToggleButton]}
            onPress={toggleRecommendations}
          >
            <Text style={[
              styles.toggleButtonText,
              !isRecommendationsEnabled && styles.activeToggleButtonText
            ]}>
              All Posts
            </Text>
          </Pressable>
        </View>
      )}

      <TagList 
        tags={allTags} 
        selectedTags={selectedTags}
        onSelectTag={handleSelectTag}
      />

      {hasActiveFilters && (
        <View style={styles.activeFiltersContainer}>
          <Text style={styles.activeFiltersText}>
            {Object.keys(searchFilters).length} filter(s) active
          </Text>
          <Pressable onPress={clearFilters}>
            <Text style={styles.clearFiltersText}>Clear all</Text>
          </Pressable>
        </View>
      )}
    </>
  );

  const renderCategorizedView = () => {
    const categories = getPostsByCategory();
    const sections = [
      { title: 'For You', data: categories.forYou },
      { title: 'Nearby', data: categories.nearby },
      { title: 'Trending', data: categories.trending },
      { title: 'Fresh', data: categories.fresh },
    ].filter(section => section.data.length > 0);

    return (
      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <PastryCard 
            post={item} 
            onPress={() => handlePostPress(item.id)}
            onContact={handleContactBaker}
          />
        )}
        renderSectionHeader={({ section: { title } }) => (
          <Text style={styles.sectionTitle}>{title}</Text>
        )}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={renderHeader()}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No pastries found</Text>
          </View>
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Colors.primary}
            colors={[Colors.primary]}
          />
        }
        stickySectionHeadersEnabled={false}
      />
    );
  };

  const renderAllView = () => (
    <FlatList
      data={tagFilteredPosts}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <PastryCard 
          post={item} 
          onPress={() => handlePostPress(item.id)}
          onContact={handleContactBaker}
        />
      )}
      contentContainerStyle={styles.listContent}
      ListHeaderComponent={renderHeader()}
      ListEmptyComponent={
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No pastries found</Text>
        </View>
      }
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={Colors.primary}
          colors={[Colors.primary]}
        />
      }
    />
  );

  return (
    <View style={styles.container}>
      {renderSearchHeader()}
      {viewMode === 'categories' ? renderCategorizedView() : renderAllView()}
      
      <CreatePostButton />
      
      <AdvancedFilters
        visible={showFilters}
        onClose={() => setShowFilters(false)}
        filters={searchFilters}
        onApplyFilters={applyFilters}
        onClearFilters={clearFilters}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  listContent: {
    padding: 16,
    paddingBottom: 80, // Extra space for the create button
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  heading: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  setupButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.white,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  setupButtonText: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: '500' as const,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.white,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  activeFilterButton: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterButtonText: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: '500' as const,
  },
  activeFilterButtonText: {
    color: Colors.white,
  },
  recommendationToggle: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: 8,
    padding: 4,
    marginBottom: 16,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  activeToggleButton: {
    backgroundColor: Colors.primary,
  },
  toggleButtonText: {
    fontSize: 14,
    color: Colors.text,
    fontWeight: '500' as const,
  },
  activeToggleButtonText: {
    color: Colors.white,
  },
  activeFiltersContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 16,
  },
  activeFiltersText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '500' as const,
  },
  clearFiltersText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '600' as const,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: Colors.text,
    marginTop: 24,
    marginBottom: 12,
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
  searchContainer: {
    backgroundColor: Colors.white,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.lightGray,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.text,
    marginLeft: 8,
    marginRight: 8,
  },
  filterIconButton: {
    padding: 4,
    borderRadius: 8,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  activeFilterIconButton: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  locationInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.lightGray,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  locationInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.text,
    marginLeft: 8,
  },
});