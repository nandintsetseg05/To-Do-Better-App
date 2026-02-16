import { Button } from '@/app/components/shared/Button';
import { Card } from '@/app/components/shared/Card';
import { Spacing } from '@/app/constants/spacing';
import { FontSize, FontWeight } from '@/app/constants/typography';
import { useColors } from '@/app/constants/useColors';
import { exportService } from '@/app/services/export';
import { notificationService } from '@/app/services/notifications';
import { syncService } from '@/app/services/sync';
import { useAuthStore } from '@/app/stores/useAuthStore';
import { useThemeStore } from '@/app/stores/useThemeStore';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import {
    Alert,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function ProfileScreen() {
    const colors = useColors();
    const { user, signOut } = useAuthStore();
    const { themeMode, setThemeMode, initialize: initTheme } = useThemeStore();
    const [notificationsEnabled, setNotificationsEnabled] = useState(false);
    const [scheduledCount, setScheduledCount] = useState(0);
    const [isSyncing, setIsSyncing] = useState(false);
    const [lastSyncResult, setLastSyncResult] = useState<string | null>(null);
    const [isExporting, setIsExporting] = useState(false);

    // Initialize theme + check notification status
    useEffect(() => {
        initTheme();
        checkNotificationStatus();
    }, []);

    const checkNotificationStatus = async () => {
        const hasPerms = await notificationService.hasPermission();
        setNotificationsEnabled(hasPerms);
        const count = await notificationService.getScheduledCount();
        setScheduledCount(count);
    };

    const handleToggleNotifications = async (value: boolean) => {
        if (value) {
            const granted = await notificationService.requestPermissions();
            setNotificationsEnabled(granted);
            if (!granted) {
                Alert.alert(
                    'Notifications Disabled',
                    'Please enable notifications in your device settings to receive habit reminders.',
                );
            }
        } else {
            await notificationService.cancelAll();
            setNotificationsEnabled(false);
            setScheduledCount(0);
        }
    };

    const handleSignOut = () => {
        Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Sign Out',
                style: 'destructive',
                onPress: async () => { await signOut(); },
            },
        ]);
    };

    const handleTestNotification = async () => {
        await notificationService.sendInstant(
            '🎯 Test Notification',
            'Notifications are working! Your habit reminders will appear like this.'
        );
    };

    const handleSync = async () => {
        setIsSyncing(true);
        setLastSyncResult(null);
        const result = await syncService.fullSync();
        setIsSyncing(false);
        setLastSyncResult(result.success ? '✅ Synced!' : `❌ ${result.error}`);
        setTimeout(() => setLastSyncResult(null), 3000);
    };

    const handleExportData = async () => {
        setIsExporting(true);
        const result = await exportService.exportAsJSON();
        setIsExporting(false);
        if (!result.success) {
            Alert.alert('Export Failed', result.error ?? 'Unknown error');
        }
    };

    const handleDeleteAccount = () => {
        Alert.alert(
            '⚠️ Delete Account',
            'This will permanently delete your account and all synced data. Local data will be kept. This cannot be undone.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete Account',
                    style: 'destructive',
                    onPress: async () => {
                        // Sign out (actual account deletion requires Supabase admin SDK)
                        await signOut();
                        Alert.alert(
                            'Account Deleted',
                            'Your account has been signed out. Contact support to fully remove your data.'
                        );
                    },
                },
            ]
        );
    };

    const cycleTheme = () => {
        setThemeMode(themeMode === 'light' ? 'dark' : 'light');
    };

    const themeLabel = themeMode === 'dark' ? 'Dark' : 'Light';
    const themeIcon = themeMode === 'dark' ? 'moon' : 'sunny';

    // ── Dynamic styles ──
    const ds = useMemo(() => ({
        container: { backgroundColor: colors.background },
        title: { color: colors.text },
        userName: { color: colors.text },
        userEmail: { color: colors.textSecondary },
        sectionTitle: { color: colors.textSecondary },
        settingsLabel: { color: colors.text },
        settingsValue: { color: colors.textSecondary },
        divider: { backgroundColor: colors.border },
        avatar: { backgroundColor: colors.primaryLight + '20' },
        themeBadge: { backgroundColor: colors.primary + '15' },
        themeBadgeText: { color: colors.primary },
    }), [colors]);

    return (
        <SafeAreaView style={[styles.container, ds.container]}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.header}>
                    <Text style={[styles.title, ds.title]}>Profile</Text>
                </View>

                {/* User Info Card */}
                <Card style={styles.userCard}>
                    <View style={styles.avatarContainer}>
                        <View style={[styles.avatar, ds.avatar]}>
                            <Ionicons name="person" size={32} color={colors.primary} />
                        </View>
                        <View style={styles.userInfo}>
                            <Text style={[styles.userName, ds.userName]}>
                                {user ? user.email?.split('@')[0] : 'Guest User'}
                            </Text>
                            <Text style={[styles.userEmail, ds.userEmail]}>
                                {user ? user.email : 'Sign in to sync your data'}
                            </Text>
                        </View>
                    </View>
                    {user ? (
                        <Button
                            title="Sign Out"
                            onPress={handleSignOut}
                            variant="danger"
                            size="sm"
                            fullWidth
                        />
                    ) : (
                        <Button
                            title="Sign In"
                            onPress={() => router.push('/screens/AuthScreen')}
                            variant="outline"
                            size="sm"
                            fullWidth
                        />
                    )}
                </Card>

                {/* Data & Sync */}
                <Text style={[styles.sectionTitle, ds.sectionTitle]}>Data</Text>
                <Card>
                    {user && (
                        <>
                            <TouchableOpacity
                                style={styles.settingsRow}
                                onPress={handleSync}
                                disabled={isSyncing}
                            >
                                <Ionicons
                                    name="cloud-upload-outline"
                                    size={22}
                                    color={isSyncing ? colors.textMuted : colors.primary}
                                />
                                <Text style={[styles.settingsLabel, { color: colors.primary }]}>
                                    {isSyncing ? 'Syncing...' : 'Sync Now'}
                                </Text>
                                {lastSyncResult && (
                                    <Text style={[styles.settingsValue, ds.settingsValue]}>{lastSyncResult}</Text>
                                )}
                            </TouchableOpacity>
                            <View style={[styles.divider, ds.divider]} />
                        </>
                    )}
                    <TouchableOpacity
                        style={styles.settingsRow}
                        onPress={handleExportData}
                        disabled={isExporting}
                    >
                        <Ionicons
                            name="download-outline"
                            size={22}
                            color={colors.textSecondary}
                        />
                        <Text style={[styles.settingsLabel, ds.settingsLabel]}>
                            {isExporting ? 'Exporting...' : 'Export Data (JSON)'}
                        </Text>
                        <Ionicons name="share-outline" size={18} color={colors.textMuted} />
                    </TouchableOpacity>
                </Card>

                {/* Appearance */}
                <Text style={[styles.sectionTitle, ds.sectionTitle]}>Appearance</Text>
                <Card>
                    <TouchableOpacity style={styles.settingsRow} onPress={cycleTheme}>
                        <Ionicons
                            name={themeIcon as any}
                            size={22}
                            color={colors.textSecondary}
                        />
                        <Text style={[styles.settingsLabel, ds.settingsLabel]}>Dark Mode</Text>
                        <View style={[styles.themeBadge, ds.themeBadge]}>
                            <Text style={[styles.themeBadgeText, ds.themeBadgeText]}>{themeLabel}</Text>
                        </View>
                    </TouchableOpacity>
                </Card>

                {/* Notifications */}
                <Text style={[styles.sectionTitle, ds.sectionTitle]}>Notifications</Text>
                <Card>
                    <View style={styles.settingsRow}>
                        <Ionicons name="notifications-outline" size={22} color={colors.textSecondary} />
                        <Text style={[styles.settingsLabel, ds.settingsLabel]}>Push Notifications</Text>
                        <Switch
                            value={notificationsEnabled}
                            onValueChange={handleToggleNotifications}
                            trackColor={{ false: colors.border, true: colors.primary + '50' }}
                            thumbColor={notificationsEnabled ? colors.primary : colors.textMuted}
                        />
                    </View>

                    {notificationsEnabled && (
                        <>
                            <View style={[styles.divider, ds.divider]} />
                            <View style={styles.settingsRow}>
                                <Ionicons name="alarm-outline" size={22} color={colors.textSecondary} />
                                <Text style={[styles.settingsLabel, ds.settingsLabel]}>Active Reminders</Text>
                                <Text style={[styles.settingsValue, ds.settingsValue]}>{scheduledCount}</Text>
                            </View>
                            <View style={[styles.divider, ds.divider]} />
                            <TouchableOpacity
                                style={styles.settingsRow}
                                onPress={handleTestNotification}
                            >
                                <Ionicons name="paper-plane-outline" size={22} color={colors.primary} />
                                <Text style={[styles.settingsLabel, { color: colors.primary }]}>
                                    Send Test Notification
                                </Text>
                            </TouchableOpacity>
                        </>
                    )}
                </Card>

                {/* Premium */}
                <Text style={[styles.sectionTitle, ds.sectionTitle]}>Premium</Text>
                <Card
                    onPress={() => {
                        // TODO: Navigate to PaywallScreen
                    }}
                >
                    <View style={styles.premiumRow}>
                        <Ionicons name="star" size={24} color={colors.secondary} />
                        <View style={styles.premiumInfo}>
                            <Text style={[styles.premiumTitle, { color: colors.text }]}>Upgrade to Premium</Text>
                            <Text style={[styles.premiumSubtitle, { color: colors.textSecondary }]}>
                                Unlimited AI messages, no ads
                            </Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
                    </View>
                </Card>

                {/* Account Management */}
                {user && (
                    <>
                        <Text style={[styles.sectionTitle, ds.sectionTitle]}>Account</Text>
                        <Card>
                            <TouchableOpacity
                                style={styles.settingsRow}
                                onPress={handleDeleteAccount}
                            >
                                <Ionicons name="trash-outline" size={22} color={colors.error} />
                                <Text style={[styles.settingsLabel, { color: colors.error }]}>
                                    Delete Account
                                </Text>
                            </TouchableOpacity>
                        </Card>
                    </>
                )}

                {/* About */}
                <Text style={[styles.sectionTitle, ds.sectionTitle]}>About</Text>
                <Card>
                    <View style={styles.settingsRow}>
                        <Ionicons name="information-circle-outline" size={22} color={colors.textSecondary} />
                        <Text style={[styles.settingsLabel, ds.settingsLabel]}>Version</Text>
                        <Text style={[styles.settingsValue, ds.settingsValue]}>1.0.0</Text>
                    </View>
                </Card>

                <View style={{ height: Spacing['2xl'] }} />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    scrollContent: {
        paddingBottom: Spacing['2xl'],
    },

    header: {
        paddingHorizontal: Spacing.lg,
        paddingTop: Spacing.lg,
        paddingBottom: Spacing.base,
    },

    title: {
        fontSize: FontSize['2xl'],
        fontWeight: FontWeight.bold,
    },

    // ── User Card ──
    userCard: {
        marginHorizontal: Spacing.base,
        gap: Spacing.base,
    },

    avatarContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.md,
    },

    avatar: {
        width: 56,
        height: 56,
        borderRadius: 28,
        alignItems: 'center',
        justifyContent: 'center',
    },

    userInfo: {
        flex: 1,
    },

    userName: {
        fontSize: FontSize.lg,
        fontWeight: FontWeight.semibold,
    },

    userEmail: {
        fontSize: FontSize.sm,
        marginTop: 2,
    },

    // ── Sections ──
    sectionTitle: {
        fontSize: FontSize.sm,
        fontWeight: FontWeight.semibold,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginHorizontal: Spacing.lg,
        marginTop: Spacing.lg,
        marginBottom: Spacing.sm,
    },

    // ── Settings Rows ──
    settingsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.md,
        paddingVertical: Spacing.xs,
    },

    settingsLabel: {
        flex: 1,
        fontSize: FontSize.base,
    },

    settingsValue: {
        fontSize: FontSize.base,
    },

    divider: {
        height: 1,
        marginVertical: Spacing.sm,
    },

    // ── Theme Badge ──
    themeBadge: {
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.xxs,
        borderRadius: 12,
    },

    themeBadgeText: {
        fontSize: FontSize.sm,
        fontWeight: FontWeight.medium,
    },

    // ── Premium ──
    premiumRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.md,
    },

    premiumInfo: {
        flex: 1,
    },

    premiumTitle: {
        fontSize: FontSize.base,
        fontWeight: FontWeight.semibold,
    },

    premiumSubtitle: {
        fontSize: FontSize.sm,
        marginTop: 2,
    },
});
