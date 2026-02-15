import { Model } from '@nozbe/watermelondb';
import { date, readonly, text } from '@nozbe/watermelondb/decorators';

/**
 * Completion model — records when a habit was completed
 */
export class CompletionModel extends Model {
    static table = 'completions';

    @text('habit_id')
    habitId!: string;

    @date('completed_at')
    completedAt!: Date;

    @text('remote_id')
    remoteId!: string | null;

    @text('user_id')
    userId!: string | null;

    @readonly
    @date('created_at')
    createdAt!: Date;
}
