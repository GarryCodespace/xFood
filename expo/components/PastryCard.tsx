import React from 'react';
import { StyleSheet, View, Text, Image, Pressable } from 'react-native';
import { Heart, MessageCircle, MapPin, Flag, ShoppingCart, Truck, Mail } from 'lucide-react-native';
import { PastryPost } from '@/types';
import { Colors } from '@/constants/colors';
import { useRouter } from 'expo-router';
import { VerificationBadge } from './VerificationBadge';
import { AllergenTagList } from './AllergenTagList';

interface PastryCardProps {
  post: PastryPost;
  onPress?: () => void;
  onReport?: (postId: string) => void;
  onPurchase?: (postId: string) => void;
  onContact?: (userId: string) => void;
}

export const PastryCard: React.FC<PastryCardProps> = ({ post, onPress, onReport, onPurchase, onContact }) => {
  const router = useRouter();

  const handlePress = () => {
    if (onPress) {
      onPress();
    }
    router.push(`/post/${post.id}`);
  };

  const handleReport = () => {
    onReport?.(post.id);
  };

  const handlePurchase = (e: any) => {
    e.stopPropagation();
    onPurchase?.(post.id);
  };

  const handleContact = (e: any) => {
    e.stopPropagation();
    try {
      if (post.user?.id) {
        console.log('PastryCard: Contacting user:', post.user.id, post.user.name);
        if (onContact) {
          onContact(post.user.id);
        } else {
          // Navigate to messages with the user ID
          console.log('PastryCard: Navigating to messages with userId:', post.user.id);
          router.push(`/(tabs)/messages?userId=${post.user.id}`);
        }
      } else {
        console.error('PastryCard: No user ID found for post:', post.id);
      }
    } catch (error) {
      console.error('PastryCard: Error handling contact:', error);
    }
  };

  const getLocationDisplay = () => {
    if (post.user?.locationPrivacy === 'hidden') return 'Location hidden';
    if (post.user?.locationPrivacy === 'city') return post.location.split(',')[0];
    return post.location;
  };

  const getTotalPrice = () => {
    if (!post.price) return null;
    const basePrice = post.price;
    const platformFee = post.platformFee || (basePrice * 0.08); // 8% platform fee
    // No delivery fee since pickup only
    return basePrice + platformFee;
  };

  return (
    <Pressable style={styles.container} onPress={handlePress}>
      <Image source={{ uri: post.image }} style={styles.image} />
      <View style={styles.content}>
        <View style={styles.titleRow}>
          <Text style={styles.title} numberOfLines={1}>{post.title}</Text>
          <Pressable style={styles.reportButton} onPress={handleReport}>
            <Flag size={16} color={Colors.textLight} />
          </Pressable>
        </View>
        
        <Text style={styles.description} numberOfLines={2}>{post.description}</Text>
        
        <View style={styles.userRow}>
          <Image source={{ uri: post.user?.avatar }} style={styles.avatar} />
          <Text style={styles.username}>{post.user?.name}</Text>
          <VerificationBadge 
            isVerified={post.user?.isVerified} 
            verificationMethod={post.user?.verificationMethod}
          />
        </View>
        
        <AllergenTagList 
          allergenTags={post.allergenTags || []}
          specialTags={post.specialTags || []}
        />
        
        <View style={styles.footer}>
          <View style={styles.locationContainer}>
            <MapPin size={14} color={Colors.textLight} />
            <Text style={styles.location} numberOfLines={1}>{getLocationDisplay()}</Text>
          </View>
          
          <View style={styles.statsContainer}>
            <View style={styles.stat}>
              <Heart size={14} color={Colors.textLight} />
              <Text style={styles.statText}>{post.likes}</Text>
            </View>
            <View style={styles.stat}>
              <MessageCircle size={14} color={Colors.textLight} />
              <Text style={styles.statText}>{post.comments}</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.actionRow}>
          <Pressable style={styles.contactButton} onPress={handleContact}>
            <Mail size={16} color={Colors.primary} />
            <Text style={styles.contactButtonText}>Contact Baker</Text>
          </Pressable>
        </View>
        
        {post.price !== undefined && (
          <View style={styles.priceContainer}>
            <View style={styles.priceInfo}>
              <Text style={styles.basePrice}>${post.price.toFixed(2)}</Text>
              {post.isForSale && getTotalPrice() && (
                <Text style={styles.totalPrice}>
                  Total: ${getTotalPrice()?.toFixed(2)}
                </Text>
              )}
            </View>
            
            {post.isForSale && post.status === 'available' && (
              <Pressable style={styles.buyButton} onPress={handlePurchase}>
                <ShoppingCart size={16} color={Colors.white} />
                <Text style={styles.buyButtonText}>Buy Now</Text>
              </Pressable>
            )}
          </View>
        )}
        
        <View style={styles.deliveryBadge}>
          <Truck size={12} color={Colors.textLight} />
          <Text style={styles.deliveryText}>
            Pickup Only
          </Text>
        </View>

        {post.status && post.status !== 'available' && (
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>
              {post.status === 'sold' ? 'SOLD' : 'RESERVED'}
            </Text>
          </View>
        )}
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
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
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
  reportButton: {
    padding: 4,
    marginLeft: 8,
  },
  description: {
    fontSize: 14,
    color: Colors.textLight,
    marginBottom: 12,
    lineHeight: 20,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  avatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 8,
  },
  username: {
    fontSize: 14,
    fontWeight: '500' as const,
    color: Colors.text,
    marginRight: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 12,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    maxWidth: '60%',
  },
  location: {
    fontSize: 12,
    color: Colors.textLight,
    marginLeft: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
  },
  statText: {
    fontSize: 12,
    color: Colors.textLight,
    marginLeft: 4,
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.lightGray,
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  priceInfo: {
    flex: 1,
  },
  basePrice: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  totalPrice: {
    fontSize: 12,
    color: Colors.textLight,
    marginTop: 2,
  },
  buyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  buyButtonText: {
    color: Colors.white,
    fontWeight: '600' as const,
    fontSize: 14,
    marginLeft: 4,
  },
  deliveryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: Colors.white,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.gray,
  },
  deliveryText: {
    fontWeight: '500' as const,
    fontSize: 12,
    marginLeft: 4,
  },
  statusBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: Colors.error,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: Colors.white,
    fontWeight: '700' as const,
    fontSize: 12,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  contactButtonText: {
    color: Colors.primary,
    fontWeight: '600' as const,
    fontSize: 14,
    marginLeft: 6,
  },
});