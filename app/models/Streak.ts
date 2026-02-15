import { Model } from '@nozbe/watermelondb';
import { date, field, readonly, text } from '@nozbe/watermelondb/decorators';

/**
 * Streak model — tracks current and longest streaks per habit
 */
export class StreakModel extends Model {
    static table = 'streaks';

    @text('habit_id')
    habitId!: string;

    @field('current_count')
    currentCount!: number;

    @field('longest_count')
    longestCount!: number;

    @text('last_completed_date')
    lastCompletedDate!: string | null;

    @readonly
    @date('updated_at')
    updatedAt!: Date;
}
