import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  Image, 
  ScrollView, 
  Pressable,
  Alert
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { 
  Heart, 
  Bookmark, 
  Share2, 
  Clock, 
  Users, 
  Star, 
  DollarSign, 
  Crown,
  Lock,
  CheckCircle
} from 'lucide-react-native';
import { mockRecipes } from '@/mocks/recipes';
import { Colors } from '@/constants/colors';
import { AllergenTagList } from '@/components/AllergenTagList';

export default function RecipeDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [isPurchased, setIsPurchased] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const recipe = mockRecipes.find(r => r.id === id);

  if (!recipe) {
    return (
      <View style={styles.notFound}>
        <Text style={styles.notFoundText}>Recipe not found</Text>
      </View>
    );
  }

  const handleLike = () => {
    setLiked(!liked);
  };

  const handleBookmark = () => {
    setBookmarked(!bookmarked);
  };

  const handleShare = () => {
    // In a real app, this would open the share dialog
    console.log('Sharing recipe:', recipe.id);
  };

  const handlePurchase = async () => {
    if (!recipe.isPremium || isPurchased) return;

    Alert.alert(
      'Purchase Recipe',
      `Purchase "${recipe.title}" for $${recipe.price?.toFixed(2)}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Purchase', 
          onPress: async () => {
            setIsLoading(true);
            // Simulate payment processing
            setTimeout(() => {
              setIsLoading(false);
              setIsPurchased(true);
              Alert.alert('Success!', 'Recipe purchased successfully!');
            }, 2000);
          }
        }
      ]
    );
  };

  const getDifficultyColor = () => {
    switch (recipe.difficulty) {
      case 'Easy': return Colors.success;
      case 'Medium': return Colors.primary;
      case 'Hard': return Colors.error;
      default: return Colors.textLight;
    }
  };

  const canViewFullRecipe = !recipe.isPremium || isPurchased;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: recipe.coverImage }} style={styles.coverImage} />
        
        {recipe.isPremium && (
          <View style={styles.premiumBadge}>
            <Crown size={16} color={Colors.white} />
            <Text style={styles.premiumText}>Premium Recipe</Text>
          </View>
        )}
        
        <View style={styles.difficultyBadge}>
          <Text style={[styles.difficultyText, { color: getDifficultyColor() }]}>
            {recipe.difficulty}
          </Text>
        </View>
      </View>
      
      <View style={styles.content}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>{recipe.title}</Text>
          {recipe.isPremium && recipe.price && (
            <View style={styles.priceTag}>
              <DollarSign size={16} color={Colors.white} />
              <Text style={styles.priceText}>${recipe.price.toFixed(2)}</Text>
            </View>
          )}
        </View>
        
        <Text style={styles.description}>{recipe.description}</Text>
        
        <View style={styles.authorRow}>
          <Image source={{ uri: recipe.user?.avatar }} style={styles.avatar} />
          <View style={styles.authorInfo}>
            <Text style={styles.authorName}>{recipe.user?.name}</Text>
            <Text style={styles.authorType}>{recipe.user?.kitchenType}</Text>
          </View>
        </View>
        
        <View style={styles.metaContainer}>
          <View style={styles.metaItem}>
            <Clock size={16} color={Colors.textLight} />
            <Text style={styles.metaText}>
              {recipe.prepTime + recipe.cookTime} min total
            </Text>
          </View>
          
          <View style={styles.metaItem}>
            <Users size={16} color={Colors.textLight} />
            <Text style={styles.metaText}>Serves {recipe.servings}</Text>
          </View>
          
          <View style={styles.metaItem}>
            <Star size={16} color={Colors.primary} fill={Colors.primary} />
            <Text style={styles.metaText}>
              {recipe.rating.toFixed(1)} ({recipe.reviewCount} reviews)
            </Text>
          </View>
        </View>
        
        <View style={styles.actionsContainer}>
          <Pressable style={styles.actionButton} onPress={handleLike}>
            <Heart 
              size={24} 
              color={liked ? Colors.error : Colors.textLight}
              fill={liked ? Colors.error : 'transparent'}
            />
            <Text style={styles.actionText}>
              {liked ? recipe.likes + 1 : recipe.likes}
            </Text>
          </Pressable>
          
          <Pressable style={styles.actionButton} onPress={handleBookmark}>
            <Bookmark 
              size={24} 
              color={bookmarked ? Colors.primary : Colors.textLight}
              fill={bookmarked ? Colors.primary : 'transparent'}
            />
            <Text style={styles.actionText}>
              {bookmarked ? recipe.bookmarks + 1 : recipe.bookmarks}
            </Text>
          </Pressable>
          
          <Pressable style={styles.actionButton} onPress={handleShare}>
            <Share2 size={24} color={Colors.textLight} />
            <Text style={styles.actionText}>Share</Text>
          </Pressable>
        </View>
        
        {recipe.isPremium && !isPurchased && (
          <View style={styles.purchaseContainer}>
            <View style={styles.purchaseInfo}>
              <Lock size={20} color={Colors.primary} />
              <Text style={styles.purchaseText}>
                This is a premium recipe. Purchase to unlock the full ingredients list and instructions.
              </Text>
            </View>
            <Pressable 
              style={[styles.purchaseButton, isLoading && styles.purchaseButtonLoading]}
              onPress={handlePurchase}
              disabled={isLoading}
            >
              <Text style={styles.purchaseButtonText}>
                {isLoading ? 'Processing...' : `Purchase for $${recipe.price?.toFixed(2)}`}
              </Text>
            </Pressable>
          </View>
        )}
        
        {isPurchased && (
          <View style={styles.purchasedBanner}>
            <CheckCircle size={20} color={Colors.success} />
            <Text style={styles.purchasedText}>Recipe purchased! Enjoy cooking!</Text>
          </View>
        )}
        
        <AllergenTagList
          allergenTags={recipe.allergenTags}
          specialTags={recipe.specialTags}
          editable={false}
        />
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ingredients</Text>
          {canViewFullRecipe ? (
            recipe.ingredients.map((ingredient, index) => (
              <View key={ingredient.id} style={styles.ingredientRow}>
                <Text style={styles.ingredientAmount}>
                  {ingredient.amount} {ingredient.unit}
                </Text>
                <Text style={styles.ingredientName}>{ingredient.name}</Text>
                {ingredient.notes && (
                  <Text style={styles.ingredientNotes}>({ingredient.notes})</Text>
                )}
              </View>
            ))
          ) : (
            <View style={styles.lockedContent}>
              <Lock size={16} color={Colors.textLight} />
              <Text style={styles.lockedText}>
                Ingredients list available after purchase
              </Text>
            </View>
          )}
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Instructions</Text>
          {canViewFullRecipe ? (
            recipe.steps.map((step) => (
              <View key={step.id} style={styles.stepContainer}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>{step.stepNumber}</Text>
                </View>
                <View style={styles.stepContent}>
                  <Text style={styles.stepInstruction}>{step.instruction}</Text>
                  {step.duration && step.duration > 0 && (
                    <View style={styles.stepDuration}>
                      <Clock size={12} color={Colors.textLight} />
                      <Text style={styles.stepDurationText}>{step.duration} min</Text>
                    </View>
                  )}
                  {step.image && (
                    <Image source={{ uri: step.image }} style={styles.stepImage} />
                  )}
                </View>
              </View>
            ))
          ) : (
            <View style={styles.lockedContent}>
              <Lock size={16} color={Colors.textLight} />
              <Text style={styles.lockedText}>
                Step-by-step instructions available after purchase
              </Text>
            </View>
          )}
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tags</Text>
          <View style={styles.tagsContainer}>
            {recipe.tags.map((tag) => (
              <View key={tag} style={styles.tag}>
                <Text style={styles.tagText}>#{tag}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  notFound: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  notFoundText: {
    fontSize: 16,
    color: Colors.textLight,
    textAlign: 'center',
  },
  imageContainer: {
    position: 'relative',
  },
  coverImage: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
  },
  premiumBadge: {
    position: 'absolute',
    top: 16,
    left: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  premiumText: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: '600' as const,
    marginLeft: 4,
  },
  difficultyBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: Colors.white,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: '600' as const,
  },
  content: {
    padding: 16,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: Colors.text,
    flex: 1,
    marginRight: 12,
  },
  priceTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.success,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  priceText: {
    color: Colors.white,
    fontWeight: '700' as const,
    fontSize: 14,
    marginLeft: 2,
  },
  description: {
    fontSize: 16,
    color: Colors.text,
    lineHeight: 24,
    marginBottom: 16,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  authorInfo: {
    flex: 1,
  },
  authorName: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  authorType: {
    fontSize: 12,
    color: Colors.textLight,
  },
  metaContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
    marginBottom: 8,
  },
  metaText: {
    fontSize: 14,
    color: Colors.textLight,
    marginLeft: 4,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: Colors.gray,
    marginBottom: 24,
  },
  actionButton: {
    alignItems: 'center',
  },
  actionText: {
    fontSize: 12,
    color: Colors.textLight,
    marginTop: 4,
  },
  purchaseContainer: {
    backgroundColor: Colors.secondary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  purchaseInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  purchaseText: {
    fontSize: 14,
    color: Colors.text,
    marginLeft: 8,
    flex: 1,
    lineHeight: 20,
  },
  purchaseButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  purchaseButtonLoading: {
    opacity: 0.7,
  },
  purchaseButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600' as const,
  },
  purchasedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.lightGray,
    padding: 12,
    borderRadius: 8,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: Colors.success,
  },
  purchasedText: {
    fontSize: 14,
    color: Colors.success,
    fontWeight: '600' as const,
    marginLeft: 8,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 12,
  },
  ingredientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  ingredientAmount: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.primary,
    minWidth: 80,
  },
  ingredientName: {
    fontSize: 14,
    color: Colors.text,
    flex: 1,
  },
  ingredientNotes: {
    fontSize: 12,
    color: Colors.textLight,
    fontStyle: 'italic',
  },
  lockedContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: Colors.lightGray,
    borderRadius: 8,
  },
  lockedText: {
    fontSize: 14,
    color: Colors.textLight,
    marginLeft: 8,
  },
  stepContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 4,
  },
  stepNumberText: {
    color: Colors.white,
    fontWeight: '600' as const,
    fontSize: 14,
  },
  stepContent: {
    flex: 1,
  },
  stepInstruction: {
    fontSize: 14,
    color: Colors.text,
    lineHeight: 20,
    marginBottom: 8,
  },
  stepDuration: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  stepDurationText: {
    fontSize: 12,
    color: Colors.textLight,
    marginLeft: 4,
  },
  stepImage: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    resizeMode: 'cover',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: Colors.lightGray,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 12,
    color: Colors.textLight,
    fontWeight: '500' as const,
  },
});