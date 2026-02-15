import { HeatmapGrid } from '@/app/components/calendar/HeatmapGrid';
import { Card } from '@/app/components/shared/Card';
import { EmptyState } from '@/app/components/shared/EmptyState';
import { Colors } from '@/app/constants/colors';
import { BorderRadius, Spacing } from '@/app/constants/spacing';
import { FontSize, FontWeight } from '@/app/constants/typography';
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
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Calendar</Text>
          <Text style={styles.subtitle}>Your progress over time</Text>
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
                iconColor={Colors.streakFire}
                label="Best Streak"
                value={`${stats.bestStreak}d`}
              />
              <StatCard
                icon="today"
                iconColor={Colors.success}
                label="Today"
                value={`${stats.todayCompleted}/${stats.habitsCount}`}
              />
              <StatCard
                icon="trending-up"
                iconColor={Colors.primary}
                label="Avg Streak"
                value={`${stats.avgStreak}d`}
              />
            </View>

            {/* Heatmap */}
            <Card style={styles.heatmapCard}>
              <Text style={styles.heatmapTitle}>Activity Heatmap</Text>
              <HeatmapGrid completions={todayCompletions} />
            </Card>

            {/* Per-habit streaks */}
            <Text style={styles.sectionTitle}>Habit Streaks</Text>
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
                        <Text style={styles.streakName} numberOfLines={1}>
                          {habit.name}
                        </Text>
                        <Text style={styles.streakRange}>
                          Best: {streakResult.longest} days
                        </Text>
                      </View>
                      <View style={styles.streakBadge}>
                        <Text style={styles.streakCount}>
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
}: {
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  label: string;
  value: string;
}) {
  return (
    <Card style={styles.statCard}>
      <Ionicons name={icon} size={20} color={iconColor} />
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
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
    color: Colors.text,
  },

  subtitle: {
    fontSize: FontSize.base,
    color: Colors.textSecondary,
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
    color: Colors.text,
  },

  statLabel: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
  },

  // ── Heatmap ──
  heatmapCard: {
    marginHorizontal: Spacing.base,
    marginBottom: Spacing.base,
  },

  heatmapTitle: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.semibold,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },

  // ── Streaks ──
  sectionTitle: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.textSecondary,
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
    color: Colors.text,
  },

  streakRange: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    marginTop: 2,
  },

  streakBadge: {
    backgroundColor: Colors.streakFire + '15',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },

  streakCount: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    color: Colors.streakFire,
  },
});
