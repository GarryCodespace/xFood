import React from 'react';
import { StyleSheet, View, Text, FlatList, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { ProfileHeader } from '@/components/ProfileHeader';
import { PastryCard } from '@/components/PastryCard';
import { RecipeCard } from '@/components/RecipeCard';
import { PaymentSetup } from '@/components/PaymentSetup';
import { mockPosts } from '@/mocks/posts';
import { mockRecipes } from '@/mocks/recipes';
import { Colors } from '@/constants/colors';
import { LogOut, Shield, Settings, DollarSign, TrendingUp } from 'lucide-react-native';
import { useAuth } from '@/hooks/auth-store';

export default function ProfileScreen() {
  const { currentUser, logout } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = React.useState<'posts' | 'recipes'>('posts');

  // Filter posts and recipes to only show the current user's content
  const userPosts = mockPosts.filter(post => 
    currentUser && post.userId === currentUser.id
  );

  const userRecipes = mockRecipes.filter(recipe => 
    currentUser && recipe.userId === currentUser.id
  );

  const handleLogout = async () => {
    await logout();
    router.replace('/login');
  };

  const handleEditProfile = () => {
    // In a real app, this would navigate to an edit profile screen
    console.log('Edit profile');
  };

  const handleMessage = () => {
    router.push('/messages');
  };

  const handleVerification = () => {
    router.push('/verification');
  };

  const handleReport = (postId: string) => {
    router.push(`/report?postId=${postId}`);
  };

  const handleEarnings = () => {
    router.push('/earnings');
  };

  const renderContent = () => {
    if (activeTab === 'posts') {
      return (
        <FlatList
          data={userPosts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <PastryCard post={item} onReport={handleReport} />
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>You haven't shared any bakes yet</Text>
              <Pressable 
                style={styles.createButton}
                onPress={() => router.push('/create-post')}
              >
                <Text style={styles.createButtonText}>Share Your First Bake</Text>
              </Pressable>
            </View>
          }
        />
      );
    } else {
      return (
        <FlatList
          data={userRecipes}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <RecipeCard recipe={item} />}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>You haven't created any recipes yet</Text>
              <Pressable 
                style={styles.createButton}
                onPress={() => router.push('/create-recipe')}
              >
                <Text style={styles.createButtonText}>Create Your First Recipe</Text>
              </Pressable>
            </View>
          }
        />
      );
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={[]}
        keyExtractor={() => 'profile'}
        renderItem={() => null}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <>
            {currentUser && (
              <ProfileHeader 
                user={currentUser} 
                isCurrentUser={true}
                onEditProfile={handleEditProfile}
                onMessage={handleMessage}
              />
            )}
            
            <View style={styles.actionsContainer}>
              {!currentUser?.isVerified && (
                <Pressable style={styles.actionButton} onPress={handleVerification}>
                  <Shield size={20} color={Colors.primary} />
                  <Text style={styles.actionButtonText}>Get Verified</Text>
                </Pressable>
              )}
              
              <Pressable style={styles.actionButton} onPress={handleEarnings}>
                <DollarSign size={20} color={Colors.success} />
                <Text style={styles.actionButtonText}>Earnings</Text>
              </Pressable>
              
              <Pressable style={styles.actionButton}>
                <Settings size={20} color={Colors.textLight} />
                <Text style={styles.actionButtonText}>Settings</Text>
              </Pressable>
            </View>

            {/* Payment Setup Component */}
            {!currentUser?.stripeAccountId && (
              <PaymentSetup onSetupComplete={() => console.log('Payment setup complete')} />
            )}

            {/* Earnings Summary */}
            {currentUser?.stripeAccountId && (
              <View style={styles.earningsCard}>
                <View style={styles.earningsHeader}>
                  <TrendingUp size={20} color={Colors.success} />
                  <Text style={styles.earningsTitle}>Your Earnings</Text>
                </View>
                <View style={styles.earningsStats}>
                  <View style={styles.earningStat}>
                    <Text style={styles.earningValue}>
                      ${currentUser.totalEarnings?.toFixed(2) || '0.00'}
                    </Text>
                    <Text style={styles.earningLabel}>Total Earned</Text>
                  </View>
                  <View style={styles.earningStat}>
                    <Text style={styles.earningValue}>
                      {currentUser.totalSales || 0}
                    </Text>
                    <Text style={styles.earningLabel}>Total Sales</Text>
                  </View>
                </View>
              </View>
            )}
            
            <View style={styles.tabContainer}>
              <Pressable
                style={[
                  styles.tab,
                  activeTab === 'posts' && styles.activeTab
                ]}
                onPress={() => setActiveTab('posts')}
              >
                <Text style={[
                  styles.tabText,
                  activeTab === 'posts' && styles.activeTabText
                ]}>
                  My Bakes ({userPosts.length})
                </Text>
              </Pressable>
              <Pressable
                style={[
                  styles.tab,
                  activeTab === 'recipes' && styles.activeTab
                ]}
                onPress={() => setActiveTab('recipes')}
              >
                <Text style={[
                  styles.tabText,
                  activeTab === 'recipes' && styles.activeTabText
                ]}>
                  My Recipes ({userRecipes.length})
                </Text>
              </Pressable>
            </View>
          </>
        }
      />
      
      {renderContent()}
      
      <Pressable style={styles.logoutButton} onPress={handleLogout}>
        <LogOut size={16} color={Colors.textLight} />
        <Text style={styles.logoutText}>Logout</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  listContent: {
    padding: 16,
    paddingBottom: 80, // Extra space for the logout button
  },
  actionsContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    flex: 1,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.text,
    marginLeft: 8,
  },
  earningsCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  earningsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  earningsTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.text,
    marginLeft: 8,
  },
  earningsStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  earningStat: {
    alignItems: 'center',
  },
  earningValue: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.success,
  },
  earningLabel: {
    fontSize: 12,
    color: Colors.textLight,
    marginTop: 4,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: Colors.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.textLight,
  },
  activeTabText: {
    color: Colors.white,
  },
  emptyContainer: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
    borderRadius: 16,
    margin: 16,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.textLight,
    textAlign: 'center',
    marginBottom: 16,
  },
  createButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  createButtonText: {
    color: Colors.white,
    fontWeight: '600' as const,
    fontSize: 14,
  },
  logoutButton: {
    position: 'absolute',
    bottom: 24,
    left: 16,
    right: 16,
    backgroundColor: Colors.white,
    paddingVertical: 12,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  logoutText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.textLight,
  },
});