import { PastryPost, User, TasteProfile, UserInteraction, Recommendation } from '@/types';

interface RecommendationScore {
  postId: string;
  score: number;
  reasons: string[];
}

export class RecommendationEngine {
  private static calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  private static getPostFreshness(datePosted: string): number {
    const now = new Date();
    const posted = new Date(datePosted);
    const hoursAgo = (now.getTime() - posted.getTime()) / (1000 * 60 * 60);
    
    // Fresh posts get higher scores
    if (hoursAgo < 24) return 1.0;
    if (hoursAgo < 48) return 0.8;
    if (hoursAgo < 72) return 0.6;
    return 0.4;
  }

  static generatePostRecommendations(
    user: User,
    posts: PastryPost[],
    userInteractions: UserInteraction[] = []
  ): RecommendationScore[] {
    if (!user.tasteProfile || !user.coordinates) {
      return posts.map(post => ({
        postId: post.id,
        score: 0.5,
        reasons: ['Default recommendation']
      }));
    }

    const { tasteProfile, coordinates } = user;
    const userInteractionMap = new Map(
      userInteractions.map(interaction => [interaction.postId || interaction.recipeId, interaction])
    );

    const recommendations: RecommendationScore[] = posts
      .filter(post => post.userId !== user.id) // Don't recommend own posts
      .map(post => {
        let score = 0;
        const reasons: string[] = [];

        // 1. Distance Score (30% weight)
        if (post.user?.coordinates) {
          const distance = this.calculateDistance(
            coordinates.latitude,
            coordinates.longitude,
            post.user.coordinates.latitude,
            post.user.coordinates.longitude
          );

          if (distance <= tasteProfile.preferredRadius) {
            const distanceScore = Math.max(0, 1 - (distance / tasteProfile.preferredRadius));
            score += distanceScore * 0.3;
            reasons.push(`Within ${Math.round(distance)}km of you`);
          }
        }

        // 2. Tag Preferences (25% weight)
        const likedTagMatches = post.tags.filter(tag => 
          tasteProfile.likedTags.includes(tag)
        ).length;
        const dislikedTagMatches = post.tags.filter(tag => 
          tasteProfile.dislikedTags.includes(tag)
        ).length;

        if (likedTagMatches > 0) {
          score += (likedTagMatches / post.tags.length) * 0.25;
          reasons.push(`Matches your taste: ${post.tags.filter(tag => tasteProfile.likedTags.includes(tag)).join(', ')}`);
        }

        if (dislikedTagMatches > 0) {
          score -= (dislikedTagMatches / post.tags.length) * 0.15;
        }

        // 3. Allergen Safety (Critical - can zero out score)
        const hasAllergens = post.allergenTags.some(allergen => 
          tasteProfile.allergens.includes(allergen)
        );
        if (hasAllergens) {
          score = 0;
          reasons.push('Contains allergens you avoid');
          return { postId: post.id, score, reasons };
        }

        // 4. Food Type Preferences (20% weight)
        const foodTypeMatches = tasteProfile.favoriteFoodTypes.some(type =>
          post.tags.some(tag => tag.toLowerCase().includes(type.toLowerCase()))
        );
        if (foodTypeMatches) {
          score += 0.2;
          reasons.push('Matches your favorite food types');
        }

        // 5. Cuisine Preferences (15% weight)
        const cuisineMatches = tasteProfile.preferredCuisines.some(cuisine =>
          post.tags.some(tag => tag.toLowerCase().includes(cuisine.toLowerCase()))
        );
        if (cuisineMatches) {
          score += 0.15;
          reasons.push('Matches your preferred cuisine');
        }

        // 6. Post Freshness (10% weight)
        const freshnessScore = this.getPostFreshness(post.datePosted);
        score += freshnessScore * 0.1;
        if (freshnessScore > 0.8) {
          reasons.push('Fresh bake!');
        }

        // 7. Baker Rating Bonus (5% weight)
        if (post.user && post.user.rating >= 4.5) {
          score += 0.05;
          reasons.push('From a highly rated baker');
        }

        // 8. Social Proof (5% weight)
        if (post.likes > 20) {
          score += 0.05;
          reasons.push('Popular with the community');
        }

        // 9. Previous Interactions Penalty
        const interaction = userInteractionMap.get(post.id);
        if (interaction) {
          if (interaction.type === 'view') {
            score *= 0.8; // Slight penalty for already viewed
          } else if (interaction.type === 'like') {
            score *= 0.6; // More penalty for already liked
          }
        }

        return {
          postId: post.id,
          score: Math.min(1, Math.max(0, score)), // Clamp between 0 and 1
          reasons: reasons.length > 0 ? reasons : ['General recommendation']
        };
      });

    return recommendations.sort((a, b) => b.score - a.score);
  }

  static generateBakerRecommendations(
    user: User,
    bakers: User[],
    userInteractions: UserInteraction[] = []
  ): { bakerId: string; score: number; reasons: string[] }[] {
    if (!user.tasteProfile || !user.coordinates) {
      return bakers.map(baker => ({
        bakerId: baker.id,
        score: 0.5,
        reasons: ['Default recommendation']
      }));
    }

    const { tasteProfile, coordinates } = user;

    return bakers
      .filter(baker => baker.id !== user.id)
      .map(baker => {
        let score = 0;
        const reasons: string[] = [];

        // Distance factor
        if (baker.coordinates) {
          const distance = this.calculateDistance(
            coordinates.latitude,
            coordinates.longitude,
            baker.coordinates.latitude,
            baker.coordinates.longitude
          );

          if (distance <= tasteProfile.preferredRadius) {
            const distanceScore = Math.max(0, 1 - (distance / tasteProfile.preferredRadius));
            score += distanceScore * 0.4;
            reasons.push(`${Math.round(distance)}km away`);
          }
        }

        // Baker rating
        if (baker.rating >= 4.5) {
          score += 0.3;
          reasons.push(`${baker.rating}⭐ rated baker`);
        }

        // Verification bonus
        if (baker.isVerified) {
          score += 0.2;
          reasons.push('Verified baker');
        }

        // Kitchen type preference (could be expanded)
        if (baker.kitchenType === 'Professional') {
          score += 0.1;
          reasons.push('Professional baker');
        }

        return {
          bakerId: baker.id,
          score: Math.min(1, Math.max(0, score)),
          reasons: reasons.length > 0 ? reasons : ['Nearby baker']
        };
      })
      .sort((a, b) => b.score - a.score);
  }

  static filterPosts(
    posts: PastryPost[],
    filters: {
      radius?: number;
      foodTypes?: string[];
      cuisines?: string[];
      allergenTags?: string[];
      specialTags?: string[];
      minRating?: number;
      priceRange?: { min: number; max: number };
    },
    userCoordinates?: { latitude: number; longitude: number }
  ): PastryPost[] {
    return posts.filter(post => {
      // Radius filter
      if (filters.radius && userCoordinates && post.user?.coordinates) {
        const distance = this.calculateDistance(
          userCoordinates.latitude,
          userCoordinates.longitude,
          post.user.coordinates.latitude,
          post.user.coordinates.longitude
        );
        if (distance > filters.radius) return false;
      }

      // Food type filter
      if (filters.foodTypes && filters.foodTypes.length > 0) {
        const hasMatchingFoodType = filters.foodTypes.some(type =>
          post.tags.some(tag => tag.toLowerCase().includes(type.toLowerCase()))
        );
        if (!hasMatchingFoodType) return false;
      }

      // Cuisine filter
      if (filters.cuisines && filters.cuisines.length > 0) {
        const hasMatchingCuisine = filters.cuisines.some(cuisine =>
          post.tags.some(tag => tag.toLowerCase().includes(cuisine.toLowerCase()))
        );
        if (!hasMatchingCuisine) return false;
      }

      // Allergen filter (exclude posts with selected allergens)
      if (filters.allergenTags && filters.allergenTags.length > 0) {
        const hasAllergens = post.allergenTags.some(allergen =>
          filters.allergenTags!.includes(allergen)
        );
        if (hasAllergens) return false;
      }

      // Special tags filter
      if (filters.specialTags && filters.specialTags.length > 0) {
        const hasMatchingSpecialTag = filters.specialTags.some(tag =>
          post.specialTags.includes(tag as any)
        );
        if (!hasMatchingSpecialTag) return false;
      }

      // Rating filter
      if (filters.minRating && post.user && post.user.rating < filters.minRating) {
        return false;
      }

      // Price range filter
      if (filters.priceRange && post.price !== undefined) {
        if (post.price < filters.priceRange.min || post.price > filters.priceRange.max) {
          return false;
        }
      }

      return true;
    });
  }
}