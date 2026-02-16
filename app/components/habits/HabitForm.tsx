import { Button } from '@/app/components/shared/Button';
import { Input } from '@/app/components/shared/Input';
import { ModalWrapper } from '@/app/components/shared/ModalWrapper';
import { TimePicker } from '@/app/components/shared/TimePicker';
import { BorderRadius, Spacing } from '@/app/constants/spacing';
import { FontSize, FontWeight } from '@/app/constants/typography';
import { useColors } from '@/app/constants/useColors';
import type { Priority, RecurrenceType } from '@/app/stores/useAppStore';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

// ── Popular emoji choices ──
const EMOJI_OPTIONS = ['💪', '📚', '🏃', '💧', '🧘', '✍️', '🎸', '💤', '🍎', '🧹', '💊', '🎯'];

const DAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

interface HabitFormProps {
    visible: boolean;
    onClose: () => void;
    onSubmit: (data: HabitFormData) => void;
}

export interface HabitFormData {
    name: string;
    emoji: string;
    recurrence_type: RecurrenceType;
    recurrence_days: number[];
    reminder_time: string | null;
    priority: Priority;
}

export const HabitForm: React.FC<HabitFormProps> = ({
    visible,
    onClose,
    onSubmit,
}) => {
    const colors = useColors();
    const [name, setName] = useState('');
    const [emoji, setEmoji] = useState('💪');
    const [recurrenceType, setRecurrenceType] = useState<RecurrenceType>('daily');
    const [recurrenceDays, setRecurrenceDays] = useState<number[]>([0, 1, 2, 3, 4, 5, 6]);
    const [priority, setPriority] = useState<Priority>('medium');
    const [reminderTime, setReminderTime] = useState<string | null>(null);
    const [error, setError] = useState('');

    const resetForm = () => {
        setName('');
        setEmoji('💪');
        setRecurrenceType('daily');
        setRecurrenceDays([0, 1, 2, 3, 4, 5, 6]);
        setPriority('medium');
        setReminderTime(null);
        setError('');
    };

    const handleSubmit = () => {
        const trimmed = name.trim();
        if (!trimmed) {
            setError('Habit name is required');
            return;
        }
        if (recurrenceType === 'weekly' && recurrenceDays.length === 0) {
            setError('Select at least one day');
            return;
        }

        onSubmit({
            name: trimmed,
            emoji,
            recurrence_type: recurrenceType,
            recurrence_days:
                recurrenceType === 'daily' ? [0, 1, 2, 3, 4, 5, 6] : recurrenceDays,
            reminder_time: reminderTime,
            priority,
        });

        resetForm();
        onClose();
    };

    const toggleDay = (day: number) => {
        setRecurrenceDays((prev) =>
            prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
        );
    };

    return (
        <ModalWrapper visible={visible} onClose={onClose} title="New Habit">
            {/* Emoji Picker */}
            <Text style={[styles.label, { color: colors.text }]}>Choose an emoji</Text>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.emojiRow}
            >
                {EMOJI_OPTIONS.map((e) => (
                    <TouchableOpacity
                        key={e}
                        onPress={() => setEmoji(e)}
                        style={[
                            styles.emojiButton,
                            { backgroundColor: colors.background },
                            emoji === e && { borderColor: colors.primary, backgroundColor: colors.primary + '10' },
                        ]}
                    >
                        <Text style={styles.emojiText}>{e}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {/* Name */}
            <Input
                label="Habit name"
                placeholder="e.g. Drink 8 glasses of water"
                value={name}
                onChangeText={(text) => {
                    setName(text);
                    if (error) setError('');
                }}
                error={error}
                leftIcon={<Text style={{ fontSize: 20 }}>{emoji}</Text>}
            />

            {/* Recurrence */}
            <Text style={[styles.label, { color: colors.text }]}>Repeat</Text>
            <View style={styles.toggleRow}>
                <TogglePill
                    label="Every day"
                    active={recurrenceType === 'daily'}
                    onPress={() => setRecurrenceType('daily')}
                    colors={colors}
                />
                <TogglePill
                    label="Specific days"
                    active={recurrenceType === 'weekly'}
                    onPress={() => setRecurrenceType('weekly')}
                    colors={colors}
                />
            </View>

            {recurrenceType === 'weekly' && (
                <View style={styles.daysRow}>
                    {DAY_LABELS.map((label, index) => (
                        <TouchableOpacity
                            key={index}
                            onPress={() => toggleDay(index)}
                            style={[
                                styles.dayButton,
                                { backgroundColor: colors.background, borderColor: colors.border },
                                recurrenceDays.includes(index) && { backgroundColor: colors.primary, borderColor: colors.primary },
                            ]}
                        >
                            <Text
                                style={[
                                    styles.dayLabel,
                                    { color: colors.textSecondary },
                                    recurrenceDays.includes(index) && { color: colors.white },
                                ]}
                            >
                                {label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            )}

            {/* Priority */}
            <Text style={[styles.label, { color: colors.text }]}>Priority</Text>
            <View style={styles.toggleRow}>
                <TogglePill
                    label="Low"
                    active={priority === 'low'}
                    onPress={() => setPriority('low')}
                    color={colors.priorityLow}
                    colors={colors}
                />
                <TogglePill
                    label="Medium"
                    active={priority === 'medium'}
                    onPress={() => setPriority('medium')}
                    color={colors.priorityMedium}
                    colors={colors}
                />
                <TogglePill
                    label="High"
                    active={priority === 'high'}
                    onPress={() => setPriority('high')}
                    color={colors.priorityHigh}
                    colors={colors}
                />
            </View>

            {/* Reminder Time */}
            <TimePicker
                value={reminderTime}
                onChange={setReminderTime}
                label="Reminder"
            />

            {/* Submit */}
            <View style={styles.submitContainer}>
                <Button
                    title="Create Habit"
                    onPress={handleSubmit}
                    fullWidth
                    size="lg"
                    icon={<Ionicons name="add-circle" size={20} color={colors.white} />}
                />
            </View>
        </ModalWrapper>
    );
};

// ── Reusable toggle pill ──
function TogglePill({
    label,
    active,
    onPress,
    color,
    colors,
}: {
    label: string;
    active: boolean;
    onPress: () => void;
    color?: string;
    colors: ReturnType<typeof useColors>;
}) {
    const activeColor = color || colors.primary;

    return (
        <TouchableOpacity
            onPress={onPress}
            style={[
                styles.pill,
                { borderColor: colors.border, backgroundColor: colors.surface },
                active && { backgroundColor: activeColor + '18', borderColor: activeColor },
            ]}
        >
            <Text
                style={[
                    styles.pillText,
                    { color: colors.textSecondary },
                    active && { color: activeColor, fontWeight: FontWeight.semibold },
                ]}
            >
                {label}
            </Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    label: {
        fontSize: FontSize.sm,
        fontWeight: FontWeight.semibold,
        marginBottom: Spacing.sm,
        marginTop: Spacing.base,
    },

    // ── Emoji ──
    emojiRow: {
        flexDirection: 'row',
        gap: Spacing.sm,
        paddingBottom: Spacing.sm,
    },

    emojiButton: {
        width: 44,
        height: 44,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: 'transparent',
    },

    emojiText: {
        fontSize: 22,
    },

    // ── Toggles ──
    toggleRow: {
        flexDirection: 'row',
        gap: Spacing.sm,
    },

    pill: {
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.sm,
        borderRadius: BorderRadius.full,
        borderWidth: 1.5,
    },

    pillText: {
        fontSize: FontSize.sm,
    },

    // ── Days ──
    daysRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: Spacing.sm,
    },

    dayButton: {
        width: 38,
        height: 38,
        borderRadius: 19,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1.5,
    },

    dayLabel: {
        fontSize: FontSize.sm,
        fontWeight: FontWeight.medium,
    },

    // ── Submit ──
    submitContainer: {
        marginTop: Spacing.xl,
        paddingBottom: Spacing.base,
    },
});
