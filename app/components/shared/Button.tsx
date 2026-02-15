import { Colors } from '@/app/constants/colors';
import { BorderRadius, Spacing } from '@/app/constants/spacing';
import { FontSize, FontWeight } from '@/app/constants/typography';
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
    const handlePress = () => {
        if (!disabled && !loading) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            onPress();
        }
    };

    const containerStyles: ViewStyle[] = [
        styles.base,
        styles[`variant_${variant}`],
        styles[`size_${size}`],
        fullWidth && styles.fullWidth,
        (disabled || loading) && styles.disabled,
        style,
    ].filter(Boolean) as ViewStyle[];

    const textStyles: TextStyle[] = [
        styles.text,
        styles[`text_${variant}`],
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
                    color={variant === 'outline' || variant === 'ghost' ? Colors.primary : Colors.white}
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

    // ── Variants ──
    variant_primary: {
        backgroundColor: Colors.primary,
    },
    variant_secondary: {
        backgroundColor: Colors.secondary,
    },
    variant_outline: {
        backgroundColor: 'transparent',
        borderColor: Colors.primary,
    },
    variant_danger: {
        backgroundColor: Colors.error,
    },
    variant_ghost: {
        backgroundColor: 'transparent',
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
    text_primary: {
        color: Colors.white,
    },
    text_secondary: {
        color: Colors.white,
    },
    text_outline: {
        color: Colors.primary,
    },
    text_danger: {
        color: Colors.white,
    },
    text_ghost: {
        color: Colors.primary,
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
