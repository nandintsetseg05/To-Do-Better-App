import { appSchema, tableSchema } from '@nozbe/watermelondb';

/**
 * WatermelonDB Schema
 * Matches Supabase tables from TO_DO_BETTER_BRAIN.md §4
 */
export const schema = appSchema({
    version: 1,
    tables: [
        tableSchema({
            name: 'habits',
            columns: [
                { name: 'name', type: 'string' },
                { name: 'emoji', type: 'string' },
                { name: 'recurrence_type', type: 'string' },  // 'daily' | 'weekly' | 'custom'
                { name: 'recurrence_days', type: 'string' },   // JSON array "[0,1,2,3,4,5,6]"
                { name: 'reminder_time', type: 'string', isOptional: true }, // HH:mm
                { name: 'priority', type: 'string' },           // 'low' | 'medium' | 'high'
                { name: 'is_active', type: 'boolean' },
                { name: 'remote_id', type: 'string', isOptional: true },
                { name: 'user_id', type: 'string', isOptional: true },
                { name: 'created_at', type: 'number' },
                { name: 'updated_at', type: 'number' },
            ],
        }),
        tableSchema({
            name: 'one_time_tasks',
            columns: [
                { name: 'name', type: 'string' },
                { name: 'due_date', type: 'string', isOptional: true },  // yyyy-MM-dd
                { name: 'is_completed', type: 'boolean' },
                { name: 'priority', type: 'string' },
                { name: 'remote_id', type: 'string', isOptional: true },
                { name: 'user_id', type: 'string', isOptional: true },
                { name: 'created_at', type: 'number' },
                { name: 'updated_at', type: 'number' },
            ],
        }),
        tableSchema({
            name: 'completions',
            columns: [
                { name: 'habit_id', type: 'string', isIndexed: true },
                { name: 'completed_at', type: 'number' },
                { name: 'remote_id', type: 'string', isOptional: true },
                { name: 'user_id', type: 'string', isOptional: true },
                { name: 'created_at', type: 'number' },
            ],
        }),
        tableSchema({
            name: 'streaks',
            columns: [
                { name: 'habit_id', type: 'string', isIndexed: true },
                { name: 'current_count', type: 'number' },
                { name: 'longest_count', type: 'number' },
                { name: 'last_completed_date', type: 'string', isOptional: true },
                { name: 'updated_at', type: 'number' },
            ],
        }),
    ],
});
