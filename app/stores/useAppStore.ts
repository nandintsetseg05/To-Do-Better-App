import { create } from 'zustand';

// ── Types ──
export type RecurrenceType = 'daily' | 'weekly' | 'custom';
export type Priority = 'low' | 'medium' | 'high';

export interface Habit {
    id: string;
    name: string;
    emoji: string;
    recurrence_type: RecurrenceType;
    recurrence_days: number[];     // 0-6 for Sun-Sat
    reminder_time: string | null;  // HH:mm format
    priority: Priority;
    is_active: boolean;
    created_at: string;
}

export interface OneTimeTask {
    id: string;
    name: string;
    due_date: string | null;
    is_completed: boolean;
    priority: Priority;
    created_at: string;
}

export interface Completion {
    id: string;
    habit_id: string;
    completed_at: string;
}

// ── Store State ──
interface AppState {
    // Habits
    habits: Habit[];
    setHabits: (habits: Habit[]) => void;
    addHabit: (habit: Habit) => void;
    updateHabit: (id: string, updates: Partial<Habit>) => void;
    removeHabit: (id: string) => void;

    // One-time tasks
    tasks: OneTimeTask[];
    setTasks: (tasks: OneTimeTask[]) => void;
    addTask: (task: OneTimeTask) => void;
    updateTask: (id: string, updates: Partial<OneTimeTask>) => void;
    removeTask: (id: string) => void;

    // Completions (today)
    todayCompletions: Completion[];
    setTodayCompletions: (completions: Completion[]) => void;
    addCompletion: (completion: Completion) => void;
    removeCompletion: (habitId: string) => void;

    // UI state
    isLoading: boolean;
    setIsLoading: (loading: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
    // ── Habits ──
    habits: [],
    setHabits: (habits) => set({ habits }),
    addHabit: (habit) => set((state) => ({ habits: [...state.habits, habit] })),
    updateHabit: (id, updates) =>
        set((state) => ({
            habits: state.habits.map((h) => (h.id === id ? { ...h, ...updates } : h)),
        })),
    removeHabit: (id) =>
        set((state) => ({ habits: state.habits.filter((h) => h.id !== id) })),

    // ── Tasks ──
    tasks: [],
    setTasks: (tasks) => set({ tasks }),
    addTask: (task) => set((state) => ({ tasks: [...state.tasks, task] })),
    updateTask: (id, updates) =>
        set((state) => ({
            tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)),
        })),
    removeTask: (id) =>
        set((state) => ({ tasks: state.tasks.filter((t) => t.id !== id) })),

    // ── Completions ──
    todayCompletions: [],
    setTodayCompletions: (completions) => set({ todayCompletions: completions }),
    addCompletion: (completion) =>
        set((state) => ({
            todayCompletions: [...state.todayCompletions, completion],
        })),
    removeCompletion: (habitId) =>
        set((state) => ({
            todayCompletions: state.todayCompletions.filter((c) => c.habit_id !== habitId),
        })),

    // ── UI ──
    isLoading: true,
    setIsLoading: (loading) => set({ isLoading: loading }),
}));
