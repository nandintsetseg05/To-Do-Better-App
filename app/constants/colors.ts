/**
 * To Do Better — Color Palette
 * Design tokens for consistent theming throughout the app.
 */

export const Colors = {
    // ── Brand Colors ──
    primary: '#6366f1',        // Indigo – main brand color
    primaryLight: '#818cf8',
    primaryDark: '#4f46e5',

    secondary: '#f59e0b',      // Amber – accents, streak fire
    secondaryLight: '#fbbf24',
    secondaryDark: '#d97706',

    // ── Surfaces ──
    background: '#f8fafc',
    backgroundDark: '#0f172a',
    surface: '#ffffff',
    surfaceDark: '#1e293b',
    card: '#ffffff',
    cardDark: '#1e293b',

    // ── Text ──
    text: '#0f172a',
    textDark: '#f1f5f9',
    textSecondary: '#64748b',
    textSecondaryDark: '#94a3b8',
    textMuted: '#94a3b8',

    // ── Status ──
    success: '#22c55e',
    successLight: '#bbf7d0',
    warning: '#f59e0b',
    warningLight: '#fef3c7',
    error: '#ef4444',
    errorLight: '#fecaca',

    // ── Streak Colors ──
    streakFire: '#f97316',     // Orange for active streaks
    streakGold: '#eab308',     // Gold for milestone streaks
    streakPlatinum: '#a78bfa', // Purple for 100+ streaks

    // ── Heatmap Intensity Scale ──
    heatmap: {
        empty: '#e2e8f0',
        level1: '#bbf7d0',      // 1-2 completions
        level2: '#86efac',      // 3-4 completions
        level3: '#4ade80',      // 5-6 completions
        level4: '#22c55e',      // 7+ completions
        // Dark mode
        emptyDark: '#334155',
        level1Dark: '#14532d',
        level2Dark: '#166534',
        level3Dark: '#15803d',
        level4Dark: '#16a34a',
    },

    // ── Priority Colors ──
    priorityLow: '#3b82f6',
    priorityMedium: '#f59e0b',
    priorityHigh: '#ef4444',

    // ── Misc ──
    border: '#e2e8f0',
    borderDark: '#334155',
    overlay: 'rgba(0, 0, 0, 0.5)',
    transparent: 'transparent',
    white: '#ffffff',
    black: '#000000',
} as const;

export type ColorKey = keyof typeof Colors;
