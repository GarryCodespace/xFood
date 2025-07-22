import { BakeRequest } from '@/types';
import { mockUsers } from './users';

export const mockRequests: BakeRequest[] = [
  {
    id: '1',
    circleId: '1',
    requesterId: '2',
    requester: mockUsers[1],
    title: 'Need Sourdough Bread for Weekend',
    description: 'Looking for 2 loaves of sourdough bread for a family gathering this Saturday.',
    deadline: '2025-07-26T12:00:00Z',
    budget: 20,
    responses: [
      {
        id: '1',
        requestId: '1',
        bakerId: '1',
        baker: mockUsers[0],
        message: 'I can make 2 fresh loaves for you! My sourdough is made with organic flour.',
        price: 16,
        datePosted: '2025-07-22T10:30:00Z',
      },
    ],
    status: 'open',
  },
  {
    id: '2',
    circleId: '3',
    requesterId: '4',
    requester: mockUsers[3],
    title: 'Vegan Birthday Cake',
    description: 'Need a vegan chocolate cake for my daughter\'s 8th birthday party. Serves 12 people.',
    deadline: '2025-07-24T18:00:00Z',
    budget: 35,
    responses: [
      {
        id: '2',
        requestId: '2',
        bakerId: '5',
        baker: mockUsers[4],
        message: 'I specialize in vegan cakes! I can make a delicious chocolate cake with vanilla frosting.',
        price: 30,
        datePosted: '2025-07-22T14:15:00Z',
      },
    ],
    status: 'open',
  },
];