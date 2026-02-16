import { BorderRadius, Spacing } from '@/app/constants/spacing';
import { FontSize, FontWeight } from '@/app/constants/typography';
import { useColors } from '@/app/constants/useColors';
import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    TextInput,
    TextInputProps,
    View,
    ViewStyle,
} from 'react-native';

interface InputProps extends Omit<TextInputProps, 'style'> {
    label?: string;
    error?: string;
    hint?: string;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    containerStyle?: ViewStyle;
}

export const Input: React.FC<InputProps> = ({
    label,
    error,
    hint,
    leftIcon,
    rightIcon,
    containerStyle,
    ...textInputProps
}) => {
    const colors = useColors();
    const [isFocused, setIsFocused] = useState(false);

    const inputContainerStyles: ViewStyle[] = [
        styles.inputContainer,
        { borderColor: colors.border, backgroundColor: colors.surface },
        isFocused && { borderColor: colors.primary, shadowColor: colors.primary, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.15, shadowRadius: 4, elevation: 2 },
        error ? { borderColor: colors.error } : undefined,
    ].filter(Boolean) as ViewStyle[];

    return (
        <View style={[styles.wrapper, containerStyle]}>
            {label && <Text style={[styles.label, { color: colors.text }]}>{label}</Text>}

            <View style={inputContainerStyles}>
                {leftIcon && <View style={styles.iconLeft}>{leftIcon}</View>}
                <TextInput
                    style={[
                        styles.input,
                        { color: colors.text },
                        leftIcon ? styles.inputWithLeftIcon : undefined,
                        rightIcon ? styles.inputWithRightIcon : undefined,
                    ]}
                    placeholderTextColor={colors.textMuted}
                    onFocus={(e) => {
                        setIsFocused(true);
                        textInputProps.onFocus?.(e);
                    }}
                    onBlur={(e) => {
                        setIsFocused(false);
                        textInputProps.onBlur?.(e);
                    }}
                    accessibilityLabel={label || textInputProps.placeholder}
                    {...textInputProps}
                />
                {rightIcon && <View style={styles.iconRight}>{rightIcon}</View>}
            </View>

            {error && <Text style={[styles.error, { color: colors.error }]}>{error}</Text>}
            {hint && !error && <Text style={[styles.hint, { color: colors.textMuted }]}>{hint}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        marginBottom: Spacing.base,
    },

    label: {
        fontSize: FontSize.sm,
        fontWeight: FontWeight.medium,
        marginBottom: Spacing.xs,
    },

    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1.5,
        borderRadius: BorderRadius.lg,
        minHeight: 48,
    },

    input: {
        flex: 1,
        fontSize: FontSize.base,
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.sm,
    },

    inputWithLeftIcon: {
        paddingLeft: Spacing.xs,
    },

    inputWithRightIcon: {
        paddingRight: Spacing.xs,
    },

    iconLeft: {
        paddingLeft: Spacing.md,
    },

    iconRight: {
        paddingRight: Spacing.md,
    },

    error: {
        fontSize: FontSize.xs,
        marginTop: Spacing.xs,
    },

    hint: {
        fontSize: FontSize.xs,
        marginTop: Spacing.xs,
    },
});
