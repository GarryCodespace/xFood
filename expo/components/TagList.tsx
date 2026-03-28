import React from 'react';
import { StyleSheet, View, Text, ScrollView, Pressable } from 'react-native';
import { Colors } from '@/constants/colors';

interface TagListProps {
  tags: string[];
  selectedTags?: string[];
  onSelectTag?: (tag: string) => void;
  scrollable?: boolean;
}

export const TagList: React.FC<TagListProps> = ({ 
  tags, 
  selectedTags = [], 
  onSelectTag,
  scrollable = true
}) => {
  const TagContainer = scrollable ? ScrollView : View;
  const containerProps = scrollable ? {
    horizontal: true,
    showsHorizontalScrollIndicator: false,
    contentContainerStyle: styles.scrollContainer,
  } : {
    style: styles.flexContainer,
  };

  return (
    <TagContainer {...containerProps}>
      {tags.map((tag) => {
        const isSelected = selectedTags.includes(tag);
        return (
          <Pressable
            key={tag}
            style={[
              styles.tag,
              isSelected && styles.selectedTag
            ]}
            onPress={() => onSelectTag && onSelectTag(tag)}
          >
            <Text 
              style={[
                styles.tagText,
                isSelected && styles.selectedTagText
              ]}
            >
              #{tag}
            </Text>
          </Pressable>
        );
      })}
    </TagContainer>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  flexContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
  },
  tag: {
    backgroundColor: Colors.lightGray,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  selectedTag: {
    backgroundColor: Colors.primary,
  },
  tagText: {
    fontSize: 12,
    color: Colors.textLight,
    fontWeight: '500' as const,
  },
  selectedTagText: {
    color: Colors.white,
  },
});