import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Modal } from 'react-native';
import { X, Filter, MapPin, Star } from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import { CUISINE_TYPES, FOOD_TYPES, RADIUS_OPTIONS } from '@/constants/taste-profile';
import { ALLERGEN_TAGS, SPECIAL_TAGS } from '@/constants/tags';
import { SearchFilters } from '@/types';

interface AdvancedFiltersProps {
  visible: boolean;
  onClose: () => void;
  filters: SearchFilters;
  onApplyFilters: (filters: SearchFilters) => void;
  onClearFilters: () => void;
}

export function AdvancedFilters({ 
  visible, 
  onClose, 
  filters, 
  onApplyFilters, 
  onClearFilters 
}: AdvancedFiltersProps) {
  const [localFilters, setLocalFilters] = useState<SearchFilters>(filters);

  const updateFilter = <K extends keyof SearchFilters>(
    key: K, 
    value: SearchFilters[K]
  ) => {
    setLocalFilters(prev => ({ ...prev, [key]: value }));
  };

  const toggleArrayFilter = <K extends keyof SearchFilters>(
    key: K,
    value: string,
    currentArray: string[] = []
  ) => {
    const newArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value];
    updateFilter(key, newArray as SearchFilters[K]);
  };

  const handleApply = () => {
    onApplyFilters(localFilters);
    onClose();
  };

  const handleClear = () => {
    const clearedFilters: SearchFilters = {};
    setLocalFilters(clearedFilters);
    onClearFilters();
    onClose();
  };

  const renderSection = (
    title: string,
    icon: React.ReactNode,
    content: React.ReactNode
  ) => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        {icon}
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      {content}
    </View>
  );

  const renderTagGrid = (
    tags: { value: string; label: string; emoji: string }[],
    selectedTags: string[] = [],
    onToggle: (value: string) => void
  ) => (
    <View style={styles.tagGrid}>
      {tags.map((tag) => (
        <Pressable
          key={tag.value}
          style={[
            styles.filterTag,
            selectedTags.includes(tag.value) && styles.selectedFilterTag
          ]}
          onPress={() => onToggle(tag.value)}
        >
          <Text style={styles.tagEmoji}>{tag.emoji}</Text>
          <Text style={[
            styles.filterTagText,
            selectedTags.includes(tag.value) && styles.selectedFilterTagText
          ]}>
            {tag.label}
          </Text>
        </Pressable>
      ))}
    </View>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Filter size={24} color={Colors.primary} />
            <Text style={styles.title}>Filters</Text>
          </View>
          <Pressable onPress={onClose} style={styles.closeButton}>
            <X size={24} color={Colors.text} />
          </Pressable>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {renderSection(
            "Distance",
            <MapPin size={20} color={Colors.primary} />,
            <View style={styles.radiusContainer}>
              {RADIUS_OPTIONS.map((option) => (
                <Pressable
                  key={option.value}
                  style={[
                    styles.radiusOption,
                    localFilters.radius === option.value && styles.selectedRadiusOption
                  ]}
                  onPress={() => updateFilter('radius', option.value)}
                >
                  <Text style={[
                    styles.radiusText,
                    localFilters.radius === option.value && styles.selectedRadiusText
                  ]}>
                    {option.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          )}

          {renderSection(
            "Food Types",
            <View><Text style={styles.sectionEmoji}>🧁</Text></View>,
            renderTagGrid(
              FOOD_TYPES,
              localFilters.foodTypes,
              (value) => toggleArrayFilter('foodTypes', value, localFilters.foodTypes)
            )
          )}

          {renderSection(
            "Cuisines",
            <View><Text style={styles.sectionEmoji}>🌍</Text></View>,
            renderTagGrid(
              CUISINE_TYPES,
              localFilters.cuisines,
              (value) => toggleArrayFilter('cuisines', value, localFilters.cuisines)
            )
          )}

          {renderSection(
            "Avoid Allergens",
            <View><Text style={styles.sectionEmoji}>⚠️</Text></View>,
            renderTagGrid(
              ALLERGEN_TAGS,
              localFilters.allergenTags,
              (value) => toggleArrayFilter('allergenTags', value, localFilters.allergenTags)
            )
          )}

          {renderSection(
            "Special Dietary",
            <View><Text style={styles.sectionEmoji}>🌱</Text></View>,
            renderTagGrid(
              SPECIAL_TAGS,
              localFilters.specialTags,
              (value) => toggleArrayFilter('specialTags', value, localFilters.specialTags)
            )
          )}

          {renderSection(
            "Minimum Rating",
            <Star size={20} color={Colors.primary} />,
            <View style={styles.ratingContainer}>
              {[3, 3.5, 4, 4.5, 5].map((rating) => (
                <Pressable
                  key={rating}
                  style={[
                    styles.ratingOption,
                    localFilters.minRating === rating && styles.selectedRatingOption
                  ]}
                  onPress={() => updateFilter('minRating', rating)}
                >
                  <Text style={[
                    styles.ratingText,
                    localFilters.minRating === rating && styles.selectedRatingText
                  ]}>
                    {rating}+ ⭐
                  </Text>
                </Pressable>
              ))}
            </View>
          )}

          {renderSection(
            "Price Range",
            <View><Text style={styles.sectionEmoji}>💰</Text></View>,
            <View style={styles.priceContainer}>
              {[
                { min: 0, max: 5, label: 'Under $5' },
                { min: 5, max: 15, label: '$5 - $15' },
                { min: 15, max: 30, label: '$15 - $30' },
                { min: 30, max: 100, label: '$30+' },
              ].map((range) => (
                <Pressable
                  key={`${range.min}-${range.max}`}
                  style={[
                    styles.priceOption,
                    localFilters.priceRange?.min === range.min && 
                    localFilters.priceRange?.max === range.max && 
                    styles.selectedPriceOption
                  ]}
                  onPress={() => updateFilter('priceRange', { min: range.min, max: range.max })}
                >
                  <Text style={[
                    styles.priceText,
                    localFilters.priceRange?.min === range.min && 
                    localFilters.priceRange?.max === range.max && 
                    styles.selectedPriceText
                  ]}>
                    {range.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          )}
        </ScrollView>

        <View style={styles.footer}>
          <Pressable style={styles.clearButton} onPress={handleClear}>
            <Text style={styles.clearButtonText}>Clear All</Text>
          </Pressable>
          <Pressable style={styles.applyButton} onPress={handleApply}>
            <Text style={styles.applyButtonText}>Apply Filters</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
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
    padding: 20,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  closeButton: {
    padding: 4,
  },
  content: {
    flex: 1,
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  sectionEmoji: {
    fontSize: 20,
  },
  tagGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  selectedFilterTag: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  tagEmoji: {
    fontSize: 14,
    marginRight: 6,
  },
  filterTagText: {
    fontSize: 12,
    color: Colors.text,
    fontWeight: '500' as const,
  },
  selectedFilterTagText: {
    color: Colors.white,
  },
  radiusContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  radiusOption: {
    backgroundColor: Colors.white,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  selectedRadiusOption: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  radiusText: {
    fontSize: 14,
    color: Colors.text,
    fontWeight: '500' as const,
  },
  selectedRadiusText: {
    color: Colors.white,
  },
  ratingContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  ratingOption: {
    backgroundColor: Colors.white,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  selectedRatingOption: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  ratingText: {
    fontSize: 14,
    color: Colors.text,
    fontWeight: '500' as const,
  },
  selectedRatingText: {
    color: Colors.white,
  },
  priceContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  priceOption: {
    backgroundColor: Colors.white,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  selectedPriceOption: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  priceText: {
    fontSize: 14,
    color: Colors.text,
    fontWeight: '500' as const,
  },
  selectedPriceText: {
    color: Colors.white,
  },
  footer: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  clearButton: {
    flex: 1,
    backgroundColor: 'transparent',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  clearButtonText: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: '500' as const,
  },
  applyButton: {
    flex: 2,
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  applyButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600' as const,
  },
});