import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { View, Text } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import { AuthProvider, useAuth } from "@/hooks/auth-store";
import { RecommendationsProvider } from "@/hooks/recommendations-store";
import { SupportProvider } from "@/hooks/support-store";
import { ToastProvider, useToast } from "@/hooks/toast-store";
import { Toast } from "@/components/Toast";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Colors } from "@/constants/colors";
import { trpc, trpcClient } from "@/lib/trpc";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        // Don't retry on 4xx errors
        if (error && typeof error === 'object' && 'status' in error) {
          const status = error.status as number;
          if (status >= 400 && status < 500) {
            return false;
          }
        }
        // Retry up to 2 times for other errors
        return failureCount < 2;
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
    },
    mutations: {
      retry: false, // Don't retry mutations by default
    },
  },
});

function AuthenticatedStack() {
  const { isAuthenticated, isLoading } = useAuth();
  const { toast, hideToast } = useToast();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.background }}>
        <Text style={{ color: Colors.text, fontSize: 16 }}>Loading...</Text>
      </View>
    );
  }

  return (
    <>
      <Toast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        onHide={hideToast}
      />
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors.white,
        },
        headerShadowVisible: false,
        headerTintColor: Colors.text,
        headerTitleStyle: {
          fontWeight: '600',
        },
        contentStyle: {
          backgroundColor: Colors.background,
        },
      }}
    >
      {isAuthenticated ? (
        <>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen 
            name="post/[id]" 
            options={{ 
              title: "Pastry Details",
            }} 
          />
          <Stack.Screen 
            name="circle/[id]" 
            options={{ 
              title: "Pastry Circle",
            }} 
          />
          <Stack.Screen 
            name="create-post" 
            options={{ 
              title: "Share Your Bake",
              presentation: 'modal',
            }} 
          />
          <Stack.Screen 
            name="create-circle" 
            options={{ 
              title: "Create Pastry Circle",
              presentation: 'modal',
            }} 
          />

          <Stack.Screen 
            name="verification" 
            options={{ 
              title: "Verification",
              presentation: 'modal',
            }} 
          />
          <Stack.Screen 
            name="report" 
            options={{ 
              title: "Report",
              presentation: 'modal',
            }} 
          />
          <Stack.Screen 
            name="create-recipe" 
            options={{ 
              title: "Create Recipe",
              presentation: 'modal',
            }} 
          />
          <Stack.Screen 
            name="recipe/[id]" 
            options={{ 
              title: "Recipe Details",
            }} 
          />
          <Stack.Screen 
            name="order-tracking/[id]" 
            options={{ 
              title: "Order Tracking",
            }} 
          />
          <Stack.Screen 
            name="earnings" 
            options={{ 
              title: "Earnings",
            }} 
          />
          <Stack.Screen 
            name="payment-success" 
            options={{ 
              title: "Payment Success",
              headerShown: false,
            }} 
          />
          <Stack.Screen 
            name="payment-cancelled" 
            options={{ 
              title: "Payment Cancelled",
              headerShown: false,
            }} 
          />
          <Stack.Screen 
            name="orders" 
            options={{ 
              title: "My Orders",
            }} 
          />
          <Stack.Screen 
            name="taste-profile-setup" 
            options={{ 
              title: "Taste Profile Setup",
              presentation: 'modal',
            }} 
          />
          <Stack.Screen 
            name="contact-support" 
            options={{ 
              title: "Contact Support",
            }} 
          />
          <Stack.Screen 
            name="support-tickets" 
            options={{ 
              title: "My Support Tickets",
            }} 
          />
          <Stack.Screen 
            name="support-ticket/[id]" 
            options={{ 
              title: "Support Ticket",
            }} 
          />
          <Stack.Screen 
            name="faq/[id]" 
            options={{ 
              title: "FAQ",
            }} 
          />
          <Stack.Screen 
            name="faq-category/[category]" 
            options={{ 
              title: "FAQ Category",
            }} 
          />
        </>
      ) : (
        <>
          <Stack.Screen 
            name="login" 
            options={{ 
              title: "Login",
              headerShown: false,
            }} 
          />
          <Stack.Screen 
            name="register" 
            options={{ 
              title: "Create Account",
              headerShown: false,
            }} 
          />
        </>
      )}
    </Stack>
    </>
  );
}

function RootLayoutNav() {
  return <AuthenticatedStack />;
}

export default function RootLayout() {
  useEffect(() => {
    const hideSplash = async () => {
      try {
        await SplashScreen.hideAsync();
      } catch (error) {
        console.warn('Error hiding splash screen:', error);
      }
    };
    
    // Add a small delay to ensure everything is loaded
    setTimeout(hideSplash, 100);
  }, []);

  return (
    <ErrorBoundary>
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <RecommendationsProvider>
              <SupportProvider>
                <ToastProvider>
                  <GestureHandlerRootView style={{ flex: 1 }}>
                    <StatusBar style="dark" />
                    <RootLayoutNav />
                  </GestureHandlerRootView>
                </ToastProvider>
              </SupportProvider>
            </RecommendationsProvider>
          </AuthProvider>
        </QueryClientProvider>
      </trpc.Provider>
    </ErrorBoundary>
  );
}