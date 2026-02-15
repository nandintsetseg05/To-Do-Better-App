/**
 * To Do Better — Typography
 * Consistent font sizes, weights, and line heights.
 */

export const FontSize = {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
} as const;

export const FontWeight = {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
    extrabold: '800' as const,
};

export const LineHeight = {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
} as const;
