import { Spacing } from '@/app/constants/spacing';
import { FontSize, FontWeight } from '@/app/constants/typography';
import { useColors } from '@/app/constants/useColors';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from './Button';

interface EmptyStateProps {
    icon?: keyof typeof Ionicons.glyphMap;
    title: string;
    message?: string;
    actionLabel?: string;
    onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
    icon = 'add-circle-outline',
    title,
    message,
    actionLabel,
    onAction,
}) => {
    const colors = useColors();

    return (
        <View style={styles.container}>
            <View style={styles.iconContainer}>
                <Ionicons name={icon} size={56} color={colors.textMuted} />
            </View>
            <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
            {message && <Text style={[styles.message, { color: colors.textSecondary }]}>{message}</Text>}
            {actionLabel && onAction && (
                <View style={styles.actionContainer}>
                    <Button title={actionLabel} onPress={onAction} size="md" />
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: Spacing.xl,
        paddingVertical: Spacing['2xl'],
    },

    iconContainer: {
        marginBottom: Spacing.base,
        opacity: 0.6,
    },

    title: {
        fontSize: FontSize.xl,
        fontWeight: FontWeight.semibold,
        textAlign: 'center',
        marginBottom: Spacing.sm,
    },

    message: {
        fontSize: FontSize.base,
        textAlign: 'center',
        lineHeight: FontSize.base * 1.5,
    },

    actionContainer: {
        marginTop: Spacing.lg,
    },
});
