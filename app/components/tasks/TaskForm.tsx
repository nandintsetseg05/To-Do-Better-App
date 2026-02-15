import { Button } from '@/app/components/shared/Button';
import { Input } from '@/app/components/shared/Input';
import { ModalWrapper } from '@/app/components/shared/ModalWrapper';
import { Colors } from '@/app/constants/colors';
import { BorderRadius, Spacing } from '@/app/constants/spacing';
import { FontSize, FontWeight } from '@/app/constants/typography';
import type { Priority } from '@/app/stores/useAppStore';
import { Ionicons } from '@expo/vector-icons';
import { addDays, format } from 'date-fns';
import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

// ── Quick-pick due date presets ──
const DATE_PRESETS = [
    { label: 'Today', getDays: () => 0 },
    { label: 'Tomorrow', getDays: () => 1 },
    { label: 'Next week', getDays: () => 7 },
    { label: 'No date', getDays: () => -1 },
] as const;

interface TaskFormProps {
    visible: boolean;
    onClose: () => void;
    onSubmit: (data: TaskFormData) => void;
}

export interface TaskFormData {
    name: string;
    due_date: string | null;
    priority: Priority;
}

export const TaskForm: React.FC<TaskFormProps> = ({
    visible,
    onClose,
    onSubmit,
}) => {
    const [name, setName] = useState('');
    const [dueDateOffset, setDueDateOffset] = useState<number>(0); // 0=today, 1=tomorrow, 7=week, -1=none
    const [priority, setPriority] = useState<Priority>('medium');
    const [error, setError] = useState('');

    const resetForm = () => {
        setName('');
        setDueDateOffset(0);
        setPriority('medium');
        setError('');
    };

    const handleSubmit = () => {
        const trimmed = name.trim();
        if (!trimmed) {
            setError('Task name is required');
            return;
        }

        const due_date =
            dueDateOffset >= 0
                ? format(addDays(new Date(), dueDateOffset), 'yyyy-MM-dd')
                : null;

        onSubmit({
            name: trimmed,
            due_date,
            priority,
        });

        resetForm();
        onClose();
    };

    const dueDateLabel =
        dueDateOffset >= 0
            ? format(addDays(new Date(), dueDateOffset), 'EEE, MMM d')
            : 'No due date';

    return (
        <ModalWrapper visible={visible} onClose={onClose} title="New Task">
            {/* Name */}
            <Input
                label="What do you need to do?"
                placeholder="e.g. Buy groceries"
                value={name}
                onChangeText={(text) => {
                    setName(text);
                    if (error) setError('');
                }}
                error={error}
                leftIcon={
                    <Ionicons name="document-text-outline" size={20} color={Colors.textMuted} />
                }
            />

            {/* Due Date Quick Picks */}
            <Text style={styles.label}>Due date</Text>
            <Text style={styles.datePreview}>
                📅 {dueDateLabel}
            </Text>
            <View style={styles.presetRow}>
                {DATE_PRESETS.map((preset) => {
                    const days = preset.getDays();
                    return (
                        <TouchableOpacity
                            key={preset.label}
                            onPress={() => setDueDateOffset(days)}
                            style={[
                                styles.presetPill,
                                dueDateOffset === days && styles.presetPillActive,
                            ]}
                        >
                            <Text
                                style={[
                                    styles.presetText,
                                    dueDateOffset === days && styles.presetTextActive,
                                ]}
                            >
                                {preset.label}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>

            {/* Priority */}
            <Text style={styles.label}>Priority</Text>
            <View style={styles.priorityRow}>
                {(['low', 'medium', 'high'] as Priority[]).map((p) => {
                    const color =
                        p === 'high'
                            ? Colors.priorityHigh
                            : p === 'medium'
                                ? Colors.priorityMedium
                                : Colors.priorityLow;
                    const isActive = priority === p;

                    return (
                        <TouchableOpacity
                            key={p}
                            onPress={() => setPriority(p)}
                            style={[
                                styles.priorityPill,
                                isActive && {
                                    backgroundColor: color + '18',
                                    borderColor: color,
                                },
                            ]}
                        >
                            <View style={[styles.priorityDot, { backgroundColor: color }]} />
                            <Text
                                style={[
                                    styles.priorityText,
                                    isActive && { color, fontWeight: FontWeight.semibold },
                                ]}
                            >
                                {p.charAt(0).toUpperCase() + p.slice(1)}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>

            {/* Submit */}
            <View style={styles.submitContainer}>
                <Button
                    title="Create Task"
                    onPress={handleSubmit}
                    fullWidth
                    size="lg"
                    icon={<Ionicons name="add-circle" size={20} color={Colors.white} />}
                />
            </View>
        </ModalWrapper>
    );
};

const styles = StyleSheet.create({
    label: {
        fontSize: FontSize.sm,
        fontWeight: FontWeight.semibold,
        color: Colors.text,
        marginBottom: Spacing.sm,
        marginTop: Spacing.base,
    },

    datePreview: {
        fontSize: FontSize.base,
        color: Colors.textSecondary,
        marginBottom: Spacing.sm,
    },

    // ── Presets ──
    presetRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: Spacing.sm,
    },

    presetPill: {
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.sm,
        borderRadius: BorderRadius.full,
        borderWidth: 1.5,
        borderColor: Colors.border,
        backgroundColor: Colors.surface,
    },

    presetPillActive: {
        borderColor: Colors.primary,
        backgroundColor: Colors.primary + '12',
    },

    presetText: {
        fontSize: FontSize.sm,
        color: Colors.textSecondary,
    },

    presetTextActive: {
        color: Colors.primary,
        fontWeight: FontWeight.semibold,
    },

    // ── Priority ──
    priorityRow: {
        flexDirection: 'row',
        gap: Spacing.sm,
    },

    priorityPill: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.xs,
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.sm,
        borderRadius: BorderRadius.full,
        borderWidth: 1.5,
        borderColor: Colors.border,
        backgroundColor: Colors.surface,
    },

    priorityDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },

    priorityText: {
        fontSize: FontSize.sm,
        color: Colors.textSecondary,
    },

    // ── Submit ──
    submitContainer: {
        marginTop: Spacing.xl,
        paddingBottom: Spacing.base,
    },
});
