import { useState, useEffect } from 'react';
import createContextHook from '@nkzw/create-context-hook';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SupportTicket, FAQ } from '@/types';
import { mockSupportTickets, mockFAQs } from '@/mocks/support';

export const [SupportProvider, useSupport] = createContextHook(() => {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [faqs, setFAQs] = useState<FAQ[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load support data on initialization
  useEffect(() => {
    loadSupportData();
  }, []);

  const loadSupportData = async () => {
    try {
      setIsLoading(true);
      
      // In a real app, these would be API calls
      // For now, we'll use mock data with some persistence
      const storedTickets = await AsyncStorage.getItem('support_tickets');
      const storedFAQs = await AsyncStorage.getItem('support_faqs');

      setTickets(storedTickets ? JSON.parse(storedTickets) : mockSupportTickets);
      setFAQs(storedFAQs ? JSON.parse(storedFAQs) : mockFAQs);
    } catch (error) {
      console.error('Error loading support data:', error);
      // Fallback to mock data
      setTickets(mockSupportTickets);
      setFAQs(mockFAQs);
    } finally {
      setIsLoading(false);
    }
  };

  const createSupportTicket = async (ticketData: {
    category: SupportTicket['category'];
    subject: string;
    message: string;
    attachments?: string[];
  }) => {
    const newTicket: SupportTicket = {
      id: Date.now().toString(),
      userId: 'current_user_id', // In a real app, get from auth context
      category: ticketData.category,
      subject: ticketData.subject,
      message: ticketData.message,
      status: 'new',
      priority: 'medium',
      isEscalated: false,
      attachments: ticketData.attachments,
      dateCreated: new Date().toISOString(),
      dateUpdated: new Date().toISOString(),
      responses: [],
    };

    const updatedTickets = [newTicket, ...tickets];
    setTickets(updatedTickets);
    
    // Persist to storage
    try {
      await AsyncStorage.setItem('support_tickets', JSON.stringify(updatedTickets));
    } catch (error) {
      console.error('Error saving ticket:', error);
    }

    return newTicket;
  };

  const addTicketResponse = async (ticketId: string, message: string) => {
    const updatedTickets = tickets.map(ticket => {
      if (ticket.id === ticketId) {
        const newResponse = {
          id: Date.now().toString(),
          ticketId,
          userId: 'current_user_id',
          message,
          isAdminResponse: false,
          datePosted: new Date().toISOString(),
        };

        return {
          ...ticket,
          responses: [...ticket.responses, newResponse],
          dateUpdated: new Date().toISOString(),
        };
      }
      return ticket;
    });

    setTickets(updatedTickets);
    
    try {
      await AsyncStorage.setItem('support_tickets', JSON.stringify(updatedTickets));
    } catch (error) {
      console.error('Error saving ticket response:', error);
    }
  };

  const getTicketById = (id: string) => {
    return tickets.find(ticket => ticket.id === id);
  };

  const getFAQById = (id: string) => {
    return faqs.find(faq => faq.id === id);
  };

  const getFAQsByCategory = (category: string) => {
    return faqs.filter(faq => 
      faq.category.toLowerCase() === category.toLowerCase()
    );
  };

  const searchFAQs = (query: string) => {
    if (!query.trim()) return faqs;
    
    const lowercaseQuery = query.toLowerCase();
    return faqs.filter(faq =>
      faq.question.toLowerCase().includes(lowercaseQuery) ||
      faq.answer.toLowerCase().includes(lowercaseQuery) ||
      faq.category.toLowerCase().includes(lowercaseQuery)
    );
  };

  const markFAQAsViewed = async (faqId: string) => {
    const updatedFAQs = faqs.map(faq => {
      if (faq.id === faqId) {
        return { ...faq, views: faq.views + 1 };
      }
      return faq;
    });

    setFAQs(updatedFAQs);
    
    try {
      await AsyncStorage.setItem('support_faqs', JSON.stringify(updatedFAQs));
    } catch (error) {
      console.error('Error updating FAQ views:', error);
    }
  };

  const getTicketsByStatus = (status: SupportTicket['status']) => {
    return tickets.filter(ticket => ticket.status === status);
  };

  const getPopularFAQs = (limit: number = 5) => {
    return faqs
      .filter(faq => faq.isPopular)
      .sort((a, b) => b.views - a.views)
      .slice(0, limit);
  };

  const getFAQCategories = () => {
    const categories = Array.from(new Set(faqs.map(faq => faq.category)));
    return categories.map(category => ({
      name: category,
      count: faqs.filter(faq => faq.category === category).length,
    }));
  };

  return {
    // State
    tickets,
    faqs,
    isLoading,
    
    // Actions
    createSupportTicket,
    addTicketResponse,
    loadSupportData,
    
    // Getters
    getTicketById,
    getFAQById,
    getFAQsByCategory,
    searchFAQs,
    getTicketsByStatus,
    getPopularFAQs,
    getFAQCategories,
    
    // Utils
    markFAQAsViewed,
  };
});