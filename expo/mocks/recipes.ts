import { Recipe, RecipeIngredient, RecipeStep } from '@/types';
import { mockUsers } from './users';

const mockIngredients: RecipeIngredient[] = [
  { id: '1', name: 'All-purpose flour', amount: '2', unit: 'cups', notes: 'sifted' },
  { id: '2', name: 'Sugar', amount: '1', unit: 'cup' },
  { id: '3', name: 'Butter', amount: '1/2', unit: 'cup', notes: 'room temperature' },
  { id: '4', name: 'Eggs', amount: '2', unit: 'large' },
  { id: '5', name: 'Vanilla extract', amount: '1', unit: 'tsp' },
  { id: '6', name: 'Baking powder', amount: '2', unit: 'tsp' },
  { id: '7', name: 'Salt', amount: '1/2', unit: 'tsp' },
  { id: '8', name: 'Milk', amount: '1/2', unit: 'cup' },
];

const mockSteps: RecipeStep[] = [
  {
    id: '1',
    stepNumber: 1,
    instruction: 'Preheat oven to 350°F (175°C). Grease and flour a 9-inch round cake pan.',
    duration: 5
  },
  {
    id: '2',
    stepNumber: 2,
    instruction: 'In a large bowl, cream together butter and sugar until light and fluffy, about 3-4 minutes.',
    image: 'https://images.unsplash.com/photo-1571115764595-644a1f56a55c',
    duration: 5
  },
  {
    id: '3',
    stepNumber: 3,
    instruction: 'Beat in eggs one at a time, then add vanilla extract.',
    duration: 3
  },
  {
    id: '4',
    stepNumber: 4,
    instruction: 'In a separate bowl, whisk together flour, baking powder, and salt.',
    duration: 2
  },
  {
    id: '5',
    stepNumber: 5,
    instruction: 'Gradually add dry ingredients to wet ingredients, alternating with milk. Mix until just combined.',
    duration: 3
  },
  {
    id: '6',
    stepNumber: 6,
    instruction: 'Pour batter into prepared pan and bake for 25-30 minutes, until a toothpick inserted in center comes out clean.',
    duration: 30
  },
];

export const mockRecipes: Recipe[] = [
  {
    id: '1',
    userId: '1',
    user: mockUsers[0],
    title: 'Classic Vanilla Sponge Cake',
    description: 'A light and fluffy vanilla sponge cake that\'s perfect for any occasion. This recipe has been in my family for generations!',
    ingredients: mockIngredients,
    steps: mockSteps,
    images: [
      'https://images.unsplash.com/photo-1578985545062-69928b1d9587',
      'https://images.unsplash.com/photo-1571115764595-644a1f56a55c'
    ],
    coverImage: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587',
    prepTime: 15,
    cookTime: 30,
    servings: 8,
    difficulty: 'Easy',
    tags: ['cake', 'vanilla', 'classic', 'birthday'],
    allergenTags: ['eggs', 'dairy', 'gluten'],
    specialTags: [],
    price: 4.99,
    isPremium: true,
    dateCreated: '2025-07-20T10:00:00Z',
    likes: 156,
    bookmarks: 89,
    rating: 4.8,
    reviewCount: 34,
    purchases: 127,
  },
  {
    id: '2',
    userId: '3',
    user: mockUsers[2],
    title: 'Perfect Chocolate Croissants',
    description: 'Learn the art of making buttery, flaky croissants filled with rich dark chocolate. Professional techniques made simple.',
    ingredients: [
      { id: '1', name: 'Strong bread flour', amount: '500', unit: 'g' },
      { id: '2', name: 'Butter', amount: '250', unit: 'g', notes: 'cold, for lamination' },
      { id: '3', name: 'Milk', amount: '250', unit: 'ml', notes: 'warm' },
      { id: '4', name: 'Sugar', amount: '50', unit: 'g' },
      { id: '5', name: 'Salt', amount: '10', unit: 'g' },
      { id: '6', name: 'Fresh yeast', amount: '12', unit: 'g' },
      { id: '7', name: 'Dark chocolate', amount: '200', unit: 'g', notes: 'chopped' },
    ],
    steps: [
      {
        id: '1',
        stepNumber: 1,
        instruction: 'Make the dough by combining flour, milk, sugar, salt, and yeast. Knead until smooth.',
        duration: 15
      },
      {
        id: '2',
        stepNumber: 2,
        instruction: 'Wrap dough and refrigerate for at least 4 hours or overnight.',
        duration: 240
      },
      {
        id: '3',
        stepNumber: 3,
        instruction: 'Prepare butter block by pounding cold butter into a flat rectangle.',
        image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff',
        duration: 10
      },
    ],
    images: [
      'https://images.unsplash.com/photo-1608198093002-ad4e005484ec',
      'https://images.unsplash.com/photo-1509440159596-0249088772ff'
    ],
    coverImage: 'https://images.unsplash.com/photo-1608198093002-ad4e005484ec',
    prepTime: 60,
    cookTime: 20,
    servings: 12,
    difficulty: 'Hard',
    tags: ['croissant', 'chocolate', 'french', 'pastry', 'lamination'],
    allergenTags: ['gluten', 'dairy'],
    specialTags: [],
    price: 12.99,
    isPremium: true,
    dateCreated: '2025-07-18T14:30:00Z',
    likes: 203,
    bookmarks: 145,
    rating: 4.9,
    reviewCount: 67,
    purchases: 89,
  },
  {
    id: '3',
    userId: '5',
    user: mockUsers[4],
    title: 'Vegan Chocolate Chip Cookies',
    description: 'Deliciously chewy vegan chocolate chip cookies that no one will believe are dairy and egg-free!',
    ingredients: [
      { id: '1', name: 'All-purpose flour', amount: '2 1/4', unit: 'cups' },
      { id: '2', name: 'Vegan butter', amount: '1', unit: 'cup', notes: 'room temperature' },
      { id: '3', name: 'Brown sugar', amount: '3/4', unit: 'cup' },
      { id: '4', name: 'White sugar', amount: '1/4', unit: 'cup' },
      { id: '5', name: 'Flax eggs', amount: '2', unit: 'tbsp', notes: '2 tbsp ground flaxseed + 6 tbsp water' },
      { id: '6', name: 'Vanilla extract', amount: '2', unit: 'tsp' },
      { id: '7', name: 'Baking soda', amount: '1', unit: 'tsp' },
      { id: '8', name: 'Salt', amount: '1', unit: 'tsp' },
      { id: '9', name: 'Vegan chocolate chips', amount: '2', unit: 'cups' },
    ],
    steps: [
      {
        id: '1',
        stepNumber: 1,
        instruction: 'Prepare flax eggs by mixing ground flaxseed with water. Let sit for 5 minutes.',
        duration: 5
      },
      {
        id: '2',
        stepNumber: 2,
        instruction: 'Cream vegan butter with both sugars until light and fluffy.',
        duration: 3
      },
      {
        id: '3',
        stepNumber: 3,
        instruction: 'Add flax eggs and vanilla, mix well.',
        duration: 2
      },
    ],
    images: [
      'https://images.unsplash.com/photo-1499636136210-6f4ee915583e'
    ],
    coverImage: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e',
    prepTime: 15,
    cookTime: 12,
    servings: 24,
    difficulty: 'Easy',
    tags: ['cookies', 'chocolate-chip', 'easy', 'quick'],
    allergenTags: ['gluten'],
    specialTags: ['vegan'],
    price: undefined,
    isPremium: false,
    dateCreated: '2025-07-19T09:15:00Z',
    likes: 98,
    bookmarks: 67,
    rating: 4.7,
    reviewCount: 23,
    purchases: 0,
  },
  {
    id: '4',
    userId: '2',
    user: mockUsers[1],
    title: 'Gluten-Free Banana Bread',
    description: 'Moist and delicious gluten-free banana bread made with almond flour. Perfect for breakfast or snacking.',
    ingredients: [
      { id: '1', name: 'Almond flour', amount: '2', unit: 'cups' },
      { id: '2', name: 'Ripe bananas', amount: '3', unit: 'large', notes: 'mashed' },
      { id: '3', name: 'Eggs', amount: '3', unit: 'large' },
      { id: '4', name: 'Honey', amount: '1/3', unit: 'cup' },
      { id: '5', name: 'Coconut oil', amount: '1/4', unit: 'cup', notes: 'melted' },
      { id: '6', name: 'Vanilla extract', amount: '1', unit: 'tsp' },
      { id: '7', name: 'Baking soda', amount: '1', unit: 'tsp' },
      { id: '8', name: 'Salt', amount: '1/2', unit: 'tsp' },
      { id: '9', name: 'Cinnamon', amount: '1', unit: 'tsp' },
    ],
    steps: [
      {
        id: '1',
        stepNumber: 1,
        instruction: 'Preheat oven to 350°F. Line a 9x5 inch loaf pan with parchment paper.',
        duration: 5
      },
      {
        id: '2',
        stepNumber: 2,
        instruction: 'In a large bowl, mash bananas until smooth.',
        duration: 3
      },
    ],
    images: [
      'https://images.unsplash.com/photo-1586444248902-2f64eddc13df'
    ],
    coverImage: 'https://images.unsplash.com/photo-1586444248902-2f64eddc13df',
    prepTime: 10,
    cookTime: 55,
    servings: 10,
    difficulty: 'Easy',
    tags: ['banana-bread', 'breakfast', 'healthy'],
    allergenTags: ['eggs', 'nuts'],
    specialTags: [],
    price: 2.99,
    isPremium: true,
    dateCreated: '2025-07-17T16:20:00Z',
    likes: 74,
    bookmarks: 52,
    rating: 4.6,
    reviewCount: 18,
    purchases: 43,
  },
];