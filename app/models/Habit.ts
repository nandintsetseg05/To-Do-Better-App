import { Model } from '@nozbe/watermelondb';
import { date, field, json, readonly, text } from '@nozbe/watermelondb/decorators';

/**
 * Habit model — recurring activity to be tracked
 */
export class HabitModel extends Model {
    static table = 'habits';

    @text('name')
    name!: string;

    @text('emoji')
    emoji!: string;

    @text('recurrence_type')
    recurrenceType!: string;

    @json('recurrence_days', (raw: any) => raw || [])
    recurrenceDays!: number[];

    @text('reminder_time')
    reminderTime!: string | null;

    @text('priority')
    priority!: string;

    @field('is_active')
    isActive!: boolean;

    @text('remote_id')
    remoteId!: string | null;

    @text('user_id')
    userId!: string | null;

    @readonly
    @date('created_at')
    createdAt!: Date;

    @readonly
    @date('updated_at')
    updatedAt!: Date;
}
