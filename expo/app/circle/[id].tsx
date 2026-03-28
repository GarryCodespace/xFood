import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  Image, 
  FlatList, 
  Pressable,
  ScrollView
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Users, Bell, BellOff } from 'lucide-react-native';
import { mockCircles } from '@/mocks/circles';
import { mockPosts } from '@/mocks/posts';
import { Colors } from '@/constants/colors';
import { PastryCard } from '@/components/PastryCard';
import { TagList } from '@/components/TagList';

export default function CircleDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [joined, setJoined] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [activeTab, setActiveTab] = useState<'posts' | 'about'>('posts');

  const circle = mockCircles.find(c => c.id === id);

  // For demo purposes, just show all posts
  const circlePosts = mockPosts.slice(0, 3);

  if (!circle) {
    return (
      <View style={styles.notFound}>
        <Text style={styles.notFoundText}>Circle not found</Text>
      </View>
    );
  }

  const handleJoin = () => {
    setJoined(!joined);
  };

  const handleNotifications = () => {
    setNotificationsEnabled(!notificationsEnabled);
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Image source={{ uri: circle.image }} style={styles.coverImage} />
        <View style={styles.overlay} />
        
        <View style={styles.headerContent}>
          <Text style={styles.title}>{circle.name}</Text>
          
          <View style={styles.statsContainer}>
            <View style={styles.stat}>
              <Users size={16} color={Colors.white} />
              <Text style={styles.statText}>{circle.memberCount} members</Text>
            </View>
            
            <View style={styles.typeTag}>
              <Text style={styles.typeText}>{circle.type}</Text>
            </View>
          </View>
          
          <View style={styles.actionButtons}>
            <Pressable 
              style={[
                styles.joinButton,
                joined && styles.joinedButton
              ]}
              onPress={handleJoin}
            >
              <Text 
                style={[
                  styles.joinButtonText,
                  joined && styles.joinedButtonText
                ]}
              >
                {joined ? 'Joined' : 'Join Circle'}
              </Text>
            </Pressable>
            
            {joined && (
              <Pressable 
                style={styles.notificationButton}
                onPress={handleNotifications}
              >
                {notificationsEnabled ? (
                  <Bell size={20} color={Colors.primary} />
                ) : (
                  <BellOff size={20} color={Colors.textLight} />
                )}
              </Pressable>
            )}
          </View>
        </View>
        
        <View style={styles.tabContainer}>
          <Pressable
            style={[
              styles.tab,
              activeTab === 'posts' && styles.activeTab
            ]}
            onPress={() => setActiveTab('posts')}
          >
            <Text 
              style={[
                styles.tabText,
                activeTab === 'posts' && styles.activeTabText
              ]}
            >
              Posts
            </Text>
          </Pressable>
          <Pressable
            style={[
              styles.tab,
              activeTab === 'about' && styles.activeTab
            ]}
            onPress={() => setActiveTab('about')}
          >
            <Text 
              style={[
                styles.tabText,
                activeTab === 'about' && styles.activeTabText
              ]}
            >
              About
            </Text>
          </Pressable>
        </View>
        
        {activeTab === 'posts' ? (
          <View style={styles.postsContainer}>
            {circlePosts.map(post => (
              <PastryCard key={post.id} post={post} />
            ))}
            
            {circlePosts.length === 0 && (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No posts in this circle yet</Text>
              </View>
            )}
          </View>
        ) : (
          <View style={styles.aboutContainer}>
            <Text style={styles.description}>{circle.description}</Text>
            
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Tags</Text>
              <TagList tags={circle.tags} scrollable={false} />
            </View>
            
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Rules</Text>
              <Text style={styles.rule}>1. Be kind and respectful to other members</Text>
              <Text style={styles.rule}>2. Share your baking experiences and recipes</Text>
              <Text style={styles.rule}>3. No spam or promotional content without approval</Text>
              <Text style={styles.rule}>4. Credit original sources when sharing recipes</Text>
            </View>
          </View>
        )}
      </ScrollView>
      
      {joined && activeTab === 'posts' && (
        <View style={styles.createPostContainer}>
          <Pressable style={styles.createPostButton}>
            <Text style={styles.createPostText}>Share in {circle.name}</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
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
  coverImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    height: 200,
  },
  headerContent: {
    padding: 16,
    marginTop: -60,
  },
  title: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: Colors.white,
    marginBottom: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  statText: {
    fontSize: 14,
    color: Colors.white,
    marginLeft: 4,
  },
  typeTag: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  typeText: {
    color: Colors.white,
    fontWeight: '500' as const,
    fontSize: 12,
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  joinButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
  },
  joinedButton: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  joinButtonText: {
    color: Colors.white,
    fontWeight: '600' as const,
    fontSize: 14,
  },
  joinedButtonText: {
    color: Colors.primary,
  },
  notificationButton: {
    backgroundColor: Colors.white,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray,
  },
  tab: {
    paddingVertical: 12,
    marginRight: 24,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: Colors.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.textLight,
  },
  activeTabText: {
    color: Colors.primary,
  },
  postsContainer: {
    padding: 16,
    paddingBottom: 80, // Extra space for the create post button
  },
  emptyContainer: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
    borderRadius: 16,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.textLight,
    textAlign: 'center',
  },
  aboutContainer: {
    padding: 16,
  },
  description: {
    fontSize: 16,
    color: Colors.text,
    lineHeight: 24,
    marginBottom: 24,
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
  rule: {
    fontSize: 14,
    color: Colors.text,
    marginBottom: 8,
    lineHeight: 20,
  },
  createPostContainer: {
    position: 'absolute',
    bottom: 24,
    left: 16,
    right: 16,
  },
  createPostButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  createPostText: {
    color: Colors.white,
    fontWeight: '600' as const,
    fontSize: 14,
  },
});