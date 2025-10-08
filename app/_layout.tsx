import { ClerkProvider, useAuth } from '@clerk/clerk-expo';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';

// Replace with your Clerk publishable key
const CLERK_PUBLISHABLE_KEY = "pk_test_aG9seS1nb29zZS0xNi5jbGVyay5hY2NvdW50cy5kZXYk";

export const unstable_settings = {
  anchor: '(tabs)',
};

function useProtectedRoute() {
  const { isSignedIn, isLoaded } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded) return;

    const inSignIn = segments[0] === 'sign-in';

    if (!isSignedIn && !inSignIn) {
      // Redirect to sign-in if user isn't signed in
      router.replace('/sign-in');
    } else if (isSignedIn && inSignIn) {
      // Redirect to home if user is signed in and on sign-in page
      router.replace('/');
    }
  }, [isSignedIn, segments, isLoaded]);
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  useProtectedRoute();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="sign-in" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY}>
      <RootLayoutNav />
    </ClerkProvider>
  );
}
