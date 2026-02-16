import { Spacing } from '@/app/constants/spacing';
import { FontWeight } from '@/app/constants/typography';
import { useColors } from '@/app/constants/useColors';
import type { Completion } from '@/app/stores/useAppStore';
import {
    getCompletionCountsByDate,
    getIntensityLevel,
} from '@/app/utils/streakEngine';
import { format, getDay, subDays } from 'date-fns';
import React, { useMemo } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';

const CELL_SIZE = 14;
const CELL_GAP = 3;
const WEEKS_TO_SHOW = 20; // ~5 months

const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAY_LABELS = ['', 'Mon', '', 'Wed', '', 'Fri', ''];

interface HeatmapGridProps {
    completions: Completion[];
    totalDays?: number;
}

export const HeatmapGrid: React.FC<HeatmapGridProps> = ({
    completions,
    totalDays = WEEKS_TO_SHOW * 7,
}) => {
    const colors = useColors();

    const intensityColors = useMemo(() => [
        colors.heatmapEmpty,
        colors.heatmapLevel1,
        colors.heatmapLevel2,
        colors.heatmapLevel3,
        colors.heatmapLevel4,
    ], [colors]);

    const { grid, monthHeaders } = useMemo(() => {
        const counts = getCompletionCountsByDate(completions, totalDays);
        const today = new Date();

        // Build a grid of weeks (columns) × 7 days (rows)
        const weeks: { date: Date; count: number; dateStr: string }[][] = [];
        const firstDay = subDays(today, totalDays - 1);

        // Align to start of week (Sunday)
        const startDayOfWeek = getDay(firstDay);
        const alignedStart = subDays(firstDay, startDayOfWeek);
        const totalCells = totalDays + startDayOfWeek;
        const numWeeks = Math.ceil(totalCells / 7);

        for (let w = 0; w < numWeeks; w++) {
            const week: { date: Date; count: number; dateStr: string }[] = [];
            for (let d = 0; d < 7; d++) {
                const dayOffset = w * 7 + d;
                const date = subDays(today, totalCells - 1 - dayOffset);
                const dateStr = format(date, 'yyyy-MM-dd');
                const count = counts.get(dateStr) ?? 0;
                week.push({ date, count, dateStr });
            }
            weeks.push(week);
        }

        // Calculate month header positions
        const headers: { label: string; weekIndex: number }[] = [];
        let lastMonth = -1;
        for (let w = 0; w < weeks.length; w++) {
            const month = weeks[w][0].date.getMonth();
            if (month !== lastMonth) {
                headers.push({ label: MONTH_LABELS[month], weekIndex: w });
                lastMonth = month;
            }
        }

        return { grid: weeks, monthHeaders: headers };
    }, [completions, totalDays]);

    return (
        <View style={styles.container}>
            {/* Day labels */}
            <View style={styles.dayLabels}>
                {DAY_LABELS.map((label, i) => (
                    <Text key={i} style={[styles.dayLabel, { color: colors.textMuted }]}>
                        {label}
                    </Text>
                ))}
            </View>

            {/* Scrollable grid */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                <View>
                    {/* Month headers */}
                    <View style={styles.monthRow}>
                        {monthHeaders.map((header, i) => (
                            <Text
                                key={i}
                                style={[
                                    styles.monthLabel,
                                    { left: header.weekIndex * (CELL_SIZE + CELL_GAP), color: colors.textMuted },
                                ]}
                            >
                                {header.label}
                            </Text>
                        ))}
                    </View>

                    {/* Grid */}
                    <View style={styles.grid}>
                        {grid.map((week, wi) => (
                            <View key={wi} style={styles.weekColumn}>
                                {week.map((day, di) => {
                                    const level = getIntensityLevel(day.count);
                                    return (
                                        <View
                                            key={day.dateStr}
                                            style={[
                                                styles.cell,
                                                { backgroundColor: intensityColors[level] },
                                            ]}
                                            accessibilityLabel={`${format(day.date, 'MMM d')}: ${day.count} completion${day.count !== 1 ? 's' : ''}`}
                                        />
                                    );
                                })}
                            </View>
                        ))}
                    </View>
                </View>
            </ScrollView>

            {/* Legend */}
            <View style={styles.legend}>
                <Text style={[styles.legendText, { color: colors.textMuted }]}>Less</Text>
                {intensityColors.map((color, i) => (
                    <View
                        key={i}
                        style={[styles.legendCell, { backgroundColor: color }]}
                    />
                ))}
                <Text style={[styles.legendText, { color: colors.textMuted }]}>More</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingVertical: Spacing.sm,
    },

    dayLabels: {
        position: 'absolute',
        left: 0,
        top: 24,
        zIndex: 1,
    },

    dayLabel: {
        fontSize: 9,
        height: CELL_SIZE + CELL_GAP,
        lineHeight: CELL_SIZE,
        width: 28,
        textAlign: 'right',
        paddingRight: Spacing.xs,
    },

    scrollContent: {
        paddingLeft: 32,
    },

    monthRow: {
        height: 16,
        position: 'relative',
        marginBottom: 4,
    },

    monthLabel: {
        position: 'absolute',
        fontSize: 9,
        fontWeight: FontWeight.medium,
    },

    grid: {
        flexDirection: 'row',
        gap: CELL_GAP,
    },

    weekColumn: {
        gap: CELL_GAP,
    },

    cell: {
        width: CELL_SIZE,
        height: CELL_SIZE,
        borderRadius: 3,
    },

    legend: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        gap: 4,
        marginTop: Spacing.sm,
        paddingRight: Spacing.sm,
    },

    legendText: {
        fontSize: 9,
    },

    legendCell: {
        width: CELL_SIZE,
        height: CELL_SIZE,
        borderRadius: 3,
    },
});
