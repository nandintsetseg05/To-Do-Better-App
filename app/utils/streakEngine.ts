import type { Completion, Habit } from '@/app/stores/useAppStore';
import {
    differenceInCalendarDays,
    format,
    parseISO,
    startOfDay,
    subDays
} from 'date-fns';

/**
 * StreakEngine — calculates current and longest streaks for a habit.
 *
 * Algorithm:
 * 1. Sort completions by date descending
 * 2. Walk backwards from today
 * 3. For each day, check if habit was due (based on recurrence) AND completed
 * 4. Streak breaks when a due day is missed
 *
 * See TO_DO_BETTER_BRAIN.md §6.2 for specification.
 */
export function calculateStreak(
    habit: Habit,
    completions: Completion[]
): { current: number; longest: number; lastCompletedDate: string | null } {
    if (completions.length === 0) {
        return { current: 0, longest: 0, lastCompletedDate: null };
    }

    // Parse and sort completion dates (most recent first)
    const completionDates = completions
        .map((c) => startOfDay(new Date(c.completed_at)))
        .sort((a, b) => b.getTime() - a.getTime());

    // Build a set of completion date strings for O(1) lookup
    const completedSet = new Set(
        completionDates.map((d) => format(d, 'yyyy-MM-dd'))
    );

    const today = startOfDay(new Date());
    const lastCompleted = completionDates[0];
    const lastCompletedDate = format(lastCompleted, 'yyyy-MM-dd');

    // Calculate current streak
    let currentStreak = 0;
    let checkDate = today;

    // If today isn't completed yet but yesterday was, start from yesterday
    const todayStr = format(today, 'yyyy-MM-dd');
    if (!completedSet.has(todayStr)) {
        const yesterday = subDays(today, 1);
        const yesterdayStr = format(yesterday, 'yyyy-MM-dd');
        if (completedSet.has(yesterdayStr)) {
            checkDate = yesterday;
        } else {
            // Streak is broken
            return {
                current: 0,
                longest: calculateLongestStreak(habit, completedSet),
                lastCompletedDate,
            };
        }
    }

    // Walk backwards counting consecutive completions on due days
    for (let i = 0; i < 365; i++) {
        const d = subDays(checkDate, i);
        const dateStr = format(d, 'yyyy-MM-dd');

        if (isDueDay(habit, d)) {
            if (completedSet.has(dateStr)) {
                currentStreak++;
            } else {
                break; // Streak broken
            }
        }
        // Skip non-due days (they don't break the streak)
    }

    const longestStreak = calculateLongestStreak(habit, completedSet);

    return {
        current: currentStreak,
        longest: Math.max(currentStreak, longestStreak),
        lastCompletedDate,
    };
}

/**
 * Calculate the longest streak ever achieved.
 */
function calculateLongestStreak(habit: Habit, completedSet: Set<string>): number {
    if (completedSet.size === 0) return 0;

    // Get all dates sorted ascending
    const dates = Array.from(completedSet).sort();
    const earliest = parseISO(dates[0]);
    const latest = parseISO(dates[dates.length - 1]);
    const totalDays = differenceInCalendarDays(latest, earliest) + 1;

    let longest = 0;
    let current = 0;

    for (let i = 0; i < totalDays; i++) {
        const d = subDays(latest, totalDays - 1 - i);
        const dateStr = format(d, 'yyyy-MM-dd');

        if (isDueDay(habit, d)) {
            if (completedSet.has(dateStr)) {
                current++;
                longest = Math.max(longest, current);
            } else {
                current = 0;
            }
        }
        // Non-due days don't affect streak
    }

    return longest;
}

/**
 * Check if a habit is due on a given date.
 */
function isDueDay(habit: Habit, date: Date): boolean {
    if (habit.recurrence_type === 'daily') return true;

    // Weekly — check if the day of week is in recurrence_days
    const dayOfWeek = date.getDay(); // 0=Sun, 6=Sat
    return habit.recurrence_days.includes(dayOfWeek);
}

/**
 * Get completion counts per day for the heatmap.
 * Returns a map of 'yyyy-MM-dd' -> count.
 */
export function getCompletionCountsByDate(
    completions: Completion[],
    days: number = 365
): Map<string, number> {
    const counts = new Map<string, number>();

    const cutoff = subDays(new Date(), days);

    for (const c of completions) {
        const date = new Date(c.completed_at);
        if (date < cutoff) continue;

        const key = format(date, 'yyyy-MM-dd');
        counts.set(key, (counts.get(key) ?? 0) + 1);
    }

    return counts;
}

/**
 * Get the intensity level (0-4) for a given count.
 */
export function getIntensityLevel(count: number): 0 | 1 | 2 | 3 | 4 {
    if (count === 0) return 0;
    if (count <= 2) return 1;
    if (count <= 4) return 2;
    if (count <= 6) return 3;
    return 4;
}
