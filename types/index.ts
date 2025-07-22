export interface User {
  id: string;
  name: string;
  avatar: string;
  kitchenType: 'Home Bakery' | 'Hobbyist' | 'Professional';
  location: string;
  rating: number;
  bio?: string;
  isVerified?: boolean;
  verificationMethod?: 'license' | 'quiz';
  bakePoints?: number;
  locationPrivacy?: 'full' | 'city' | 'hidden';
  stripeAccountId?: string;
  totalEarnings?: number;
  totalSales?: number;
  tasteProfile?: TasteProfile;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

export interface PastryPost {
  id: string;
  userId: string;
  user?: User;
  title: string;
  description: string;
  ingredients: string[];
  image: string;
  price?: number;
  isForSale?: boolean;
  deliveryOption: 'Pickup Only' | 'Delivery Available';
  location: string;
  datePosted: string;
  likes: number;
  comments: number;
  tags: string[];
  allergenTags: AllergenTag[];
  specialTags: SpecialTag[];
  deliveryFee?: number;
  platformFee?: number;
  status?: 'available' | 'sold' | 'reserved';
}

export interface Recipe {
  id: string;
  userId: string;
  user?: User;
  title: string;
  description: string;
  ingredients: RecipeIngredient[];
  steps: RecipeStep[];
  images: string[];
  coverImage: string;
  prepTime: number; // in minutes
  cookTime: number; // in minutes
  servings: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  tags: string[];
  allergenTags: AllergenTag[];
  specialTags: SpecialTag[];
  price?: number; // null for free recipes
  isPremium: boolean;
  dateCreated: string;
  likes: number;
  bookmarks: number;
  rating: number;
  reviewCount: number;
  purchases: number;
}

export interface RecipeIngredient {
  id: string;
  name: string;
  amount: string;
  unit: string;
  notes?: string;
}

export interface RecipeStep {
  id: string;
  stepNumber: number;
  instruction: string;
  image?: string;
  video?: string;
  duration?: number; // in minutes
}

export interface RecipeReview {
  id: string;
  recipeId: string;
  userId: string;
  user?: User;
  rating: number;
  comment: string;
  images?: string[];
  datePosted: string;
  helpful: number;
}

export interface RecipePurchase {
  id: string;
  recipeId: string;
  recipe?: Recipe;
  buyerId: string;
  buyer?: User;
  sellerId: string;
  seller?: User;
  amount: number;
  platformFee: number;
  sellerEarnings: number;
  paymentIntentId: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  purchaseDate: string;
}

export interface PastryOrder {
  id: string;
  postId: string;
  post?: PastryPost;
  buyerId: string;
  buyer?: User;
  sellerId: string;
  seller?: User;
  quantity: number;
  totalAmount: number;
  platformFee: number;
  deliveryFee?: number;
  sellerEarnings: number;
  paymentIntentId: string;
  deliveryTrackingId?: string;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'in_transit' | 'delivered' | 'cancelled';
  orderDate: string;
  deliveryDate?: string;
  deliveryAddress?: string;
  specialInstructions?: string;
}

export interface DeliveryTracking {
  id: string;
  orderId: string;
  provider: 'doordash' | 'ubereats' | 'self';
  trackingId: string;
  status: 'assigned' | 'picked_up' | 'in_transit' | 'delivered' | 'cancelled';
  driverName?: string;
  driverPhone?: string;
  estimatedDelivery?: string;
  actualDelivery?: string;
  trackingUrl?: string;
}

export interface PaymentAccount {
  id: string;
  userId: string;
  stripeAccountId: string;
  isActive: boolean;
  onboardingComplete: boolean;
  payoutsEnabled: boolean;
  chargesEnabled: boolean;
  requirements?: string[];
  createdAt: string;
}

export interface UserBookmark {
  id: string;
  userId: string;
  recipeId: string;
  recipe?: Recipe;
  dateBookmarked: string;
}

export interface PastryCircle {
  id: string;
  name: string;
  description: string;
  image: string;
  memberCount: number;
  type: 'Location' | 'Theme' | 'Interest';
  tags: string[];
  isJoined?: boolean;
  adminId: string;
}

export interface Comment {
  id: string;
  userId: string;
  user?: User;
  postId?: string;
  recipeId?: string;
  text: string;
  datePosted: string;
  likes: number;
}

export interface Review {
  id: string;
  reviewerId: string;
  reviewer?: User;
  userId: string;
  rating: number;
  comment: string;
  datePosted: string;
}

export interface CircleEvent {
  id: string;
  circleId: string;
  creatorId: string;
  creator?: User;
  title: string;
  description: string;
  date: string;
  location: string;
  isVirtual: boolean;
  rsvps: string[];
  maxAttendees?: number;
}

export interface BakeRequest {
  id: string;
  circleId: string;
  requesterId: string;
  requester?: User;
  title: string;
  description: string;
  deadline: string;
  budget?: number;
  responses: BakeResponse[];
  status: 'open' | 'fulfilled' | 'closed';
}

export interface BakeResponse {
  id: string;
  requestId: string;
  bakerId: string;
  baker?: User;
  message: string;
  price?: number;
  datePosted: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  receiverId: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export interface UserReport {
  id: string;
  reporterId: string;
  reportedUserId?: string;
  reportedPostId?: string;
  reportedRecipeId?: string;
  reason: 'spam' | 'inappropriate' | 'unsafe' | 'other';
  description: string;
  status: 'pending' | 'reviewed' | 'resolved';
  dateReported: string;
}

export type AllergenTag = 'nuts' | 'dairy' | 'eggs' | 'gluten' | 'soy' | 'shellfish';
export type SpecialTag = 'vegan' | 'halal' | 'sugar-free' | 'organic' | 'keto' | 'paleo';

export interface TasteProfile {
  likedTags: string[];
  dislikedTags: string[];
  preferredCuisines: string[];
  allergens: AllergenTag[];
  favoriteFoodTypes: string[];
  preferredRadius: number; // in km
}

export interface UserInteraction {
  id: string;
  userId: string;
  postId?: string;
  recipeId?: string;
  type: 'like' | 'bookmark' | 'view' | 'purchase';
  timestamp: string;
}

export interface Recommendation {
  id: string;
  userId: string;
  type: 'post' | 'baker' | 'circle';
  itemId: string;
  score: number;
  reasons: string[];
  dateGenerated: string;
}

export interface SearchFilters {
  radius?: number;
  foodTypes?: string[];
  cuisines?: string[];
  allergenTags?: AllergenTag[];
  specialTags?: SpecialTag[];
  minRating?: number;
  priceRange?: {
    min: number;
    max: number;
  };
}

export interface SupportTicket {
  id: string;
  userId: string;
  user?: User;
  category: 'orders' | 'delivery' | 'account' | 'recipe' | 'technical' | 'other';
  subject: string;
  message: string;
  status: 'new' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  attachments?: string[];
  isEscalated: boolean;
  assignedTo?: string;
  dateCreated: string;
  dateUpdated: string;
  responses: SupportResponse[];
}

export interface SupportResponse {
  id: string;
  ticketId: string;
  userId: string;
  user?: User;
  message: string;
  isAdminResponse: boolean;
  datePosted: string;
  attachments?: string[];
}

export interface FAQ {
  id: string;
  category: string;
  question: string;
  answer: string;
  isPopular: boolean;
  dateCreated: string;
  views: number;
}