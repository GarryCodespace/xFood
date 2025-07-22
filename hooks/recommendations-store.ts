import { useState, useEffect, useMemo } from 'react';
import createContextHook from '@nkzw/create-context-hook';
import { PastryPost, User, UserInteraction, SearchFilters } from '@/types';
import { RecommendationEngine } from '@/utils/recommendation-engine';
import { useAuth } from './auth-store';
import { mockPosts } from '@/mocks/posts';
import { mockUsers } from '@/mocks/users';

export const [RecommendationsProvider, useRecommendations] = createContextHook(() => {
  const { currentUser } = useAuth();
  const [userInteractions, setUserInteractions] = useState<UserInteraction[]>([]);
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({});
  const [isRecommendationsEnabled, setIsRecommendationsEnabled] = useState(true);

  // Track user interactions
  const trackInteraction = (interaction: Omit<UserInteraction, 'id' | 'userId' | 'timestamp'>) => {
    if (!currentUser) return;

    const newInteraction: UserInteraction = {
      id: Date.now().toString(),
      userId: currentUser.id,
      timestamp: new Date().toISOString(),
      ...interaction,
    };

    setUserInteractions(prev => [...prev, newInteraction]);
  };

  // Get recommended posts
  const recommendedPosts = useMemo(() => {
    if (!currentUser || !isRecommendationsEnabled) {
      return mockPosts;
    }

    const recommendations = RecommendationEngine.generatePostRecommendations(
      currentUser,
      mockPosts,
      userInteractions
    );

    return recommendations
      .map(rec => {
        const post = mockPosts.find(p => p.id === rec.postId);
        return post ? { ...post, recommendationScore: rec.score, recommendationReasons: rec.reasons } : null;
      })
      .filter(Boolean) as (PastryPost & { recommendationScore: number; recommendationReasons: string[] })[];
  }, [currentUser, userInteractions, isRecommendationsEnabled]);

  // Get recommended bakers
  const recommendedBakers = useMemo(() => {
    if (!currentUser || !isRecommendationsEnabled) {
      return mockUsers.filter(user => user.id !== currentUser?.id);
    }

    const recommendations = RecommendationEngine.generateBakerRecommendations(
      currentUser,
      mockUsers,
      userInteractions
    );

    return recommendations
      .map(rec => {
        const baker = mockUsers.find(u => u.id === rec.bakerId);
        return baker ? { ...baker, recommendationScore: rec.score, recommendationReasons: rec.reasons } : null;
      })
      .filter(Boolean) as (User & { recommendationScore: number; recommendationReasons: string[] })[];
  }, [currentUser, userInteractions, isRecommendationsEnabled]);

  // Get filtered posts
  const filteredPosts = useMemo(() => {
    const postsToFilter = isRecommendationsEnabled ? recommendedPosts : mockPosts;
    
    if (Object.keys(searchFilters).length === 0) {
      return postsToFilter;
    }

    return RecommendationEngine.filterPosts(
      postsToFilter,
      searchFilters,
      currentUser?.coordinates
    );
  }, [recommendedPosts, searchFilters, currentUser, isRecommendationsEnabled]);

  // Get posts for discovery (mix of recommended and popular)
  const discoveryPosts = useMemo(() => {
    if (!currentUser) return mockPosts;

    const recommended = recommendedPosts.slice(0, 10);
    const popular = mockPosts
      .filter(post => !recommended.some(r => r.id === post.id))
      .sort((a, b) => b.likes - a.likes)
      .slice(0, 5);

    return [...recommended, ...popular];
  }, [recommendedPosts, currentUser]);

  // Get posts by category for better organization
  const getPostsByCategory = () => {
    const posts = filteredPosts;
    
    return {
      forYou: posts.slice(0, 8),
      nearby: posts
        .filter(post => {
          if (!currentUser?.coordinates || !post.user?.coordinates) return false;
          const distance = RecommendationEngine['calculateDistance'](
            currentUser.coordinates.latitude,
            currentUser.coordinates.longitude,
            post.user.coordinates.latitude,
            post.user.coordinates.longitude
          );
          return distance <= (currentUser.tasteProfile?.preferredRadius || 25);
        })
        .slice(0, 6),
      trending: posts
        .sort((a, b) => b.likes - a.likes)
        .slice(0, 6),
      fresh: posts
        .sort((a, b) => new Date(b.datePosted).getTime() - new Date(a.datePosted).getTime())
        .slice(0, 6),
    };
  };

  // Ensure we always return a valid object structure
  if (!currentUser) {
    return {
      recommendedPosts: [],
      recommendedBakers: [],
      filteredPosts: mockPosts,
      discoveryPosts: mockPosts,
      userInteractions: [],
      searchFilters: {},
      isRecommendationsEnabled: false,
      trackInteraction: () => {},
      applyFilters: () => {},
      clearFilters: () => {},
      toggleRecommendations: () => {},
      getPostsByCategory: () => ({
        forYou: [],
        nearby: [],
        trending: mockPosts.slice(0, 6),
        fresh: mockPosts.slice(0, 6),
      }),
      hasActiveFilters: false,
    };
  }

  return {
    // Data
    recommendedPosts,
    recommendedBakers,
    filteredPosts,
    discoveryPosts,
    userInteractions,
    searchFilters,
    isRecommendationsEnabled,
    
    // Actions
    trackInteraction,
    applyFilters,
    clearFilters,
    toggleRecommendations,
    getPostsByCategory,
    
    // Utilities
    hasActiveFilters: Object.keys(searchFilters).length > 0,
  };
});