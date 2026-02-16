import { BorderRadius, Spacing } from '@/app/constants/spacing';
import { FontSize, FontWeight } from '@/app/constants/typography';
import { useColors } from '@/app/constants/useColors';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    FlatList,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const HOURS = Array.from({ length: 24 }, (_, i) => i);
const MINUTES = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];

interface TimePickerProps {
    value: string | null;        // "HH:mm" or null
    onChange: (time: string | null) => void;
    label?: string;
}

/**
 * A simple time picker that shows hour/minute selection in a modal.
 * Displays the selected time as a tappable pill, or "No reminder" if null.
 */
export const TimePicker: React.FC<TimePickerProps> = ({
    value,
    onChange,
    label = 'Reminder time',
}) => {
    const colors = useColors();
    const [showPicker, setShowPicker] = useState(false);
    const [selectedHour, setSelectedHour] = useState(
        value ? parseInt(value.split(':')[0], 10) : 9
    );
    const [selectedMinute, setSelectedMinute] = useState(
        value ? parseInt(value.split(':')[1], 10) : 0
    );

    const formatTime = (h: number, m: number) => {
        const period = h >= 12 ? 'PM' : 'AM';
        const displayHour = h === 0 ? 12 : h > 12 ? h - 12 : h;
        return `${displayHour}:${m.toString().padStart(2, '0')} ${period}`;
    };

    const formatHH_mm = (h: number, m: number) =>
        `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;

    const handleConfirm = () => {
        onChange(formatHH_mm(selectedHour, selectedMinute));
        setShowPicker(false);
    };

    const handleClear = () => {
        onChange(null);
        setShowPicker(false);
    };

    return (
        <View>
            <Text style={[styles.label, { color: colors.text }]}>{label}</Text>

            <TouchableOpacity
                onPress={() => setShowPicker(true)}
                style={[
                    styles.pill,
                    { borderColor: colors.border, backgroundColor: colors.surface },
                    value !== null && { borderColor: colors.primary, backgroundColor: colors.primary + '08' },
                ]}
                accessibilityRole="button"
                accessibilityLabel={`Set reminder time, currently ${value ? formatTime(selectedHour, selectedMinute) : 'not set'}`}
            >
                <Ionicons
                    name={value ? 'notifications' : 'notifications-outline'}
                    size={18}
                    color={value ? colors.primary : colors.textMuted}
                />
                <Text style={[
                    styles.pillText,
                    { color: colors.textSecondary },
                    value !== null && { color: colors.text, fontWeight: FontWeight.medium },
                ]}>
                    {value ? `🔔 ${formatTime(selectedHour, selectedMinute)}` : 'No reminder'}
                </Text>
                <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
            </TouchableOpacity>

            {/* Picker Modal */}
            <Modal
                visible={showPicker}
                transparent
                animationType="slide"
                onRequestClose={() => setShowPicker(false)}
            >
                <View style={styles.overlay}>
                    <TouchableOpacity
                        style={[styles.backdrop, { backgroundColor: colors.overlay }]}
                        activeOpacity={1}
                        onPress={() => setShowPicker(false)}
                    />
                    <View style={[styles.sheet, { backgroundColor: colors.surface }]}>
                        {/* Header */}
                        <View style={[styles.sheetHeader, { borderBottomColor: colors.border }]}>
                            <TouchableOpacity onPress={handleClear}>
                                <Text style={[styles.clearButton, { color: colors.error }]}>No reminder</Text>
                            </TouchableOpacity>
                            <Text style={[styles.sheetTitle, { color: colors.text }]}>Set Time</Text>
                            <TouchableOpacity onPress={handleConfirm}>
                                <Text style={[styles.doneButton, { color: colors.primary }]}>Done</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Preview */}
                        <Text style={[styles.preview, { color: colors.primary }]}>
                            {formatTime(selectedHour, selectedMinute)}
                        </Text>

                        {/* Hour + Minute columns */}
                        <View style={styles.columns}>
                            {/* Hours */}
                            <View style={styles.column}>
                                <Text style={[styles.columnLabel, { color: colors.textMuted }]}>Hour</Text>
                                <FlatList
                                    data={HOURS}
                                    keyExtractor={(item) => `h-${item}`}
                                    showsVerticalScrollIndicator={false}
                                    style={styles.scrollColumn}
                                    renderItem={({ item: h }) => (
                                        <TouchableOpacity
                                            onPress={() => setSelectedHour(h)}
                                            style={[
                                                styles.timeCell,
                                                selectedHour === h && { backgroundColor: colors.primary + '15' },
                                            ]}
                                        >
                                            <Text
                                                style={[
                                                    styles.timeCellText,
                                                    { color: colors.textSecondary },
                                                    selectedHour === h && { color: colors.primary, fontWeight: FontWeight.bold },
                                                ]}
                                            >
                                                {h === 0 ? '12 AM' : h < 12 ? `${h} AM` : h === 12 ? '12 PM' : `${h - 12} PM`}
                                            </Text>
                                        </TouchableOpacity>
                                    )}
                                />
                            </View>

                            {/* Minutes */}
                            <View style={styles.column}>
                                <Text style={[styles.columnLabel, { color: colors.textMuted }]}>Minute</Text>
                                <FlatList
                                    data={MINUTES}
                                    keyExtractor={(item) => `m-${item}`}
                                    showsVerticalScrollIndicator={false}
                                    style={styles.scrollColumn}
                                    renderItem={({ item: m }) => (
                                        <TouchableOpacity
                                            onPress={() => setSelectedMinute(m)}
                                            style={[
                                                styles.timeCell,
                                                selectedMinute === m && { backgroundColor: colors.primary + '15' },
                                            ]}
                                        >
                                            <Text
                                                style={[
                                                    styles.timeCellText,
                                                    { color: colors.textSecondary },
                                                    selectedMinute === m && { color: colors.primary, fontWeight: FontWeight.bold },
                                                ]}
                                            >
                                                :{m.toString().padStart(2, '0')}
                                            </Text>
                                        </TouchableOpacity>
                                    )}
                                />
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    label: {
        fontSize: FontSize.sm,
        fontWeight: FontWeight.semibold,
        marginBottom: Spacing.sm,
        marginTop: Spacing.base,
    },

    pill: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm,
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.md,
        borderRadius: BorderRadius.lg,
        borderWidth: 1.5,
    },

    pillText: {
        flex: 1,
        fontSize: FontSize.base,
    },

    // ── Modal ──
    overlay: {
        flex: 1,
        justifyContent: 'flex-end',
    },

    backdrop: {
        ...StyleSheet.absoluteFillObject,
    },

    sheet: {
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingBottom: Spacing['2xl'],
        maxHeight: '65%',
    },

    sheetHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: Spacing.lg,
        paddingVertical: Spacing.md,
        borderBottomWidth: 1,
    },

    sheetTitle: {
        fontSize: FontSize.base,
        fontWeight: FontWeight.semibold,
    },

    clearButton: {
        fontSize: FontSize.sm,
        fontWeight: FontWeight.medium,
    },

    doneButton: {
        fontSize: FontSize.sm,
        fontWeight: FontWeight.bold,
    },

    preview: {
        fontSize: FontSize['3xl'],
        fontWeight: FontWeight.bold,
        textAlign: 'center',
        paddingVertical: Spacing.md,
    },

    // ── Columns ──
    columns: {
        flexDirection: 'row',
        paddingHorizontal: Spacing.lg,
        gap: Spacing.md,
    },

    column: {
        flex: 1,
    },

    columnLabel: {
        fontSize: FontSize.xs,
        fontWeight: FontWeight.semibold,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: Spacing.sm,
        textAlign: 'center',
    },

    scrollColumn: {
        maxHeight: 200,
    },

    timeCell: {
        paddingVertical: Spacing.sm,
        paddingHorizontal: Spacing.md,
        borderRadius: BorderRadius.md,
        alignItems: 'center',
        marginBottom: 2,
    },

    timeCellText: {
        fontSize: FontSize.base,
    },
});
