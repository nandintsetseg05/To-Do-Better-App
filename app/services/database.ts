import { CompletionModel } from '@/app/models/Completion';
import { HabitModel } from '@/app/models/Habit';
import { OneTimeTaskModel } from '@/app/models/OneTimeTask';
import { schema } from '@/app/models/schema';
import { StreakModel } from '@/app/models/Streak';
import { Database } from '@nozbe/watermelondb';
import LokiJSAdapter from '@nozbe/watermelondb/adapters/lokijs';

/**
 * Initialize WatermelonDB with LokiJS adapter.
 *
 * NOTE: LokiJS is used for now (works in Expo Go / managed workflow).
 * For production, switch to SQLiteAdapter with expo-dev-client for
 * native performance. See TO_DO_BETTER_BRAIN.md §2.
 */
const adapter = new LokiJSAdapter({
    schema,
    useWebWorker: false,
    useIncrementalIndexedDB: true,
});

export const database = new Database({
    adapter,
    modelClasses: [HabitModel, OneTimeTaskModel, CompletionModel, StreakModel],
});
