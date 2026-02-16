import { useThemeStore } from '@/app/stores/useThemeStore';
import { Colors } from './colors';

/**
 * Theme-resolved color palette.
 * Every key that has a `xxxDark` counterpart in Colors gets swapped automatically.
 */
export interface ThemeColors {
    // Brand (same in both themes)
    primary: string;
    primaryLight: string;
    primaryDark: string;
    secondary: string;
    secondaryLight: string;
    secondaryDark: string;

    // Surfaces
    background: string;
    surface: string;
    card: string;

    // Text
    text: string;
    textSecondary: string;
    textMuted: string;

    // Status
    success: string;
    successLight: string;
    warning: string;
    warningLight: string;
    error: string;
    errorLight: string;

    // Streaks
    streakFire: string;
    streakGold: string;
    streakPlatinum: string;

    // Priority
    priorityLow: string;
    priorityMedium: string;
    priorityHigh: string;

    // Misc
    border: string;
    overlay: string;
    transparent: string;
    white: string;
    black: string;

    // Heatmap
    heatmapEmpty: string;
    heatmapLevel1: string;
    heatmapLevel2: string;
    heatmapLevel3: string;
    heatmapLevel4: string;
}

const lightColors: ThemeColors = {
    primary: Colors.primary,
    primaryLight: Colors.primaryLight,
    primaryDark: Colors.primaryDark,
    secondary: Colors.secondary,
    secondaryLight: Colors.secondaryLight,
    secondaryDark: Colors.secondaryDark,

    background: Colors.background,
    surface: Colors.surface,
    card: Colors.card,

    text: Colors.text,
    textSecondary: Colors.textSecondary,
    textMuted: Colors.textMuted,

    success: Colors.success,
    successLight: Colors.successLight,
    warning: Colors.warning,
    warningLight: Colors.warningLight,
    error: Colors.error,
    errorLight: Colors.errorLight,

    streakFire: Colors.streakFire,
    streakGold: Colors.streakGold,
    streakPlatinum: Colors.streakPlatinum,

    priorityLow: Colors.priorityLow,
    priorityMedium: Colors.priorityMedium,
    priorityHigh: Colors.priorityHigh,

    border: Colors.border,
    overlay: Colors.overlay,
    transparent: Colors.transparent,
    white: Colors.white,
    black: Colors.black,

    heatmapEmpty: Colors.heatmap.empty,
    heatmapLevel1: Colors.heatmap.level1,
    heatmapLevel2: Colors.heatmap.level2,
    heatmapLevel3: Colors.heatmap.level3,
    heatmapLevel4: Colors.heatmap.level4,
};

const darkColors: ThemeColors = {
    primary: Colors.primary,
    primaryLight: Colors.primaryLight,
    primaryDark: Colors.primaryDark,
    secondary: Colors.secondary,
    secondaryLight: Colors.secondaryLight,
    secondaryDark: Colors.secondaryDark,

    background: Colors.backgroundDark,
    surface: Colors.surfaceDark,
    card: Colors.cardDark,

    text: Colors.textDark,
    textSecondary: Colors.textSecondaryDark,
    textMuted: Colors.textMuted,           // stays the same

    success: Colors.success,
    successLight: '#14532d',               // darker green for dark mode
    warning: Colors.warning,
    warningLight: '#78350f',               // darker amber
    error: Colors.error,
    errorLight: '#7f1d1d',                 // darker red

    streakFire: Colors.streakFire,
    streakGold: Colors.streakGold,
    streakPlatinum: Colors.streakPlatinum,

    priorityLow: Colors.priorityLow,
    priorityMedium: Colors.priorityMedium,
    priorityHigh: Colors.priorityHigh,

    border: Colors.borderDark,
    overlay: 'rgba(0, 0, 0, 0.7)',
    transparent: Colors.transparent,
    white: Colors.white,
    black: Colors.black,

    heatmapEmpty: Colors.heatmap.emptyDark,
    heatmapLevel1: Colors.heatmap.level1Dark,
    heatmapLevel2: Colors.heatmap.level2Dark,
    heatmapLevel3: Colors.heatmap.level3Dark,
    heatmapLevel4: Colors.heatmap.level4Dark,
};

/**
 * React hook — returns the correct color palette based on the current theme.
 * Use this in every component/screen instead of importing `Colors` directly.
 */
export function useColors(): ThemeColors {
    const resolvedTheme = useThemeStore((s) => s.resolvedTheme);
    return resolvedTheme === 'dark' ? darkColors : lightColors;
}

/**
 * Non-hook version for use outside React components (e.g. in services).
 */
export function getColors(): ThemeColors {
    const resolvedTheme = useThemeStore.getState().resolvedTheme;
    return resolvedTheme === 'dark' ? darkColors : lightColors;
}
