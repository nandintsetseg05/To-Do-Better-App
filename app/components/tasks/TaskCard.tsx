import { BorderRadius, Spacing } from '@/app/constants/spacing';
import { FontSize, FontWeight } from '@/app/constants/typography';
import { useColors } from '@/app/constants/useColors';
import type { OneTimeTask } from '@/app/stores/useAppStore';
import { Ionicons } from '@expo/vector-icons';
import { format, isPast, isToday, isTomorrow, parseISO } from 'date-fns';
import * as Haptics from 'expo-haptics';
import React from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import Animated, {
    FadeOut,
    Layout,
    useAnimatedStyle,
    useSharedValue,
    withSequence,
    withSpring
} from 'react-native-reanimated';

interface TaskCardProps {
    task: OneTimeTask;
    onToggleComplete: (taskId: string) => void;
    onPress: (task: OneTimeTask) => void;
    onDelete: (taskId: string) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
    task,
    onToggleComplete,
    onPress,
    onDelete,
}) => {
    const colors = useColors();
    const scale = useSharedValue(1);

    const cardAnimatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    const handleToggle = () => {
        Haptics.impactAsync(
            task.is_completed
                ? Haptics.ImpactFeedbackStyle.Light
                : Haptics.ImpactFeedbackStyle.Medium
        );

        scale.value = withSequence(
            withSpring(0.97, { damping: 15 }),
            withSpring(1, { damping: 10 })
        );

        onToggleComplete(task.id);
    };

    const priorityColor =
        task.priority === 'high'
            ? colors.priorityHigh
            : task.priority === 'medium'
                ? colors.priorityMedium
                : colors.priorityLow;

    const dueDateInfo = task.due_date ? getDueDateInfo(task.due_date) : null;

    return (
        <Animated.View
            style={[styles.container, cardAnimatedStyle]}
            layout={Layout.springify()}
            exiting={FadeOut.duration(200)}
        >
            <TouchableOpacity
                onPress={() => onPress(task)}
                activeOpacity={0.85}
                style={[
                    styles.card,
                    { backgroundColor: colors.surface, borderColor: colors.border },
                    task.is_completed && styles.cardCompleted,
                ]}
                accessibilityLabel={`${task.name}, ${task.is_completed ? 'completed' : 'pending'}`}
                accessibilityRole="button"
            >
                {/* Checkbox */}
                <TouchableOpacity
                    onPress={handleToggle}
                    style={[
                        styles.checkbox,
                        { borderColor: colors.border },
                        task.is_completed && { backgroundColor: colors.success, borderColor: colors.success },
                        !task.is_completed && { borderColor: priorityColor },
                    ]}
                    accessibilityLabel={task.is_completed ? 'Uncheck task' : 'Complete task'}
                    accessibilityRole="checkbox"
                    accessibilityState={{ checked: task.is_completed }}
                    hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                >
                    {task.is_completed && (
                        <Ionicons name="checkmark" size={14} color={colors.white} />
                    )}
                </TouchableOpacity>

                {/* Content */}
                <View style={styles.content}>
                    <Text
                        style={[
                            styles.name,
                            { color: colors.text },
                            task.is_completed && { textDecorationLine: 'line-through' as const, color: colors.textSecondary },
                        ]}
                        numberOfLines={2}
                    >
                        {task.name}
                    </Text>

                    {dueDateInfo && (
                        <View style={styles.dueRow}>
                            <Ionicons
                                name="time-outline"
                                size={12}
                                color={dueDateInfo.isOverdue ? colors.error : colors.textMuted}
                            />
                            <Text
                                style={[
                                    styles.dueText,
                                    { color: colors.textMuted },
                                    dueDateInfo.isOverdue && { color: colors.error, fontWeight: FontWeight.semibold },
                                ]}
                            >
                                {dueDateInfo.label}
                            </Text>
                        </View>
                    )}
                </View>

                {/* Delete button */}
                <TouchableOpacity
                    onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        onDelete(task.id);
                    }}
                    style={styles.deleteButton}
                    accessibilityLabel="Delete task"
                    accessibilityRole="button"
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                    <Ionicons name="trash-outline" size={18} color={colors.textMuted} />
                </TouchableOpacity>
            </TouchableOpacity>
        </Animated.View>
    );
};

function getDueDateInfo(dueDateStr: string): { label: string; isOverdue: boolean } {
    const date = parseISO(dueDateStr);

    if (isToday(date)) return { label: 'Today', isOverdue: false };
    if (isTomorrow(date)) return { label: 'Tomorrow', isOverdue: false };

    const overdue = isPast(date) && !isToday(date);
    const label = overdue
        ? `Overdue · ${format(date, 'MMM d')}`
        : format(date, 'MMM d');

    return { label, isOverdue: overdue };
}

const styles = StyleSheet.create({
    container: {
        marginHorizontal: Spacing.base,
        marginBottom: Spacing.sm,
    },

    card: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: BorderRadius.lg,
        padding: Spacing.md,
        borderWidth: 1,
        gap: Spacing.md,
    },

    cardCompleted: {
        opacity: 0.65,
    },

    // ── Checkbox ──
    checkbox: {
        width: 24,
        height: 24,
        borderRadius: 6,
        borderWidth: 2,
        alignItems: 'center',
        justifyContent: 'center',
    },

    // ── Content ──
    content: {
        flex: 1,
    },

    name: {
        fontSize: FontSize.base,
        fontWeight: FontWeight.medium,
    },

    dueRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginTop: Spacing.xxs,
    },

    dueText: {
        fontSize: FontSize.xs,
    },

    // ── Delete ──
    deleteButton: {
        padding: Spacing.xs,
    },
});
