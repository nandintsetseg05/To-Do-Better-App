import * as Notifications from 'expo-notifications';

// ── Configure default notification behavior ──
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
    }),
});

/**
 * Notification service — handles permissions, scheduling, and cancellation.
 */
export const notificationService = {
    /**
     * Request notification permissions.
     * Returns true if granted.
     */
    async requestPermissions(): Promise<boolean> {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();

        if (existingStatus === 'granted') return true;

        const { status } = await Notifications.requestPermissionsAsync();
        return status === 'granted';
    },

    /**
     * Check if permissions are currently granted.
     */
    async hasPermission(): Promise<boolean> {
        const { status } = await Notifications.getPermissionsAsync();
        return status === 'granted';
    },

    /**
     * Schedule a daily recurring reminder for a habit.
     *
     * @param habitId   Used as the notification identifier for cancellation
     * @param habitName Shown in the notification body
     * @param emoji     Shown in the notification title
     * @param time      "HH:mm" format (e.g. "09:00")
     * @param days      Array of day-of-week numbers (0=Sun..6=Sat)
     */
    async scheduleHabitReminder(
        habitId: string,
        habitName: string,
        emoji: string,
        time: string,
        days: number[]
    ): Promise<void> {
        const hasPerms = await this.requestPermissions();
        if (!hasPerms) return;

        // Cancel any existing reminders for this habit first
        await this.cancelHabitReminder(habitId);

        const [hours, minutes] = time.split(':').map(Number);

        // Schedule one notification per day-of-week
        for (const weekday of days) {
            // Expo uses 1=Sunday..7=Saturday, JS uses 0=Sunday..6=Saturday
            const expoWeekday = weekday === 0 ? 1 : weekday + 1;

            await Notifications.scheduleNotificationAsync({
                identifier: `habit-${habitId}-day-${weekday}`,
                content: {
                    title: `${emoji} Time for your habit!`,
                    body: habitName,
                    data: { habitId, type: 'habit_reminder' },
                    sound: 'default',
                },
                trigger: {
                    type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
                    weekday: expoWeekday,
                    hour: hours,
                    minute: minutes,
                },
            });
        }
    },

    /**
     * Cancel all reminders for a specific habit.
     */
    async cancelHabitReminder(habitId: string): Promise<void> {
        const scheduled = await Notifications.getAllScheduledNotificationsAsync();

        for (const notif of scheduled) {
            if (notif.identifier.startsWith(`habit-${habitId}-`)) {
                await Notifications.cancelScheduledNotificationAsync(notif.identifier);
            }
        }
    },

    /**
     * Cancel all scheduled notifications.
     */
    async cancelAll(): Promise<void> {
        await Notifications.cancelAllScheduledNotificationsAsync();
    },

    /**
     * Get count of scheduled notifications (for debugging / settings display).
     */
    async getScheduledCount(): Promise<number> {
        const scheduled = await Notifications.getAllScheduledNotificationsAsync();
        return scheduled.length;
    },

    /**
     * Send an instant local notification (for testing or one-time events).
     */
    async sendInstant(title: string, body: string): Promise<void> {
        const hasPerms = await this.requestPermissions();
        if (!hasPerms) return;

        await Notifications.scheduleNotificationAsync({
            content: { title, body, sound: 'default' },
            trigger: null, // Immediately
        });
    },
};
