import { HabitCard } from '@/app/components/habits/HabitCard';
import { HabitForm, type HabitFormData } from '@/app/components/habits/HabitForm';
import { EmptyState } from '@/app/components/shared/EmptyState';
import { FloatingActionButton } from '@/app/components/shared/FloatingActionButton';
import { MotivationCard } from '@/app/components/shared/MotivationCard';
import { TaskCard } from '@/app/components/tasks/TaskCard';
import { TaskForm, type TaskFormData } from '@/app/components/tasks/TaskForm';
import { Colors } from '@/app/constants/colors';
import { Spacing } from '@/app/constants/spacing';
import { FontSize, FontWeight } from '@/app/constants/typography';
import { notificationService } from '@/app/services/notifications';
import { useAppStore, type Habit, type OneTimeTask } from '@/app/stores/useAppStore';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import React, { useCallback, useState } from 'react';
import {
  Alert,
  SafeAreaView,
  SectionList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

type CreateMode = 'habit' | 'task';

export default function HomeScreen() {
  const [showHabitForm, setShowHabitForm] = useState(false);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [showCreatePicker, setShowCreatePicker] = useState(false);

  // Store
  const habits = useAppStore((s) => s.habits);
  const tasks = useAppStore((s) => s.tasks);
  const todayCompletions = useAppStore((s) => s.todayCompletions);
  const addHabit = useAppStore((s) => s.addHabit);
  const addTask = useAppStore((s) => s.addTask);
  const addCompletion = useAppStore((s) => s.addCompletion);
  const removeCompletion = useAppStore((s) => s.removeCompletion);
  const updateTask = useAppStore((s) => s.updateTask);
  const removeTask = useAppStore((s) => s.removeTask);

  // Greeting
  const now = new Date();
  const greeting = getGreeting(now);
  const dateString = now.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  // ── Handlers ──
  const handleToggleHabit = useCallback(
    (habitId: string) => {
      const isCompleted = todayCompletions.some((c) => c.habit_id === habitId);
      if (isCompleted) {
        removeCompletion(habitId);
      } else {
        addCompletion({
          id: Date.now().toString(),
          habit_id: habitId,
          completed_at: new Date().toISOString(),
        });
      }
    },
    [todayCompletions, addCompletion, removeCompletion]
  );

  const handleToggleTask = useCallback(
    (taskId: string) => {
      const task = tasks.find((t) => t.id === taskId);
      if (task) {
        updateTask(taskId, { is_completed: !task.is_completed });
      }
    },
    [tasks, updateTask]
  );

  const handleCreateHabit = useCallback(
    async (data: HabitFormData) => {
      const habitId = Date.now().toString();
      const newHabit: Habit = {
        id: habitId,
        ...data,
        is_active: true,
        created_at: new Date().toISOString(),
      };
      addHabit(newHabit);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      // Schedule notification if reminder time is set
      if (data.reminder_time) {
        await notificationService.scheduleHabitReminder(
          habitId,
          data.name,
          data.emoji,
          data.reminder_time,
          data.recurrence_days
        );
      }
    },
    [addHabit]
  );

  const handleCreateTask = useCallback(
    (data: TaskFormData) => {
      const newTask: OneTimeTask = {
        id: Date.now().toString(),
        ...data,
        is_completed: false,
        created_at: new Date().toISOString(),
      };
      addTask(newTask);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    },
    [addTask]
  );

  const handleDeleteTask = useCallback(
    (taskId: string) => {
      Alert.alert('Delete Task', 'Are you sure you want to delete this task?', [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => removeTask(taskId),
        },
      ]);
    },
    [removeTask]
  );

  const handleFABPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setShowCreatePicker(true);
  };

  // ── Section data ──
  const activeHabits = habits.filter((h) => h.is_active);
  const pendingTasks = tasks.filter((t) => !t.is_completed);
  const completedTasks = tasks.filter((t) => t.is_completed);

  const completedCount =
    todayCompletions.length + completedTasks.length;
  const totalCount = activeHabits.length + tasks.length;

  const isEmpty = activeHabits.length === 0 && tasks.length === 0;

  // Build sections
  type SectionItem = { type: 'habit'; data: Habit } | { type: 'task'; data: OneTimeTask };
  const sections: { title: string; data: SectionItem[] }[] = [];

  if (activeHabits.length > 0) {
    sections.push({
      title: `Habits (${todayCompletions.length}/${activeHabits.length})`,
      data: activeHabits.map((h) => ({ type: 'habit' as const, data: h })),
    });
  }

  if (pendingTasks.length > 0) {
    sections.push({
      title: `Tasks (${completedTasks.length}/${tasks.length})`,
      data: pendingTasks.map((t) => ({ type: 'task' as const, data: t })),
    });
  }

  if (completedTasks.length > 0) {
    sections.push({
      title: 'Completed',
      data: completedTasks.map((t) => ({ type: 'task' as const, data: t })),
    });
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <Animated.View entering={FadeInDown.duration(400)} style={styles.header}>
        <View>
          <Text style={styles.greeting}>{greeting}</Text>
          <Text style={styles.date}>{dateString}</Text>
        </View>
        {!isEmpty && (
          <View style={styles.progressBadge}>
            <Text style={styles.progressText}>
              {completedCount}/{totalCount}
            </Text>
          </View>
        )}
      </Animated.View>

      {/* AI Motivation */}
      {!isEmpty && (
        <MotivationCard
          context={{
            habitName: activeHabits[0]?.name ?? '',
            emoji: activeHabits[0]?.emoji ?? '💪',
            currentStreak: 0,
            isCompletedToday: todayCompletions.length > 0,
            totalHabits: activeHabits.length,
            completedToday: todayCompletions.length,
          }}
        />
      )}

      {/* Content */}
      {isEmpty ? (
        <EmptyState
          icon="checkmark-circle-outline"
          title="No habits yet!"
          message="Tap the + button to create your first habit or task."
          actionLabel="Create Habit"
          onAction={() => setShowHabitForm(true)}
        />
      ) : (
        <SectionList
          sections={sections}
          keyExtractor={(item) => `${item.type}-${item.data.id}`}
          renderSectionHeader={({ section }) => (
            <Text style={styles.sectionHeader}>{section.title}</Text>
          )}
          renderItem={({ item }) => {
            if (item.type === 'habit') {
              const habit = item.data as Habit;
              return (
                <HabitCard
                  habit={habit}
                  isCompletedToday={todayCompletions.some(
                    (c) => c.habit_id === habit.id
                  )}
                  currentStreak={0} // TODO: Calculate from completions history
                  onToggleComplete={handleToggleHabit}
                  onPress={() => {
                    // TODO: Open habit detail/edit
                  }}
                />
              );
            }

            const task = item.data as OneTimeTask;
            return (
              <TaskCard
                task={task}
                onToggleComplete={handleToggleTask}
                onPress={() => {
                  // TODO: Open task detail/edit
                }}
                onDelete={handleDeleteTask}
              />
            );
          }}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          stickySectionHeadersEnabled={false}
        />
      )}

      {/* FAB */}
      <FloatingActionButton onPress={handleFABPress} />

      {/* Create Picker Bottom Sheet */}
      {showCreatePicker && (
        <CreatePickerSheet
          onSelectHabit={() => {
            setShowCreatePicker(false);
            setShowHabitForm(true);
          }}
          onSelectTask={() => {
            setShowCreatePicker(false);
            setShowTaskForm(true);
          }}
          onClose={() => setShowCreatePicker(false)}
        />
      )}

      {/* Forms */}
      <HabitForm
        visible={showHabitForm}
        onClose={() => setShowHabitForm(false)}
        onSubmit={handleCreateHabit}
      />
      <TaskForm
        visible={showTaskForm}
        onClose={() => setShowTaskForm(false)}
        onSubmit={handleCreateTask}
      />
    </SafeAreaView>
  );
}

// ── Create Picker ──
function CreatePickerSheet({
  onSelectHabit,
  onSelectTask,
  onClose,
}: {
  onSelectHabit: () => void;
  onSelectTask: () => void;
  onClose: () => void;
}) {
  return (
    <View style={pickerStyles.overlay}>
      <TouchableOpacity
        style={pickerStyles.backdrop}
        activeOpacity={1}
        onPress={onClose}
      />
      <Animated.View
        entering={FadeInDown.springify().damping(18)}
        style={pickerStyles.sheet}
      >
        <Text style={pickerStyles.title}>What would you like to create?</Text>

        <TouchableOpacity
          onPress={onSelectHabit}
          style={pickerStyles.option}
          accessibilityRole="button"
        >
          <View style={[pickerStyles.iconCircle, { backgroundColor: Colors.primary + '15' }]}>
            <Ionicons name="repeat" size={22} color={Colors.primary} />
          </View>
          <View style={pickerStyles.optionContent}>
            <Text style={pickerStyles.optionTitle}>Habit</Text>
            <Text style={pickerStyles.optionDesc}>Recurring activity to track daily</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={Colors.textMuted} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onSelectTask}
          style={pickerStyles.option}
          accessibilityRole="button"
        >
          <View style={[pickerStyles.iconCircle, { backgroundColor: Colors.secondary + '15' }]}>
            <Ionicons name="checkbox-outline" size={22} color={Colors.secondary} />
          </View>
          <View style={pickerStyles.optionContent}>
            <Text style={pickerStyles.optionTitle}>Task</Text>
            <Text style={pickerStyles.optionDesc}>One-time to-do with optional due date</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={Colors.textMuted} />
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

// ── Helpers ──
function getGreeting(date: Date): string {
  const hour = date.getHours();
  if (hour < 12) return 'Good morning! ☀️';
  if (hour < 17) return 'Good afternoon! 🌤️';
  return 'Good evening! 🌙';
}

// ── Styles ──
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.base,
  },

  greeting: {
    fontSize: FontSize['2xl'],
    fontWeight: FontWeight.bold,
    color: Colors.text,
  },

  date: {
    fontSize: FontSize.base,
    color: Colors.textSecondary,
    marginTop: Spacing.xxs,
  },

  progressBadge: {
    backgroundColor: Colors.primary + '15',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: 20,
  },

  progressText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    color: Colors.primary,
  },

  listContent: {
    paddingBottom: 100, // space for FAB
  },

  sectionHeader: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.base,
    marginBottom: Spacing.sm,
  },
});

const pickerStyles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    zIndex: 100,
  },

  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.overlay,
  },

  sheet: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: Spacing.lg,
    paddingBottom: Spacing['2xl'],
    gap: Spacing.md,
  },

  title: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },

  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    padding: Spacing.md,
    borderRadius: 16,
    backgroundColor: Colors.background,
  },

  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },

  optionContent: {
    flex: 1,
  },

  optionTitle: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.semibold,
    color: Colors.text,
  },

  optionDesc: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    marginTop: 2,
  },
});
