import { Colors } from '@/app/constants/colors';
import { BorderRadius, Spacing } from '@/app/constants/spacing';
import { FontSize, FontWeight } from '@/app/constants/typography';
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
            <View style={styles.card}>
                <View style={styles.shimmer}>
                    <View style={styles.shimmerLine} />
                    <View style={[styles.shimmerLine, { width: '60%' }]} />
                </View>
            </View>
        );
    }

    return (
        <Animated.View
            entering={FadeIn.duration(500)}
            style={styles.card}
        >
            <View style={styles.content}>
                <View style={styles.iconContainer}>
                    <Ionicons name="sparkles" size={20} color={Colors.secondary} />
                </View>
                <Text style={styles.message}>{message}</Text>
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
                    color={Colors.textMuted}
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
        backgroundColor: Colors.secondary + '08',
        borderWidth: 1,
        borderColor: Colors.secondary + '20',
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
        color: Colors.text,
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
        backgroundColor: Colors.secondary + '15',
        width: '90%',
    },
});
