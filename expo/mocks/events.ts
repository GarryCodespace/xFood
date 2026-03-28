import { CircleEvent } from '@/types';
import { mockUsers } from './users';

export const mockEvents: CircleEvent[] = [
  {
    id: '1',
    circleId: '1',
    creatorId: '1',
    creator: mockUsers[0],
    title: 'Sourdough Workshop',
    description: 'Learn the basics of sourdough starter maintenance and bread making techniques.',
    date: '2025-07-25T14:00:00Z',
    location: 'Community Kitchen, Portland',
    isVirtual: false,
    rsvps: ['2', '3', '4'],
    maxAttendees: 12,
  },
  {
    id: '2',
    circleId: '3',
    creatorId: '5',
    creator: mockUsers[4],
    title: 'Vegan Baking Q&A',
    description: 'Virtual session to discuss egg and dairy substitutes in baking.',
    date: '2025-07-23T19:00:00Z',
    location: 'Zoom Meeting',
    isVirtual: true,
    rsvps: ['1', '2'],
  },
  {
    id: '3',
    circleId: '2',
    creatorId: '1',
    creator: mockUsers[0],
    title: 'Portland Bake Sale',
    description: 'Monthly charity bake sale at Pioneer Courthouse Square.',
    date: '2025-07-28T10:00:00Z',
    location: 'Pioneer Courthouse Square, Portland',
    isVirtual: false,
    rsvps: ['2', '3', '4', '5'],
    maxAttendees: 20,
  },
];