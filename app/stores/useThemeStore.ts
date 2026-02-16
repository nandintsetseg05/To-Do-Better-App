import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';

export type ThemeMode = 'light' | 'dark';

interface ThemeState {
    themeMode: ThemeMode;
    resolvedTheme: 'light' | 'dark';
    setThemeMode: (mode: ThemeMode) => void;
    initialize: () => Promise<void>;
}

const STORAGE_KEY = 'todo-better-theme';

/**
 * Theme store — manages dark mode preference with AsyncStorage persistence.
 *
 * Supports two modes: light and dark.
 */
export const useThemeStore = create<ThemeState>((set) => ({
    themeMode: 'light',
    resolvedTheme: 'light',

    setThemeMode: async (mode: ThemeMode) => {
        set({
            themeMode: mode,
            resolvedTheme: mode,
        });

        try {
            await AsyncStorage.setItem(STORAGE_KEY, mode);
        } catch (e) {
            console.warn('[Theme] Failed to save preference:', e);
        }
    },

    initialize: async () => {
        try {
            const stored = await AsyncStorage.getItem(STORAGE_KEY);
            if (stored && ['light', 'dark'].includes(stored)) {
                const mode = stored as ThemeMode;
                set({
                    themeMode: mode,
                    resolvedTheme: mode,
                });
            }
        } catch (e) {
            console.warn('[Theme] Failed to load preference:', e);
        }
    },
}));
