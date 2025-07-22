import { AllergenTag, SpecialTag } from '@/types';

export const ALLERGEN_TAGS: { value: AllergenTag; label: string; emoji: string }[] = [
  { value: 'nuts', label: 'Contains Nuts', emoji: '🥜' },
  { value: 'dairy', label: 'Contains Dairy', emoji: '🥛' },
  { value: 'eggs', label: 'Contains Eggs', emoji: '🥚' },
  { value: 'gluten', label: 'Contains Gluten', emoji: '🌾' },
  { value: 'soy', label: 'Contains Soy', emoji: '🫘' },
  { value: 'shellfish', label: 'Contains Shellfish', emoji: '🦐' },
];

export const SPECIAL_TAGS: { value: SpecialTag; label: string; emoji: string }[] = [
  { value: 'vegan', label: 'Vegan', emoji: '🌱' },
  { value: 'halal', label: 'Halal', emoji: '☪️' },
  { value: 'sugar-free', label: 'Sugar-Free', emoji: '🚫' },
  { value: 'organic', label: 'Organic', emoji: '🌿' },
  { value: 'keto', label: 'Keto-Friendly', emoji: '🥑' },
  { value: 'paleo', label: 'Paleo', emoji: '🦴' },
];