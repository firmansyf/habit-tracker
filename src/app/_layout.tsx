import {
  DarkTheme,
  DefaultTheme,
  Stack,
  ThemeProvider,
  useRouter,
  useSegments,
} from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { useColorScheme } from 'react-native';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import { useHabitStore } from '@/store/habit-store';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();

  const username = useHabitStore(
    (state) => state.username
  );

  const hasHydrated = useHabitStore(
    (state) => state.hasHydrated
  );

  return (
    <ThemeProvider
      value={
        colorScheme === 'dark'
          ? DarkTheme
          : DefaultTheme
      }
    >
      <AnimatedSplashOverlay />

      {hasHydrated && (
        <RootNavigation username={username} />
      )}
    </ThemeProvider>
  );
}

function RootNavigation({
  username,
}: {
  username: string | null;
}) {
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (!segments.length) {
      return;
    }

    const inWelcome =
      segments[0] === 'welcome';

    if (!username && !inWelcome) {
      router.replace('/welcome');
      return;
    }

    if (username && inWelcome) {
      router.replace('/(tabs)');
    }
  }, [
    username,
    segments,
    router,
  ]);

  return (
    <Stack>
      <Stack.Screen
        name="profile"
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="habit/[id]"
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="welcome"
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="(tabs)"
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="create"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}