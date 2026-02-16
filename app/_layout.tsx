import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef } from 'react';
import { AppState, type AppStateStatus } from 'react-native';
import 'react-native-reanimated';

import { syncService } from '@/app/services/sync';
import { useAuthStore } from '@/app/stores/useAuthStore';
import { useThemeStore } from '@/app/stores/useThemeStore';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const initAuth = useAuthStore((s) => s.initialize);
  const user = useAuthStore((s) => s.user);
  const initTheme = useThemeStore((s) => s.initialize);
  const resolvedTheme = useThemeStore((s) => s.resolvedTheme);
  const appState = useRef(AppState.currentState);

  // Initialize auth + theme on app start
  useEffect(() => {
    const unsubAuth = initAuth();
    initTheme();
    return unsubAuth;
  }, [initAuth, initTheme]);

  // Sync when user signs in or app comes to foreground
  useEffect(() => {
    if (!user) return;

    syncService.fullSync();

    const subscription = AppState.addEventListener('change', (nextState: AppStateStatus) => {
      if (appState.current.match(/inactive|background/) && nextState === 'active') {
        syncService.fullSync();
      }
      appState.current = nextState;
    });

    return () => subscription.remove();
  }, [user]);

  return (
    <ThemeProvider value={resolvedTheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
      <StatusBar style={resolvedTheme === 'dark' ? 'light' : 'dark'} />
    </ThemeProvider>
  );
}
