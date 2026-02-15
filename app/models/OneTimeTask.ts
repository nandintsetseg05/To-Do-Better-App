import { Model } from '@nozbe/watermelondb';
import { date, field, readonly, text } from '@nozbe/watermelondb/decorators';

/**
 * OneTimeTask model — a task that can be completed once
 */
export class OneTimeTaskModel extends Model {
    static table = 'one_time_tasks';

    @text('name')
    name!: string;

    @text('due_date')
    dueDate!: string | null;

    @field('is_completed')
    isCompleted!: boolean;

    @text('priority')
    priority!: string;

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
