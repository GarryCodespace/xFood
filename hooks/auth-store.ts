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
  const [error, setError] = useState<string | null>(null);

  // Load user from storage on mount
  useEffect(() => {
    let isMounted = true;
    
    const loadUser = async () => {
      try {
        console.log('Loading user from storage...');
        setError(null);
        
        const storedUser = await AsyncStorage.getItem(CURRENT_USER_KEY);
        console.log('Stored user:', storedUser ? 'found' : 'not found');
        
        if (!isMounted) return;
        
        if (storedUser) {
          try {
            const parsedUser = JSON.parse(storedUser);
            // Validate the user object has required fields
            if (parsedUser && parsedUser.id && parsedUser.name) {
              console.log('Valid user found, setting current user');
              if (isMounted) {
                setCurrentUser(parsedUser);
              }
            } else {
              console.warn('Invalid user data in storage, clearing...');
              await AsyncStorage.removeItem(CURRENT_USER_KEY);
            }
          } catch (parseError) {
            console.error('Failed to parse stored user data:', parseError);
            await AsyncStorage.removeItem(CURRENT_USER_KEY);
          }
        }
      } catch (error) {
        console.error('Failed to load user:', error);
        if (isMounted) {
          setError('Failed to load user data');
        }
        // Clear corrupted data
        try {
          await AsyncStorage.removeItem(CURRENT_USER_KEY);
        } catch (clearError) {
          console.error('Failed to clear corrupted user data:', clearError);
        }
      } finally {
        console.log('Auth loading complete');
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    // Reduce delay to make app load faster
    const timer = setTimeout(loadUser, 100);
    
    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
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
    error,
    login,
    logout,
    updateProfile,
  };
});