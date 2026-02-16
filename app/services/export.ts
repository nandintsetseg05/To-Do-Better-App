import { useAppStore } from '@/app/stores/useAppStore';
import { File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';

/**
 * Export service — lets users download their data as a JSON file.
 */
export const exportService = {
    /**
     * Export all user data (habits, tasks, completions) as a JSON file
     * and open the native share sheet.
     */
    async exportAsJSON(): Promise<{ success: boolean; error?: string }> {
        try {
            const store = useAppStore.getState();

            const exportData = {
                exportedAt: new Date().toISOString(),
                appVersion: '1.0.0',
                data: {
                    habits: store.habits,
                    tasks: store.tasks,
                    completions: store.todayCompletions,
                },
            };

            const json = JSON.stringify(exportData, null, 2);
            const filename = `to-do-better-export-${new Date().toISOString().split('T')[0]}.json`;

            // SDK 54 new File/Paths API
            const file = new File(Paths.cache, filename);
            if (!file.exists) {
                file.create();
            }
            file.write(json);

            const isAvailable = await Sharing.isAvailableAsync();
            if (!isAvailable) {
                return { success: false, error: 'Sharing is not available on this device' };
            }

            await Sharing.shareAsync(file.uri, {
                mimeType: 'application/json',
                dialogTitle: 'Export your data',
            });

            return { success: true };
        } catch (err: any) {
            console.warn('[Export] Failed:', err.message);
            return { success: false, error: err.message };
        }
    },
};
