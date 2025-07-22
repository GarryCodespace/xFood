import React from 'react';
import { StyleSheet, View, Text, Image, Pressable } from 'react-native';
import { Heart, Bookmark, Clock, Users, Star, DollarSign, Crown } from 'lucide-react-native';
import { Recipe } from '@/types';
import { Colors } from '@/constants/colors';
import { useRouter } from 'expo-router';

interface RecipeCardProps {
  recipe: Recipe;
  onBookmark?: (recipeId: string) => void;
  isBookmarked?: boolean;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({ 
  recipe, 
  onBookmark,
  isBookmarked = false 
}) => {
  const router = useRouter();

  const handlePress = () => {
    router.push(`/recipe/${recipe.id}`);
  };

  const handleBookmark = (e: any) => {
    e.stopPropagation();
    onBookmark?.(recipe.id);
  };

  const getDifficultyColor = () => {
    switch (recipe.difficulty) {
      case 'Easy': return Colors.success;
      case 'Medium': return Colors.primary;
      case 'Hard': return Colors.error;
      default: return Colors.textLight;
    }
  };

  return (
    <Pressable style={styles.container} onPress={handlePress}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: recipe.coverImage }} style={styles.image} />
        
        {recipe.isPremium && (
          <View style={styles.premiumBadge}>
            <Crown size={12} color={Colors.white} />
            <Text style={styles.premiumText}>Premium</Text>
          </View>
        )}
        
        <View style={styles.difficultyBadge}>
          <Text style={[styles.difficultyText, { color: getDifficultyColor() }]}>
            {recipe.difficulty}
          </Text>
        </View>
        
        <Pressable style={styles.bookmarkButton} onPress={handleBookmark}>
          <Bookmark 
            size={20} 
            color={isBookmarked ? Colors.primary : Colors.white}
            fill={isBookmarked ? Colors.primary : 'transparent'}
          />
        </Pressable>
      </View>
      
      <View style={styles.content}>
        <View style={styles.titleRow}>
          <Text style={styles.title} numberOfLines={1}>{recipe.title}</Text>
          {recipe.isPremium && recipe.price && (
            <View style={styles.priceTag}>
              <DollarSign size={12} color={Colors.white} />
              <Text style={styles.priceText}>{recipe.price.toFixed(2)}</Text>
            </View>
          )}
        </View>
        
        <Text style={styles.description} numberOfLines={2}>
          {recipe.description}
        </Text>
        
        <View style={styles.authorRow}>
          <Image source={{ uri: recipe.user?.avatar }} style={styles.avatar} />
          <Text style={styles.authorName}>{recipe.user?.name}</Text>
        </View>
        
        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Clock size={14} color={Colors.textLight} />
            <Text style={styles.metaText}>
              {recipe.prepTime + recipe.cookTime}m
            </Text>
          </View>
          
          <View style={styles.metaItem}>
            <Users size={14} color={Colors.textLight} />
            <Text style={styles.metaText}>{recipe.servings}</Text>
          </View>
          
          <View style={styles.metaItem}>
            <Star size={14} color={Colors.primary} fill={Colors.primary} />
            <Text style={styles.metaText}>{recipe.rating.toFixed(1)}</Text>
          </View>
        </View>
        
        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Heart size={14} color={Colors.textLight} />
            <Text style={styles.statText}>{recipe.likes}</Text>
          </View>
          
          <View style={styles.stat}>
            <Bookmark size={14} color={Colors.textLight} />
            <Text style={styles.statText}>{recipe.bookmarks}</Text>
          </View>
          
          {recipe.isPremium && (
            <View style={styles.stat}>
              <Text style={styles.purchaseText}>{recipe.purchases} purchases</Text>
            </View>
          )}
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  premiumBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  premiumText: {
    color: Colors.white,
    fontSize: 10,
    fontWeight: '600' as const,
    marginLeft: 2,
  },
  difficultyBadge: {
    position: 'absolute',
    top: 12,
    right: 52,
    backgroundColor: Colors.white,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 1,
  },
  difficultyText: {
    fontSize: 10,
    fontWeight: '600' as const,
  },
  bookmarkButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 16,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.text,
    flex: 1,
  },
  priceTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.success,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    marginLeft: 8,
  },
  priceText: {
    color: Colors.white,
    fontWeight: '600' as const,
    fontSize: 10,
    marginLeft: 2,
  },
  description: {
    fontSize: 14,
    color: Colors.textLight,
    marginBottom: 12,
    lineHeight: 20,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 8,
  },
  authorName: {
    fontSize: 14,
    fontWeight: '500' as const,
    color: Colors.text,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  metaText: {
    fontSize: 12,
    color: Colors.textLight,
    marginLeft: 4,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    fontSize: 12,
    color: Colors.textLight,
    marginLeft: 4,
  },
  purchaseText: {
    fontSize: 12,
    color: Colors.success,
    fontWeight: '500' as const,
  },
});