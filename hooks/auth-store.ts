import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import createContextHook from '@nkzw/create-context-hook';
import { User } from '@/types';
import { mockUsers } from '@/mocks/users';

// In a real app, this would be connected to a backend
const CURRENT_USER_KEY = 'pastry_app_current_user';

export const [AuthProvider, useAuth] = createContextHook(() => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user from storage on mount
  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem(CURRENT_USER_KEY);
        if (storedUser) {
          setCurrentUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Failed to load user:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (email: string, password: string) => {
    // Mock login - in a real app, this would call an API
    try {
      setIsLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, just use the first mock user
      const user = mockUsers[0];
      setCurrentUser(user);
      await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
      
      return { success: true };
    } catch (error) {
      console.error('Login failed:', error);
      return { success: false, error: 'Invalid credentials' };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await AsyncStorage.removeItem(CURRENT_USER_KEY);
      setCurrentUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (updatedUser: Partial<User>) => {
    try {
      console.log('updateProfile called with:', updatedUser);
      if (!currentUser) {
        console.log('No current user found');
        return { success: false, error: 'No user logged in' };
      }
      
      const updated = { ...currentUser, ...updatedUser };
      console.log('Updated user object:', updated);
      setCurrentUser(updated);
      await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updated));
      console.log('Profile saved to AsyncStorage');
      
      return { success: true };
    } catch (error) {
      console.error('Profile update failed:', error);
      return { success: false, error: 'Failed to update profile' };
    }
  };

  return {
    currentUser,
    isLoading,
    isAuthenticated: !!currentUser,
    login,
    logout,
    updateProfile,
  };
});