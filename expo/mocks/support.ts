import { SupportTicket, SupportResponse, FAQ } from '@/types';

export const mockSupportTickets: SupportTicket[] = [
  {
    id: '1',
    userId: '1',
    category: 'orders',
    subject: 'Order not delivered',
    message: 'I placed an order for chocolate croissants yesterday but they were never delivered. The tracking shows delivered but I never received them.',
    status: 'new',
    priority: 'high',
    isEscalated: false,
    dateCreated: '2024-01-15T10:30:00Z',
    dateUpdated: '2024-01-15T10:30:00Z',
    responses: []
  },
  {
    id: '2',
    userId: '2',
    category: 'account',
    subject: 'Cannot verify my baker account',
    message: 'I uploaded my food handler license but my account is still not verified. How long does verification usually take?',
    status: 'in_progress',
    priority: 'medium',
    isEscalated: false,
    assignedTo: 'admin1',
    dateCreated: '2024-01-14T14:20:00Z',
    dateUpdated: '2024-01-15T09:15:00Z',
    responses: [
      {
        id: '1',
        ticketId: '2',
        userId: 'admin1',
        message: 'Hi! Thanks for reaching out. Verification typically takes 2-3 business days. I can see your license was uploaded successfully. Our team is currently reviewing it and you should hear back within 24 hours.',
        isAdminResponse: true,
        datePosted: '2024-01-15T09:15:00Z'
      }
    ]
  },
  {
    id: '3',
    userId: '3',
    category: 'technical',
    subject: 'App crashes when uploading photos',
    message: 'Every time I try to upload a photo of my baked goods, the app crashes. I\'m using iPhone 12 with iOS 17.',
    status: 'resolved',
    priority: 'medium',
    isEscalated: false,
    assignedTo: 'admin2',
    dateCreated: '2024-01-13T16:45:00Z',
    dateUpdated: '2024-01-14T11:30:00Z',
    responses: [
      {
        id: '2',
        ticketId: '3',
        userId: 'admin2',
        message: 'Thanks for reporting this issue. This is a known bug that we\'ve fixed in version 2.1.3. Please update your app from the App Store and the issue should be resolved.',
        isAdminResponse: true,
        datePosted: '2024-01-14T11:30:00Z'
      }
    ]
  }
];

export const mockFAQs: FAQ[] = [
  {
    id: '1',
    category: 'Orders',
    question: 'How do I track my order?',
    answer: 'You can track your order by going to your profile and selecting "Order History". Each order will show its current status and estimated delivery time.',
    isPopular: true,
    dateCreated: '2024-01-01T00:00:00Z',
    views: 245
  },
  {
    id: '2',
    category: 'Orders',
    question: 'Can I cancel my order?',
    answer: 'Orders can be cancelled within 30 minutes of placing them, as long as the baker hasn\'t started preparing your items. Go to Order History and tap "Cancel Order".',
    isPopular: true,
    dateCreated: '2024-01-01T00:00:00Z',
    views: 189
  },
  {
    id: '3',
    category: 'Safety',
    question: 'How do you ensure food safety?',
    answer: 'All our verified bakers must either hold a valid food handler license or pass our food safety quiz. We also encourage customers to check baker ratings and reviews.',
    isPopular: true,
    dateCreated: '2024-01-01T00:00:00Z',
    views: 156
  },
  {
    id: '4',
    category: 'Delivery',
    question: 'What are the delivery fees?',
    answer: 'Delivery fees vary by distance and delivery partner. Typical fees range from $2-8. You\'ll see the exact fee before confirming your order.',
    isPopular: false,
    dateCreated: '2024-01-01T00:00:00Z',
    views: 98
  },
  {
    id: '5',
    category: 'Account',
    question: 'How do I become a verified baker?',
    answer: 'To get verified, go to your profile settings and either upload a valid food handler license or complete our 5-question food safety quiz.',
    isPopular: true,
    dateCreated: '2024-01-01T00:00:00Z',
    views: 134
  },
  {
    id: '6',
    category: 'Account',
    question: 'How do I delete my account?',
    answer: 'To delete your account, go to Settings > Account > Delete Account. Note that this action is permanent and cannot be undone.',
    isPopular: false,
    dateCreated: '2024-01-01T00:00:00Z',
    views: 67
  },
  {
    id: '7',
    category: 'Delivery',
    question: 'Do you deliver to my area?',
    answer: 'We deliver to most areas within major cities. Enter your address during checkout to see if delivery is available in your location.',
    isPopular: false,
    dateCreated: '2024-01-01T00:00:00Z',
    views: 89
  },
  {
    id: '8',
    category: 'Orders',
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards, debit cards, Apple Pay, Google Pay, and PayPal through our secure payment system.',
    isPopular: false,
    dateCreated: '2024-01-01T00:00:00Z',
    views: 112
  }
];

export const supportCategories = [
  { value: 'orders', label: 'Orders & Payments' },
  { value: 'delivery', label: 'Delivery & Pickup' },
  { value: 'account', label: 'Account & Verification' },
  { value: 'recipe', label: 'Recipes & Content' },
  { value: 'technical', label: 'Technical Issues' },
  { value: 'other', label: 'Other' }
];