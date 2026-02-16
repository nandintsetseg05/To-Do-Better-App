import { BorderRadius, Spacing } from '@/app/constants/spacing';
import { FontSize, FontWeight } from '@/app/constants/typography';
import { useColors } from '@/app/constants/useColors';
import { geminiService, type HabitContext } from '@/app/services/gemini';
import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useEffect, useState } from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

interface MotivationCardProps {
    context: HabitContext;
}

/**
 * AI-powered motivational message card.
 * Fetches a contextual message from Gemini 2.0 Flash and displays it
 * with a gradient-like background and refresh button.
 */
export const MotivationCard: React.FC<MotivationCardProps> = ({ context }) => {
    const colors = useColors();
    const [message, setMessage] = useState<string>('');
    const [isLoading, setIsLoading] = useState(true);

    const fetchMessage = useCallback(async () => {
        setIsLoading(true);
        const msg = await geminiService.getMotivation(context);
        setMessage(msg);
        setIsLoading(false);
    }, [context.completedToday, context.totalHabits, context.currentStreak]);

    useEffect(() => {
        fetchMessage();
    }, []);

    const handleRefresh = () => {
        fetchMessage();
    };

    if (!message && isLoading) {
        return (
            <View style={[styles.card, { backgroundColor: colors.secondary + '08', borderColor: colors.secondary + '20' }]}>
                <View style={styles.shimmer}>
                    <View style={[styles.shimmerLine, { backgroundColor: colors.secondary + '15' }]} />
                    <View style={[styles.shimmerLine, { backgroundColor: colors.secondary + '15', width: '60%' }]} />
                </View>
            </View>
        );
    }

    return (
        <Animated.View
            entering={FadeIn.duration(500)}
            style={[styles.card, { backgroundColor: colors.secondary + '08', borderColor: colors.secondary + '20' }]}
        >
            <View style={styles.content}>
                <View style={styles.iconContainer}>
                    <Ionicons name="sparkles" size={20} color={colors.secondary} />
                </View>
                <Text style={[styles.message, { color: colors.text }]}>{message}</Text>
            </View>
            <TouchableOpacity
                onPress={handleRefresh}
                style={styles.refreshButton}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                accessibilityLabel="Get a new motivational message"
            >
                <Ionicons
                    name="refresh"
                    size={16}
                    color={colors.textMuted}
                />
            </TouchableOpacity>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    card: {
        marginHorizontal: Spacing.lg,
        marginBottom: Spacing.base,
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.md,
        borderRadius: BorderRadius.lg,
        borderWidth: 1,
        flexDirection: 'row',
        alignItems: 'flex-start',
    },

    content: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: Spacing.sm,
    },

    iconContainer: {
        marginTop: 1,
    },

    message: {
        flex: 1,
        fontSize: FontSize.base,
        fontWeight: FontWeight.medium,
        lineHeight: 22,
    },

    refreshButton: {
        padding: Spacing.xs,
        marginLeft: Spacing.sm,
    },

    // ── Loading shimmer ──
    shimmer: {
        flex: 1,
        gap: Spacing.sm,
        paddingVertical: Spacing.xs,
    },

    shimmerLine: {
        height: 12,
        borderRadius: 6,
        width: '90%',
    },
});
