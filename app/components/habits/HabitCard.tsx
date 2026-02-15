import { Colors } from '@/app/constants/colors';
import { BorderRadius, Spacing } from '@/app/constants/spacing';
import { FontSize, FontWeight } from '@/app/constants/typography';
import type { Habit } from '@/app/stores/useAppStore';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import React from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSequence,
    withSpring,
    withTiming
} from 'react-native-reanimated';

interface HabitCardProps {
    habit: Habit;
    isCompletedToday: boolean;
    currentStreak: number;
    onToggleComplete: (habitId: string) => void;
    onPress: (habit: Habit) => void;
}

export const HabitCard: React.FC<HabitCardProps> = ({
    habit,
    isCompletedToday,
    currentStreak,
    onToggleComplete,
    onPress,
}) => {
    const scale = useSharedValue(1);
    const checkScale = useSharedValue(isCompletedToday ? 1 : 0);

    const cardAnimatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    const checkAnimatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: checkScale.value }],
        opacity: checkScale.value,
    }));

    const handleToggle = () => {
        Haptics.impactAsync(
            isCompletedToday
                ? Haptics.ImpactFeedbackStyle.Light
                : Haptics.ImpactFeedbackStyle.Medium
        );

        // Bounce animation
        scale.value = withSequence(
            withSpring(0.95, { damping: 15 }),
            withSpring(1, { damping: 10 })
        );

        // Checkmark animation
        checkScale.value = isCompletedToday
            ? withTiming(0, { duration: 200 })
            : withSpring(1, { damping: 12, stiffness: 150 });

        onToggleComplete(habit.id);
    };

    const priorityColor =
        habit.priority === 'high'
            ? Colors.priorityHigh
            : habit.priority === 'medium'
                ? Colors.priorityMedium
                : Colors.priorityLow;

    const streakColor =
        currentStreak >= 100
            ? Colors.streakPlatinum
            : currentStreak >= 30
                ? Colors.streakGold
                : currentStreak >= 7
                    ? Colors.streakFire
                    : Colors.textMuted;

    return (
        <Animated.View style={[styles.container, cardAnimatedStyle]}>
            <TouchableOpacity
                onPress={() => onPress(habit)}
                activeOpacity={0.85}
                style={[
                    styles.card,
                    isCompletedToday && styles.cardCompleted,
                ]}
                accessibilityLabel={`${habit.name}, ${isCompletedToday ? 'completed' : 'not completed'}`}
                accessibilityRole="button"
            >
                {/* Priority indicator */}
                <View style={[styles.priorityBar, { backgroundColor: priorityColor }]} />

                {/* Content */}
                <View style={styles.content}>
                    {/* Emoji + Name */}
                    <View style={styles.titleRow}>
                        <Text style={styles.emoji}>{habit.emoji}</Text>
                        <View style={styles.titleContent}>
                            <Text
                                style={[
                                    styles.name,
                                    isCompletedToday && styles.nameCompleted,
                                ]}
                                numberOfLines={1}
                            >
                                {habit.name}
                            </Text>

                            {/* Streak badge */}
                            {currentStreak > 0 && (
                                <View style={[styles.streakBadge, { backgroundColor: streakColor + '18' }]}>
                                    <Text style={[styles.streakText, { color: streakColor }]}>
                                        🔥 {currentStreak} day{currentStreak !== 1 ? 's' : ''}
                                    </Text>
                                </View>
                            )}
                        </View>
                    </View>

                    {/* Recurrence info */}
                    <Text style={styles.recurrenceText}>
                        {formatRecurrence(habit)}
                    </Text>
                </View>

                {/* Completion toggle */}
                <TouchableOpacity
                    onPress={handleToggle}
                    style={[
                        styles.checkButton,
                        isCompletedToday && styles.checkButtonActive,
                    ]}
                    accessibilityLabel={isCompletedToday ? 'Mark as incomplete' : 'Mark as complete'}
                    accessibilityRole="checkbox"
                    accessibilityState={{ checked: isCompletedToday }}
                    hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                >
                    {isCompletedToday ? (
                        <Animated.View style={checkAnimatedStyle}>
                            <Ionicons name="checkmark" size={18} color={Colors.white} />
                        </Animated.View>
                    ) : (
                        <View style={styles.checkEmpty} />
                    )}
                </TouchableOpacity>
            </TouchableOpacity>
        </Animated.View>
    );
};

function formatRecurrence(habit: Habit): string {
    if (habit.recurrence_type === 'daily') return 'Every day';
    if (habit.recurrence_type === 'weekly') {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        return habit.recurrence_days.map((d) => days[d]).join(', ');
    }
    return 'Custom';
}

const styles = StyleSheet.create({
    container: {
        marginHorizontal: Spacing.base,
        marginBottom: Spacing.sm,
    },

    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.surface,
        borderRadius: BorderRadius.xl,
        padding: Spacing.md,
        borderWidth: 1,
        borderColor: Colors.border,
        shadowColor: Colors.black,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.04,
        shadowRadius: 4,
        elevation: 2,
        overflow: 'hidden',
    },

    cardCompleted: {
        backgroundColor: Colors.successLight + '30',
        borderColor: Colors.success + '40',
    },

    priorityBar: {
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        width: 4,
        borderTopLeftRadius: BorderRadius.xl,
        borderBottomLeftRadius: BorderRadius.xl,
    },

    content: {
        flex: 1,
        paddingLeft: Spacing.sm,
    },

    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm,
    },

    emoji: {
        fontSize: 24,
    },

    titleContent: {
        flex: 1,
        gap: Spacing.xxs,
    },

    name: {
        fontSize: FontSize.base,
        fontWeight: FontWeight.semibold,
        color: Colors.text,
    },

    nameCompleted: {
        textDecorationLine: 'line-through',
        color: Colors.textSecondary,
    },

    streakBadge: {
        alignSelf: 'flex-start',
        paddingHorizontal: Spacing.sm,
        paddingVertical: 2,
        borderRadius: BorderRadius.full,
    },

    streakText: {
        fontSize: FontSize.xs,
        fontWeight: FontWeight.semibold,
    },

    recurrenceText: {
        fontSize: FontSize.xs,
        color: Colors.textMuted,
        marginTop: Spacing.xxs,
        paddingLeft: 32 + Spacing.sm, // emoji width + gap
    },

    // ── Checkbox ──
    checkButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        borderWidth: 2,
        borderColor: Colors.border,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: Spacing.sm,
    },

    checkButtonActive: {
        backgroundColor: Colors.success,
        borderColor: Colors.success,
    },

    checkEmpty: {
        width: 12,
        height: 12,
        borderRadius: 6,
    },
});
