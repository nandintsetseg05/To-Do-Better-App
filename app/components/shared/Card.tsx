import { Colors } from '@/app/constants/colors';
import { BorderRadius, Spacing } from '@/app/constants/spacing';
import React from 'react';
import {
    StyleSheet,
    TouchableOpacity,
    View,
    ViewStyle,
} from 'react-native';

interface CardProps {
    children: React.ReactNode;
    onPress?: () => void;
    style?: ViewStyle;
    padded?: boolean;
    elevated?: boolean;
}

export const Card: React.FC<CardProps> = ({
    children,
    onPress,
    style,
    padded = true,
    elevated = true,
}) => {
    const cardStyles: ViewStyle[] = [
        styles.card,
        padded && styles.padded,
        elevated && styles.elevated,
        style,
    ].filter(Boolean) as ViewStyle[];

    if (onPress) {
        return (
            <TouchableOpacity
                onPress={onPress}
                activeOpacity={0.7}
                style={cardStyles}
                accessibilityRole="button"
            >
                {children}
            </TouchableOpacity>
        );
    }

    return <View style={cardStyles}>{children}</View>;
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: Colors.surface,
        borderRadius: BorderRadius.xl,
        borderWidth: 1,
        borderColor: Colors.border,
        overflow: 'hidden',
    },

    padded: {
        padding: Spacing.base,
    },

    elevated: {
        shadowColor: Colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 3,
    },
});
