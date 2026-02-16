import { HeatmapGrid } from '@/app/components/calendar/HeatmapGrid';
import { Card } from '@/app/components/shared/Card';
import { EmptyState } from '@/app/components/shared/EmptyState';
import { BorderRadius, Spacing } from '@/app/constants/spacing';
import { FontSize, FontWeight } from '@/app/constants/typography';
import { useColors } from '@/app/constants/useColors';
import { useAppStore } from '@/app/stores/useAppStore';
import { calculateStreak } from '@/app/utils/streakEngine';
import { Ionicons } from '@expo/vector-icons';
import React, { useMemo } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

export default function CalendarScreen() {
  const colors = useColors();
  const habits = useAppStore((s) => s.habits);
  const todayCompletions = useAppStore((s) => s.todayCompletions);

  // Calculate stats
  const stats = useMemo(() => {
    const activeHabits = habits.filter((h) => h.is_active);
    const totalCompletions = todayCompletions.length;

    // Calculate streaks for all habits
    let bestStreak = 0;
    let totalCurrentStreak = 0;

    for (const habit of activeHabits) {
      const habitCompletions = todayCompletions.filter(
        (c) => c.habit_id === habit.id
      );
      const streakResult = calculateStreak(habit, habitCompletions);
      bestStreak = Math.max(bestStreak, streakResult.longest);
      totalCurrentStreak += streakResult.current;
    }

    return {
      habitsCount: activeHabits.length,
      todayCompleted: totalCompletions,
      bestStreak,
      avgStreak: activeHabits.length > 0
        ? Math.round(totalCurrentStreak / activeHabits.length)
        : 0,
    };
  }, [habits, todayCompletions]);

  const isEmpty = habits.length === 0;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>Calendar</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Your progress over time</Text>
        </View>

        {isEmpty ? (
          <EmptyState
            icon="calendar-outline"
            title="No data yet"
            message="Start completing habits and your progress will appear here as a heatmap."
          />
        ) : (
          <>
            {/* Stats Row */}
            <View style={styles.statsRow}>
              <StatCard
                icon="flame"
                iconColor={colors.streakFire}
                label="Best Streak"
                value={`${stats.bestStreak}d`}
                colors={colors}
              />
              <StatCard
                icon="today"
                iconColor={colors.success}
                label="Today"
                value={`${stats.todayCompleted}/${stats.habitsCount}`}
                colors={colors}
              />
              <StatCard
                icon="trending-up"
                iconColor={colors.primary}
                label="Avg Streak"
                value={`${stats.avgStreak}d`}
                colors={colors}
              />
            </View>

            {/* Heatmap */}
            <Card style={styles.heatmapCard}>
              <Text style={[styles.heatmapTitle, { color: colors.text }]}>Activity Heatmap</Text>
              <HeatmapGrid completions={todayCompletions} />
            </Card>

            {/* Per-habit streaks */}
            <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Habit Streaks</Text>
            {habits
              .filter((h) => h.is_active)
              .map((habit) => {
                const streakResult = calculateStreak(
                  habit,
                  todayCompletions.filter((c) => c.habit_id === habit.id)
                );
                return (
                  <Card key={habit.id} style={styles.streakCard}>
                    <View style={styles.streakRow}>
                      <Text style={styles.streakEmoji}>{habit.emoji}</Text>
                      <View style={styles.streakContent}>
                        <Text style={[styles.streakName, { color: colors.text }]} numberOfLines={1}>
                          {habit.name}
                        </Text>
                        <Text style={[styles.streakRange, { color: colors.textMuted }]}>
                          Best: {streakResult.longest} days
                        </Text>
                      </View>
                      <View style={[styles.streakBadge, { backgroundColor: colors.streakFire + '15' }]}>
                        <Text style={[styles.streakCount, { color: colors.streakFire }]}>
                          🔥 {streakResult.current}
                        </Text>
                      </View>
                    </View>
                  </Card>
                );
              })}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function StatCard({
  icon,
  iconColor,
  label,
  value,
  colors,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  label: string;
  value: string;
  colors: ReturnType<typeof useColors>;
}) {
  return (
    <Card style={styles.statCard}>
      <Ionicons name={icon} size={20} color={iconColor} />
      <Text style={[styles.statValue, { color: colors.text }]}>{value}</Text>
      <Text style={[styles.statLabel, { color: colors.textMuted }]}>{label}</Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  scrollContent: {
    paddingBottom: Spacing['2xl'],
  },

  header: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.base,
  },

  title: {
    fontSize: FontSize['2xl'],
    fontWeight: FontWeight.bold,
  },

  subtitle: {
    fontSize: FontSize.base,
    marginTop: Spacing.xxs,
  },

  // ── Stats ──
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.base,
    gap: Spacing.sm,
    marginBottom: Spacing.base,
  },

  statCard: {
    flex: 1,
    alignItems: 'center',
    gap: Spacing.xxs,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
  },

  statValue: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
  },

  statLabel: {
    fontSize: FontSize.xs,
  },

  // ── Heatmap ──
  heatmapCard: {
    marginHorizontal: Spacing.base,
    marginBottom: Spacing.base,
  },

  heatmapTitle: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.semibold,
    marginBottom: Spacing.sm,
  },

  // ── Streaks ──
  sectionTitle: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.base,
    marginBottom: Spacing.sm,
  },

  streakCard: {
    marginHorizontal: Spacing.base,
    marginBottom: Spacing.sm,
  },

  streakRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },

  streakEmoji: {
    fontSize: 24,
  },

  streakContent: {
    flex: 1,
  },

  streakName: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.medium,
  },

  streakRange: {
    fontSize: FontSize.xs,
    marginTop: 2,
  },

  streakBadge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },

  streakCount: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
  },
});
