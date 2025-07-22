import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Alert } from 'react-native';
import { Colors } from '@/constants/colors';
import { FLAVOR_TAGS, CUISINE_TYPES, FOOD_TYPES, RADIUS_OPTIONS } from '@/constants/taste-profile';
import { ALLERGEN_TAGS } from '@/constants/tags';
import { TasteProfile, AllergenTag } from '@/types';
import { useAuth } from '@/hooks/auth-store';

interface TasteProfileBuilderProps {
  initialProfile?: TasteProfile;
  onSave: (profile: TasteProfile) => void;
  onSkip?: () => void;
}

export function TasteProfileBuilder({ initialProfile, onSave, onSkip }: TasteProfileBuilderProps) {
  const [likedTags, setLikedTags] = useState<string[]>(initialProfile?.likedTags || []);
  const [dislikedTags, setDislikedTags] = useState<string[]>(initialProfile?.dislikedTags || []);
  const [preferredCuisines, setPreferredCuisines] = useState<string[]>(initialProfile?.preferredCuisines || []);
  const [allergens, setAllergens] = useState<AllergenTag[]>(initialProfile?.allergens || []);
  const [favoriteFoodTypes, setFavoriteFoodTypes] = useState<string[]>(initialProfile?.favoriteFoodTypes || []);
  const [preferredRadius, setPreferredRadius] = useState<number>(initialProfile?.preferredRadius || 25);

  const toggleSelection = (item: string, list: string[], setList: (list: string[]) => void) => {
    if (list.includes(item)) {
      setList(list.filter(i => i !== item));
    } else {
      setList([...list, item]);
    }
  };

  const toggleAllergenSelection = (item: AllergenTag, list: AllergenTag[], setList: (list: AllergenTag[]) => void) => {
    if (list.includes(item)) {
      setList(list.filter(i => i !== item));
    } else {
      setList([...list, item]);
    }
  };

  const handleSave = () => {
    const profile: TasteProfile = {
      likedTags,
      dislikedTags,
      preferredCuisines,
      allergens,
      favoriteFoodTypes,
      preferredRadius,
    };
    console.log('Saving taste profile:', profile);
    onSave(profile);
  };

  const renderTagSection = (
    title: string,
    tags: { value: string; label: string; emoji: string }[],
    selectedTags: string[],
    onToggle: (tag: string) => void,
    subtitle?: string
  ) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {subtitle && <Text style={styles.sectionSubtitle}>{subtitle}</Text>}
      <View style={styles.tagContainer}>
        {tags.map((tag) => (
          <Pressable
            key={tag.value}
            style={[
              styles.tag,
              selectedTags.includes(tag.value) && styles.selectedTag
            ]}
            onPress={() => onToggle(tag.value)}
          >
            <Text style={styles.tagEmoji}>{tag.emoji}</Text>
            <Text style={[
              styles.tagText,
              selectedTags.includes(tag.value) && styles.selectedTagText
            ]}>
              {tag.label}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Build Your Taste Profile</Text>
        <Text style={styles.subtitle}>
          Help us recommend the perfect bakes for you!
        </Text>
      </View>

      {renderTagSection(
        "Which flavors do you love?",
        FLAVOR_TAGS,
        likedTags,
        (tag) => toggleSelection(tag, likedTags, setLikedTags),
        "Select all that apply"
      )}

      {renderTagSection(
        "Any flavors you dislike?",
        FLAVOR_TAGS,
        dislikedTags,
        (tag) => toggleSelection(tag, dislikedTags, setDislikedTags),
        "We'll avoid recommending these"
      )}

      {renderTagSection(
        "Preferred cuisine styles?",
        CUISINE_TYPES,
        preferredCuisines,
        (tag) => toggleSelection(tag, preferredCuisines, setPreferredCuisines)
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Do you have any allergies?</Text>
        <Text style={styles.sectionSubtitle}>We'll filter out items with these allergens</Text>
        <View style={styles.tagContainer}>
          {ALLERGEN_TAGS.map((tag) => (
            <Pressable
              key={tag.value}
              style={[
                styles.tag,
                allergens.includes(tag.value) && styles.selectedTag
              ]}
              onPress={() => toggleAllergenSelection(tag.value, allergens, setAllergens)}
            >
              <Text style={styles.tagEmoji}>{tag.emoji}</Text>
              <Text style={[
                styles.tagText,
                allergens.includes(tag.value) && styles.selectedTagText
              ]}>
                {tag.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      {renderTagSection(
        "Favorite baked goods?",
        FOOD_TYPES,
        favoriteFoodTypes,
        (tag) => toggleSelection(tag, favoriteFoodTypes, setFavoriteFoodTypes)
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>How far are you willing to travel?</Text>
        <Text style={styles.sectionSubtitle}>We'll show bakes within this radius</Text>
        <View style={styles.radiusContainer}>
          {RADIUS_OPTIONS.map((option) => (
            <Pressable
              key={option.value}
              style={[
                styles.radiusOption,
                preferredRadius === option.value && styles.selectedRadiusOption
              ]}
              onPress={() => setPreferredRadius(option.value)}
            >
              <Text style={[
                styles.radiusText,
                preferredRadius === option.value && styles.selectedRadiusText
              ]}>
                {option.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <Pressable style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save Profile</Text>
        </Pressable>
        {onSkip && (
          <Pressable style={styles.skipButton} onPress={onSkip}>
            <Text style={styles.skipButtonText}>Skip for now</Text>
          </Pressable>
        )}
      </View>
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
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textLight,
    textAlign: 'center',
  },
  section: {
    padding: 20,
    paddingTop: 0,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: Colors.textLight,
    marginBottom: 16,
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 8,
  },
  selectedTag: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  tagEmoji: {
    fontSize: 16,
    marginRight: 6,
  },
  tagText: {
    fontSize: 14,
    color: Colors.text,
    fontWeight: '500' as const,
  },
  selectedTagText: {
    color: Colors.white,
  },
  radiusContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  radiusOption: {
    backgroundColor: Colors.white,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    minWidth: 80,
    alignItems: 'center',
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
  buttonContainer: {
    padding: 20,
    gap: 12,
  },
  saveButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600' as const,
  },
  skipButton: {
    backgroundColor: 'transparent',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  skipButtonText: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: '500' as const,
  },
});