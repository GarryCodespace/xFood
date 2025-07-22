import { User } from '@/types';

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Emma Baker',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
    kitchenType: 'Home Bakery',
    location: 'Portland, OR',
    rating: 4.8,
    bio: 'Passionate about sourdough and French pastries. Baking for 10+ years!',
    isVerified: true,
    verificationMethod: 'license',
    bakePoints: 1250,
    locationPrivacy: 'full'
  },
  {
    id: '2',
    name: 'Michael Dough',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e',
    kitchenType: 'Hobbyist',
    location: 'Seattle, WA',
    rating: 4.5,
    bio: 'Weekend baker specializing in gluten-free treats and birthday cakes.',
    isVerified: false,
    bakePoints: 680,
    locationPrivacy: 'city'
  },
  {
    id: '3',
    name: 'Sophia Crust',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80',
    kitchenType: 'Professional',
    location: 'Austin, TX',
    rating: 4.9,
    bio: 'Pastry chef by day, experimental baker by night. Love sharing my creations!',
    isVerified: true,
    verificationMethod: 'quiz',
    bakePoints: 2100,
    locationPrivacy: 'full'
  },
  {
    id: '4',
    name: 'James Flour',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e',
    kitchenType: 'Hobbyist',
    location: 'Chicago, IL',
    rating: 4.2,
    bio: 'Baking enthusiast focusing on traditional European recipes.',
    isVerified: false,
    bakePoints: 420,
    locationPrivacy: 'city'
  },
  {
    id: '5',
    name: 'Olivia Sweet',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2',
    kitchenType: 'Home Bakery',
    location: 'Denver, CO',
    rating: 4.7,
    bio: 'Specializing in vegan and allergen-free desserts that taste amazing!',
    isVerified: true,
    verificationMethod: 'license',
    bakePoints: 1580,
    locationPrivacy: 'full'
  }
];