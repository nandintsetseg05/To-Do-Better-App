import { supabase } from '@/app/services/supabase';
import { useAppStore, type Completion, type Habit, type OneTimeTask } from '@/app/stores/useAppStore';

/**
 * Sync service — handles bi-directional sync between local Zustand store and Supabase.
 *
 * Strategy: "Last write wins" with local-first priority.
 * - On push: upsert local data to Supabase
 * - On pull: fetch remote data and merge into local store
 * - Guest users skip sync entirely
 */
export const syncService = {
    /**
     * Push all local data to Supabase (for authenticated users).
     */
    async pushToRemote(): Promise<{ success: boolean; error?: string }> {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return { success: false, error: 'Not authenticated' };

            const store = useAppStore.getState();

            // Push habits
            if (store.habits.length > 0) {
                const habitRows = store.habits.map((h) => ({
                    id: h.id,
                    user_id: user.id,
                    name: h.name,
                    emoji: h.emoji,
                    recurrence_type: h.recurrence_type,
                    recurrence_days: h.recurrence_days,
                    reminder_time: h.reminder_time,
                    priority: h.priority,
                    is_active: h.is_active,
                    created_at: h.created_at,
                }));

                const { error } = await supabase
                    .from('habits')
                    .upsert(habitRows, { onConflict: 'id' });

                if (error) throw error;
            }

            // Push tasks
            if (store.tasks.length > 0) {
                const taskRows = store.tasks.map((t) => ({
                    id: t.id,
                    user_id: user.id,
                    name: t.name,
                    due_date: t.due_date,
                    priority: t.priority,
                    is_completed: t.is_completed,
                    created_at: t.created_at,
                }));

                const { error } = await supabase
                    .from('one_time_tasks')
                    .upsert(taskRows, { onConflict: 'id' });

                if (error) throw error;
            }

            // Push today's completions
            if (store.todayCompletions.length > 0) {
                const completionRows = store.todayCompletions.map((c) => ({
                    id: c.id,
                    user_id: user.id,
                    habit_id: c.habit_id,
                    completed_at: c.completed_at,
                }));

                const { error } = await supabase
                    .from('completions')
                    .upsert(completionRows, { onConflict: 'id' });

                if (error) throw error;
            }

            console.log('[Sync] Push complete');
            return { success: true };
        } catch (err: any) {
            console.warn('[Sync] Push failed:', err.message);
            return { success: false, error: err.message };
        }
    },

    /**
     * Pull data from Supabase and merge into local store.
     */
    async pullFromRemote(): Promise<{ success: boolean; error?: string }> {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return { success: false, error: 'Not authenticated' };

            const store = useAppStore.getState();

            // Fetch habits
            const { data: remoteHabits, error: habitsError } = await supabase
                .from('habits')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: true });

            if (habitsError) throw habitsError;

            // Fetch tasks
            const { data: remoteTasks, error: tasksError } = await supabase
                .from('one_time_tasks')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: true });

            if (tasksError) throw tasksError;

            // Fetch today's completions
            const todayStart = new Date();
            todayStart.setHours(0, 0, 0, 0);

            const { data: remoteCompletions, error: completionsError } = await supabase
                .from('completions')
                .select('*')
                .eq('user_id', user.id)
                .gte('completed_at', todayStart.toISOString());

            if (completionsError) throw completionsError;

            // Merge into local store — remote data takes precedence for existing items,
            // but we keep local items that don't exist remotely (not yet synced)
            if (remoteHabits) {
                const mergedHabits = mergeById<Habit>(
                    store.habits,
                    remoteHabits.map(mapRemoteHabit)
                );
                useAppStore.setState({ habits: mergedHabits });
            }

            if (remoteTasks) {
                const mergedTasks = mergeById<OneTimeTask>(
                    store.tasks,
                    remoteTasks.map(mapRemoteTask)
                );
                useAppStore.setState({ tasks: mergedTasks });
            }

            if (remoteCompletions) {
                const mergedCompletions = mergeById<Completion>(
                    store.todayCompletions,
                    remoteCompletions.map(mapRemoteCompletion)
                );
                useAppStore.setState({ todayCompletions: mergedCompletions });
            }

            console.log('[Sync] Pull complete');
            return { success: true };
        } catch (err: any) {
            console.warn('[Sync] Pull failed:', err.message);
            return { success: false, error: err.message };
        }
    },

    /**
     * Full bi-directional sync: pull first (get latest from server), then push local changes.
     */
    async fullSync(): Promise<{ success: boolean; error?: string }> {
        const pullResult = await this.pullFromRemote();
        if (!pullResult.success) return pullResult;

        const pushResult = await this.pushToRemote();
        return pushResult;
    },

    /**
     * Delete a habit from Supabase (called when user deletes locally).
     */
    async deleteHabitRemote(habitId: string): Promise<void> {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            await supabase.from('completions').delete().eq('habit_id', habitId);
            await supabase.from('streaks').delete().eq('habit_id', habitId);
            await supabase.from('habits').delete().eq('id', habitId);
        } catch (err: any) {
            console.warn('[Sync] Delete habit failed:', err.message);
        }
    },

    /**
     * Delete a task from Supabase.
     */
    async deleteTaskRemote(taskId: string): Promise<void> {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            await supabase.from('one_time_tasks').delete().eq('id', taskId);
        } catch (err: any) {
            console.warn('[Sync] Delete task failed:', err.message);
        }
    },
};

// ── Mappers: Supabase row → local type ──

function mapRemoteHabit(row: any): Habit {
    return {
        id: row.id,
        name: row.name,
        emoji: row.emoji,
        recurrence_type: row.recurrence_type,
        recurrence_days: row.recurrence_days ?? [0, 1, 2, 3, 4, 5, 6],
        reminder_time: row.reminder_time,
        priority: row.priority,
        is_active: row.is_active,
        created_at: row.created_at,
    };
}

function mapRemoteTask(row: any): OneTimeTask {
    return {
        id: row.id,
        name: row.name,
        due_date: row.due_date,
        priority: row.priority,
        is_completed: row.is_completed,
        created_at: row.created_at,
    };
}

function mapRemoteCompletion(row: any): Completion {
    return {
        id: row.id,
        habit_id: row.habit_id,
        completed_at: row.completed_at,
    };
}

// ── Merge helper: keeps both local-only and remote items, remote wins on conflict ──

function mergeById<T extends { id: string }>(local: T[], remote: T[]): T[] {
    const map = new Map<string, T>();

    // Local items first
    for (const item of local) {
        map.set(item.id, item);
    }

    // Remote items overwrite (they're the source of truth)
    for (const item of remote) {
        map.set(item.id, item);
    }

    return Array.from(map.values());
}
