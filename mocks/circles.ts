import { PastryCircle } from '@/types';

export const mockCircles: PastryCircle[] = [
  {
    id: '1',
    name: 'Sourdough Lovers',
    description: 'A community dedicated to the art and science of sourdough baking.',
    image: 'https://images.unsplash.com/photo-1586444248902-2f64eddc13df',
    memberCount: 1243,
    type: 'Theme',
    tags: ['sourdough', 'bread', 'starter', 'fermentation'],
    isJoined: true
  },
  {
    id: '2',
    name: 'Portland Bakers',
    description: 'Local bakers in Portland sharing their creations and organizing meetups.',
    image: 'https://images.unsplash.com/photo-1605807646983-377bc5a76493',
    memberCount: 876,
    type: 'Location',
    tags: ['portland', 'local', 'community', 'meetup'],
    isJoined: false
  },
  {
    id: '3',
    name: 'Vegan Pastries',
    description: 'Sharing plant-based baking recipes, tips, and treats without animal products.',
    image: 'https://images.unsplash.com/photo-1612240498936-65f5101365d2',
    memberCount: 2187,
    type: 'Theme',
    tags: ['vegan', 'plant-based', 'dairy-free', 'egg-free'],
    isJoined: true
  },
  {
    id: '4',
    name: 'Gluten-Free Baking',
    description: 'Support and recipes for delicious gluten-free baked goods.',
    image: 'https://images.unsplash.com/photo-1612240498936-65f5101365d2',
    memberCount: 1567,
    type: 'Interest',
    tags: ['gluten-free', 'celiac', 'alternative-flour'],
    isJoined: false
  },
  {
    id: '5',
    name: 'French Pastry Techniques',
    description: 'Learning and mastering traditional French pastry methods and recipes.',
    image: 'https://images.unsplash.com/photo-1517433367423-c7e5b0f35086',
    memberCount: 943,
    type: 'Interest',
    tags: ['french', 'patisserie', 'technique', 'croissant'],
    isJoined: false
  },
  {
    id: '6',
    name: 'Seattle Bake Sales',
    description: 'Organizing and promoting local bake sales for charity in the Seattle area.',
    image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a',
    memberCount: 412,
    type: 'Location',
    tags: ['seattle', 'charity', 'bake-sale', 'community'],
    isJoined: false
  }
];