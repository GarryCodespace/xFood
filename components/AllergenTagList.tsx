import React from 'react';
import { StyleSheet, View, Text, ScrollView, Pressable } from 'react-native';
import { Colors } from '@/constants/colors';
import { ALLERGEN_TAGS, SPECIAL_TAGS } from '@/constants/tags';
import { AllergenTag, SpecialTag } from '@/types';

interface AllergenTagListProps {
  allergenTags: AllergenTag[];
  specialTags: SpecialTag[];
  selectedAllergens?: AllergenTag[];
  selectedSpecials?: SpecialTag[];
  onSelectAllergen?: (tag: AllergenTag) => void;
  onSelectSpecial?: (tag: SpecialTag) => void;
  editable?: boolean;
}

export const AllergenTagList: React.FC<AllergenTagListProps> = ({
  allergenTags,
  specialTags,
  selectedAllergens = [],
  selectedSpecials = [],
  onSelectAllergen,
  onSelectSpecial,
  editable = false
}) => {
  const renderTag = (
    tag: { value: string; label: string; emoji: string },
    isSelected: boolean,
    onPress?: () => void,
    isAllergen = false
  ) => (
    <Pressable
      key={tag.value}
      style={[
        styles.tag,
        isAllergen ? styles.allergenTag : styles.specialTag,
        isSelected && styles.selectedTag,
        !editable && styles.displayOnlyTag
      ]}
      onPress={editable ? onPress : undefined}
      disabled={!editable}
    >
      <Text style={styles.emoji}>{tag.emoji}</Text>
      <Text style={[
        styles.tagText,
        isSelected && styles.selectedTagText,
        isAllergen && styles.allergenText
      ]}>
        {tag.label}
      </Text>
    </Pressable>
  );

  if (!editable && allergenTags.length === 0 && specialTags.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      {editable && (
        <>
          <Text style={styles.sectionTitle}>Allergen Information</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollView}>
            {ALLERGEN_TAGS.map(tag => 
              renderTag(
                tag,
                selectedAllergens.includes(tag.value),
                () => onSelectAllergen?.(tag.value),
                true
              )
            )}
          </ScrollView>
          
          <Text style={styles.sectionTitle}>Special Dietary Tags</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollView}>
            {SPECIAL_TAGS.map(tag => 
              renderTag(
                tag,
                selectedSpecials.includes(tag.value),
                () => onSelectSpecial?.(tag.value)
              )
            )}
          </ScrollView>
        </>
      )}
      
      {!editable && (
        <View style={styles.displayContainer}>
          {allergenTags.map(tagValue => {
            const tag = ALLERGEN_TAGS.find(t => t.value === tagValue);
            return tag ? renderTag(tag, false, undefined, true) : null;
          })}
          {specialTags.map(tagValue => {
            const tag = SPECIAL_TAGS.find(t => t.value === tagValue);
            return tag ? renderTag(tag, false) : null;
          })}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 8,
    marginTop: 8,
  },
  scrollView: {
    marginBottom: 8,
  },
  displayContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 4,
    borderWidth: 1,
  },
  allergenTag: {
    backgroundColor: Colors.lightGray,
    borderColor: Colors.error,
  },
  specialTag: {
    backgroundColor: Colors.lightGray,
    borderColor: Colors.success,
  },
  selectedTag: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  displayOnlyTag: {
    opacity: 0.8,
  },
  emoji: {
    fontSize: 12,
    marginRight: 4,
  },
  tagText: {
    fontSize: 11,
    color: Colors.textLight,
    fontWeight: '500' as const,
  },
  allergenText: {
    color: Colors.error,
  },
  selectedTagText: {
    color: Colors.white,
  },
});