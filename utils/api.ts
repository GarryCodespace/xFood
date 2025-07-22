// API utility functions for backend integration
// In a real app, these would connect to your actual backend

export interface SupportRequest {
  category: string;
  subject: string;
  message: string;
  userEmail: string;
  userName: string;
  userId: string;
  timestamp: string;
  supportEmail: string;
}

export interface PaymentSetupRequest {
  userId: string;
  businessType: string;
  country: string;
  email: string;
}

export interface PostData {
  title: string;
  description: string;
  ingredients: string[];
  image: string;
  price: number | null;
  location: string;
  deliveryOption: string;
  tags: string[];
  allergenTags: string[];
  specialTags: string[];
  userId: string;
  timestamp: string;
}

export interface RecipeData {
  title: string;
  description: string;
  ingredients: any[];
  steps: any[];
  coverImage: string;
  prepTime: number;
  cookTime: number;
  servings: number;
  difficulty: string;
  tags: string[];
  allergenTags: string[];
  specialTags: string[];
  isPremium: boolean;
  price?: number;
  userId: string;
  timestamp: string;
}

// Mock API functions - replace with real backend calls
export const apiService = {
  async submitSupportRequest(data: SupportRequest): Promise<{ success: boolean; ticketId?: string }> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // In a real app, this would send an email via your backend
    console.log('Support request submitted:', {
      ...data,
      emailSubject: `[xFood Support] Ticket from ${data.userName} - ${data.category}`,
      emailTo: data.supportEmail,
    });
    
    return { success: true, ticketId: `TICKET-${Date.now()}` };
  },

  async setupPayments(data: PaymentSetupRequest): Promise<{ success: boolean; onboardingUrl?: string }> {
    // Simulate Stripe Connect setup
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log('Payment setup initiated:', data);
    
    // In a real app, this would create a Stripe Connect account
    return { 
      success: true, 
      onboardingUrl: `https://connect.stripe.com/setup/${data.userId}` 
    };
  },

  async createPost(data: PostData): Promise<{ success: boolean; postId?: string }> {
    // Simulate post creation
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    console.log('Post created:', data);
    
    // In a real app, this would save to your database
    return { success: true, postId: `POST-${Date.now()}` };
  },

  async createRecipe(data: RecipeData): Promise<{ success: boolean; recipeId?: string }> {
    // Simulate recipe creation
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    console.log('Recipe created:', data);
    
    // In a real app, this would save to your database
    return { success: true, recipeId: `RECIPE-${Date.now()}` };
  },

  async processPayment(data: {
    amount: number;
    currency: string;
    sellerId: string;
    buyerId: string;
    itemId: string;
    platformFeePercent: number;
  }): Promise<{ success: boolean; paymentId?: string; error?: string }> {
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const platformFee = data.amount * (data.platformFeePercent / 100);
    const sellerAmount = data.amount - platformFee;
    
    console.log('Payment processed:', {
      ...data,
      platformFee,
      sellerAmount,
    });
    
    // In a real app, this would process via Stripe
    return { success: true, paymentId: `PAY-${Date.now()}` };
  }
};