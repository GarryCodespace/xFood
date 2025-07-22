import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  Image, 
  ScrollView, 
  Pressable,
  TextInput,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Heart, MessageCircle, Share2, MapPin, DollarSign, Mail } from 'lucide-react-native';
import { mockPosts } from '@/mocks/posts';
import { Colors } from '@/constants/colors';
import { TagList } from '@/components/TagList';

export default function PostDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [liked, setLiked] = useState(false);
  const [comment, setComment] = useState('');
  const router = useRouter();

  const post = mockPosts.find(p => p.id === id);

  if (!post) {
    return (
      <View style={styles.notFound}>
        <Text style={styles.notFoundText}>Post not found</Text>
      </View>
    );
  }

  const handleLike = () => {
    setLiked(!liked);
  };

  const handleSendComment = () => {
    if (comment.trim()) {
      // In a real app, this would send the comment to the backend
      console.log('Sending comment:', comment);
      setComment('');
    }
  };

  const handleShare = () => {
    // In a real app, this would open the share dialog
    console.log('Sharing post:', post.id);
  };

  const handleContactBaker = () => {
    if (post.user?.id) {
      router.push(`/(tabs)/messages?userId=${post.user.id}`);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
    >
      <ScrollView style={styles.scrollView}>
        <Image source={{ uri: post.image }} style={styles.image} />
        
        <View style={styles.content}>
          <Text style={styles.title}>{post.title}</Text>
          
          <View style={styles.userRow}>
            <Image source={{ uri: post.user?.avatar }} style={styles.avatar} />
            <Text style={styles.username}>{post.user?.name}</Text>
          </View>
          
          <Text style={styles.description}>{post.description}</Text>
          
          <View style={styles.infoContainer}>
            <View style={styles.infoItem}>
              <MapPin size={16} color={Colors.textLight} />
              <Text style={styles.infoText}>{post.location}</Text>
            </View>
            
            {post.price !== undefined && (
              <View style={styles.infoItem}>
                <DollarSign size={16} color={Colors.textLight} />
                <Text style={styles.infoText}>${post.price.toFixed(2)}</Text>
              </View>
            )}
            
            <View style={styles.deliveryBadge}>
              <Text style={styles.deliveryText}>
                🏠 Pickup Only
              </Text>
            </View>
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ingredients</Text>
            {post.ingredients.map((ingredient, index) => (
              <Text key={index} style={styles.ingredient}>• {ingredient}</Text>
            ))}
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Tags</Text>
            <TagList tags={post.tags} scrollable={false} />
          </View>
          
          <View style={styles.contactBakerContainer}>
            <Pressable style={styles.contactBakerButton} onPress={handleContactBaker}>
              <Mail size={20} color={Colors.white} />
              <Text style={styles.contactBakerText}>Contact Baker</Text>
            </Pressable>
          </View>
          
          <View style={styles.actionsContainer}>
            <Pressable style={styles.actionButton} onPress={handleLike}>
              <Heart 
                size={24} 
                color={liked ? Colors.error : Colors.textLight}
                fill={liked ? Colors.error : 'transparent'}
              />
              <Text style={styles.actionText}>
                {liked ? post.likes + 1 : post.likes} Likes
              </Text>
            </Pressable>
            
            <Pressable style={styles.actionButton}>
              <MessageCircle size={24} color={Colors.textLight} />
              <Text style={styles.actionText}>{post.comments} Comments</Text>
            </Pressable>
            
            <Pressable style={styles.actionButton} onPress={handleShare}>
              <Share2 size={24} color={Colors.textLight} />
              <Text style={styles.actionText}>Share</Text>
            </Pressable>
          </View>
          
          <View style={styles.commentsSection}>
            <Text style={styles.sectionTitle}>Comments</Text>
            <Text style={styles.commentText}>Be the first to comment!</Text>
          </View>
        </View>
      </ScrollView>
      
      <View style={styles.commentInputContainer}>
        <TextInput
          style={styles.commentInput}
          placeholder="Add a comment..."
          value={comment}
          onChangeText={setComment}
          multiline
        />
        <Pressable 
          style={[
            styles.sendButton,
            !comment.trim() && styles.sendButtonDisabled
          ]}
          onPress={handleSendComment}
          disabled={!comment.trim()}
        >
          <Text style={styles.sendButtonText}>Send</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
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
  image: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 12,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  username: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  description: {
    fontSize: 16,
    color: Colors.text,
    lineHeight: 24,
    marginBottom: 16,
  },
  infoContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
    alignItems: 'center',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: Colors.textLight,
    marginLeft: 4,
  },
  deliveryBadge: {
    backgroundColor: Colors.accent1,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  deliveryText: {
    color: Colors.accent2,
    fontWeight: '500' as const,
    fontSize: 12,
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
  ingredient: {
    fontSize: 14,
    color: Colors.text,
    marginBottom: 4,
    lineHeight: 20,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: Colors.gray,
    marginBottom: 24,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionText: {
    fontSize: 14,
    color: Colors.textLight,
    marginLeft: 4,
  },
  contactBakerContainer: {
    marginBottom: 16,
    alignItems: 'center',
  },
  contactBakerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  contactBakerText: {
    color: Colors.white,
    fontWeight: '600' as const,
    fontSize: 16,
    marginLeft: 8,
  },
  commentsSection: {
    marginBottom: 100, // Extra space for the comment input
  },
  commentText: {
    fontSize: 14,
    color: Colors.textLight,
    fontStyle: 'italic',
  },
  commentInputContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.gray,
  },
  commentInput: {
    flex: 1,
    backgroundColor: Colors.lightGray,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    maxHeight: 100,
    fontSize: 14,
    color: Colors.text,
  },
  sendButton: {
    marginLeft: 8,
    backgroundColor: Colors.primary,
    borderRadius: 20,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: Colors.gray,
  },
  sendButtonText: {
    color: Colors.white,
    fontWeight: '600' as const,
  },
});