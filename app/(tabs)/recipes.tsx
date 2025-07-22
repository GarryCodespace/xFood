import React, { useState } from 'react';
import { StyleSheet, View, Text, FlatList, Pressable, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { RecipeCard } from '@/components/RecipeCard';
import { TagList } from '@/components/TagList';
import { mockRecipes } from '@/mocks/recipes';
import { Colors } from '@/constants/colors';
import { Search as SearchIcon, X, Plus, Filter } from 'lucide-react-native';

// Extract all unique tags from recipes
const allTags = Array.from(
  new Set(mockRecipes.flatMap(recipe => recipe.tags))
).sort();

const difficultyLevels = ['Easy', 'Medium', 'Hard'];
const priceFilters = ['Free', 'Premium', 'All'];

export default function RecipesScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [selectedPriceFilter, setSelectedPriceFilter] = useState<string>('All');
  const [showFilters, setShowFilters] = useState(false);
  const router = useRouter();

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

  const clearAllFilters = () => {
    setSelectedTags([]);
    setSelectedDifficulty('All');
    setSelectedPriceFilter('All');
    setSearchQuery('');
  };

  // Filter recipes based on search query, tags, difficulty, and price
  const filteredRecipes = mockRecipes.filter(recipe => {
    const matchesSearch = searchQuery === '' || 
      recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recipe.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recipe.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesTags = selectedTags.length === 0 ||
      selectedTags.some(tag => recipe.tags.includes(tag));
    
    const matchesDifficulty = selectedDifficulty === 'All' ||
      recipe.difficulty === selectedDifficulty;
    
    const matchesPrice = selectedPriceFilter === 'All' ||
      (selectedPriceFilter === 'Free' && !recipe.isPremium) ||
      (selectedPriceFilter === 'Premium' && recipe.isPremium);
    
    return matchesSearch && matchesTags && matchesDifficulty && matchesPrice;
  });

  const handleCreateRecipe = () => {
    router.push('/create-recipe');
  };

  const activeFiltersCount = selectedTags.length + 
    (selectedDifficulty !== 'All' ? 1 : 0) + 
    (selectedPriceFilter !== 'All' ? 1 : 0);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Recipe Marketplace</Text>
        <Pressable style={styles.createButton} onPress={handleCreateRecipe}>
          <Plus size={20} color={Colors.white} />
          <Text style={styles.createButtonText}>Create</Text>
        </Pressable>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <SearchIcon size={20} color={Colors.textLight} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search recipes..."
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
        
        <Pressable 
          style={[styles.filterButton, activeFiltersCount > 0 && styles.filterButtonActive]}
          onPress={() => setShowFilters(!showFilters)}
        >
          <Filter size={20} color={activeFiltersCount > 0 ? Colors.white : Colors.primary} />
          {activeFiltersCount > 0 && (
            <View style={styles.filterBadge}>
              <Text style={styles.filterBadgeText}>{activeFiltersCount}</Text>
            </View>
          )}
        </Pressable>
      </View>

      {showFilters && (
        <View style={styles.filtersContainer}>
          <View style={styles.filterSection}>
            <Text style={styles.filterLabel}>Price:</Text>
            <View style={styles.filterOptions}>
              {priceFilters.map(filter => (
                <Pressable
                  key={filter}
                  style={[
                    styles.filterOption,
                    selectedPriceFilter === filter && styles.selectedFilterOption
                  ]}
                  onPress={() => setSelectedPriceFilter(filter)}
                >
                  <Text style={[
                    styles.filterOptionText,
                    selectedPriceFilter === filter && styles.selectedFilterOptionText
                  ]}>
                    {filter}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          <View style={styles.filterSection}>
            <Text style={styles.filterLabel}>Difficulty:</Text>
            <View style={styles.filterOptions}>
              <Pressable
                style={[
                  styles.filterOption,
                  selectedDifficulty === 'All' && styles.selectedFilterOption
                ]}
                onPress={() => setSelectedDifficulty('All')}
              >
                <Text style={[
                  styles.filterOptionText,
                  selectedDifficulty === 'All' && styles.selectedFilterOptionText
                ]}>
                  All
                </Text>
              </Pressable>
              {difficultyLevels.map(level => (
                <Pressable
                  key={level}
                  style={[
                    styles.filterOption,
                    selectedDifficulty === level && styles.selectedFilterOption
                  ]}
                  onPress={() => setSelectedDifficulty(level)}
                >
                  <Text style={[
                    styles.filterOptionText,
                    selectedDifficulty === level && styles.selectedFilterOptionText
                  ]}>
                    {level}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          <TagList 
            tags={allTags} 
            selectedTags={selectedTags}
            onSelectTag={handleSelectTag}
            scrollable={false}
          />

          {activeFiltersCount > 0 && (
            <Pressable style={styles.clearFiltersButton} onPress={clearAllFilters}>
              <Text style={styles.clearFiltersText}>Clear All Filters</Text>
            </Pressable>
          )}
        </View>
      )}

      <FlatList
        data={filteredRecipes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <RecipeCard recipe={item} />}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No recipes found</Text>
            <Text style={styles.emptySubtext}>Try adjusting your search or filters</Text>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray,
  },
  title: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  createButtonText: {
    color: Colors.white,
    fontWeight: '600' as const,
    marginLeft: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: Colors.white,
    alignItems: 'center',
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.lightGray,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginRight: 12,
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
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: Colors.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  filterButtonActive: {
    backgroundColor: Colors.primary,
  },
  filterBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: Colors.error,
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterBadgeText: {
    color: Colors.white,
    fontSize: 10,
    fontWeight: '600' as const,
  },
  filtersContainer: {
    backgroundColor: Colors.white,
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray,
  },
  filterSection: {
    marginBottom: 16,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 8,
  },
  filterOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  filterOption: {
    backgroundColor: Colors.lightGray,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  selectedFilterOption: {
    backgroundColor: Colors.primary,
  },
  filterOptionText: {
    fontSize: 12,
    color: Colors.textLight,
    fontWeight: '500' as const,
  },
  selectedFilterOptionText: {
    color: Colors.white,
  },
  clearFiltersButton: {
    alignSelf: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  clearFiltersText: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: '600' as const,
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
    marginBottom: 4,
  },
  emptySubtext: {
    fontSize: 14,
    color: Colors.textLight,
    textAlign: 'center',
  },
});