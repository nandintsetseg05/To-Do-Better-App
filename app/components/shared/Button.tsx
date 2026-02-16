import { BorderRadius, Spacing } from '@/app/constants/spacing';
import { FontSize, FontWeight } from '@/app/constants/typography';
import { useColors } from '@/app/constants/useColors';
import * as Haptics from 'expo-haptics';
import React from 'react';
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TextStyle,
    TouchableOpacity,
    ViewStyle,
} from 'react-native';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
    title: string;
    onPress: () => void;
    variant?: ButtonVariant;
    size?: ButtonSize;
    loading?: boolean;
    disabled?: boolean;
    icon?: React.ReactNode;
    fullWidth?: boolean;
    accessibilityLabel?: string;
    style?: ViewStyle;
    textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
    title,
    onPress,
    variant = 'primary',
    size = 'md',
    loading = false,
    disabled = false,
    icon,
    fullWidth = false,
    accessibilityLabel,
    style,
    textStyle,
}) => {
    const colors = useColors();

    const handlePress = () => {
        if (!disabled && !loading) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            onPress();
        }
    };

    // Dynamic variant styles
    const variantStyles: Record<ButtonVariant, ViewStyle> = {
        primary: { backgroundColor: colors.primary },
        secondary: { backgroundColor: colors.secondary },
        outline: { backgroundColor: 'transparent', borderColor: colors.primary },
        danger: { backgroundColor: colors.error },
        ghost: { backgroundColor: 'transparent', borderColor: 'transparent' },
    };

    const textVariantStyles: Record<ButtonVariant, TextStyle> = {
        primary: { color: colors.white },
        secondary: { color: colors.white },
        outline: { color: colors.primary },
        danger: { color: colors.white },
        ghost: { color: colors.primary },
    };

    const containerStyles: ViewStyle[] = [
        styles.base,
        variantStyles[variant],
        styles[`size_${size}`],
        fullWidth && styles.fullWidth,
        (disabled || loading) && styles.disabled,
        style,
    ].filter(Boolean) as ViewStyle[];

    const textStyles: TextStyle[] = [
        styles.text,
        textVariantStyles[variant],
        styles[`textSize_${size}`],
        (disabled || loading) && styles.textDisabled,
        textStyle,
    ].filter(Boolean) as TextStyle[];

    return (
        <TouchableOpacity
            onPress={handlePress}
            disabled={disabled || loading}
            activeOpacity={0.7}
            accessibilityLabel={accessibilityLabel || title}
            accessibilityRole="button"
            accessibilityState={{ disabled: disabled || loading }}
            style={containerStyles}
        >
            {loading ? (
                <ActivityIndicator
                    size="small"
                    color={variant === 'outline' || variant === 'ghost' ? colors.primary : colors.white}
                />
            ) : (
                <>
                    {icon && icon}
                    <Text style={textStyles}>{title}</Text>
                </>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    base: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: Spacing.sm,
        borderRadius: BorderRadius.lg,
        borderWidth: 2,
        borderColor: 'transparent',
    },

    // ── Sizes ──
    size_sm: {
        paddingVertical: Spacing.xs,
        paddingHorizontal: Spacing.md,
        minHeight: 32,
    },
    size_md: {
        paddingVertical: Spacing.sm,
        paddingHorizontal: Spacing.base,
        minHeight: 44,
    },
    size_lg: {
        paddingVertical: Spacing.md,
        paddingHorizontal: Spacing.lg,
        minHeight: 52,
    },

    fullWidth: {
        width: '100%',
    },

    disabled: {
        opacity: 0.5,
    },

    // ── Text ──
    text: {
        fontWeight: FontWeight.semibold,
    },

    textSize_sm: {
        fontSize: FontSize.sm,
    },
    textSize_md: {
        fontSize: FontSize.base,
    },
    textSize_lg: {
        fontSize: FontSize.lg,
    },

    textDisabled: {
        opacity: 0.7,
    },
});
