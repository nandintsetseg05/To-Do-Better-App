import { Button } from '@/app/components/shared/Button';
import { Card } from '@/app/components/shared/Card';
import { Colors } from '@/app/constants/colors';
import { Spacing } from '@/app/constants/spacing';
import { FontSize, FontWeight } from '@/app/constants/typography';
import { notificationService } from '@/app/services/notifications';
import { syncService } from '@/app/services/sync';
import { useAuthStore } from '@/app/stores/useAuthStore';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
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
    const { user, signOut } = useAuthStore();
    const [notificationsEnabled, setNotificationsEnabled] = useState(false);
    const [scheduledCount, setScheduledCount] = useState(0);
    const [isSyncing, setIsSyncing] = useState(false);
    const [lastSyncResult, setLastSyncResult] = useState<string | null>(null);

    // Check notification status on mount
    useEffect(() => {
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

    const handleSignOut = async () => {
        Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Sign Out',
                style: 'destructive',
                onPress: async () => {
                    await signOut();
                },
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
        // Clear status after 3 seconds
        setTimeout(() => setLastSyncResult(null), 3000);
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.header}>
                    <Text style={styles.title}>Profile</Text>
                </View>

                {/* User Info Card */}
                <Card style={styles.userCard}>
                    <View style={styles.avatarContainer}>
                        <View style={styles.avatar}>
                            <Ionicons name="person" size={32} color={Colors.primary} />
                        </View>
                        <View style={styles.userInfo}>
                            <Text style={styles.userName}>
                                {user ? user.email?.split('@')[0] : 'Guest User'}
                            </Text>
                            <Text style={styles.userEmail}>
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

                {/* Data & Sync (signed-in users only) */}
                {user && (
                    <>
                        <Text style={styles.sectionTitle}>Data & Sync</Text>
                        <Card>
                            <TouchableOpacity
                                style={styles.settingsRow}
                                onPress={handleSync}
                                disabled={isSyncing}
                            >
                                <Ionicons
                                    name="cloud-upload-outline"
                                    size={22}
                                    color={isSyncing ? Colors.textMuted : Colors.primary}
                                />
                                <Text style={[styles.settingsLabel, { color: Colors.primary }]}>
                                    {isSyncing ? 'Syncing...' : 'Sync Now'}
                                </Text>
                                {lastSyncResult && (
                                    <Text style={styles.settingsValue}>{lastSyncResult}</Text>
                                )}
                            </TouchableOpacity>
                        </Card>
                    </>
                )}

                {/* Notifications Section */}
                <Text style={styles.sectionTitle}>Notifications</Text>
                <Card>
                    <View style={styles.settingsRow}>
                        <Ionicons name="notifications-outline" size={22} color={Colors.textSecondary} />
                        <Text style={styles.settingsLabel}>Push Notifications</Text>
                        <Switch
                            value={notificationsEnabled}
                            onValueChange={handleToggleNotifications}
                            trackColor={{ false: Colors.border, true: Colors.primary + '50' }}
                            thumbColor={notificationsEnabled ? Colors.primary : Colors.textMuted}
                        />
                    </View>

                    {notificationsEnabled && (
                        <>
                            <View style={styles.divider} />
                            <View style={styles.settingsRow}>
                                <Ionicons name="alarm-outline" size={22} color={Colors.textSecondary} />
                                <Text style={styles.settingsLabel}>Active Reminders</Text>
                                <Text style={styles.settingsValue}>{scheduledCount}</Text>
                            </View>
                            <View style={styles.divider} />
                            <TouchableOpacity
                                style={styles.settingsRow}
                                onPress={handleTestNotification}
                            >
                                <Ionicons name="paper-plane-outline" size={22} color={Colors.primary} />
                                <Text style={[styles.settingsLabel, { color: Colors.primary }]}>
                                    Send Test Notification
                                </Text>
                            </TouchableOpacity>
                        </>
                    )}
                </Card>

                {/* Settings Section */}
                <Text style={styles.sectionTitle}>Appearance</Text>
                <Card>
                    <SettingsRow
                        icon="moon-outline"
                        label="Dark Mode"
                        value="System"
                    />
                </Card>

                {/* Premium Section */}
                <Text style={styles.sectionTitle}>Premium</Text>
                <Card
                    onPress={() => {
                        // TODO: Navigate to PaywallScreen
                    }}
                >
                    <View style={styles.premiumRow}>
                        <Ionicons name="star" size={24} color={Colors.secondary} />
                        <View style={styles.premiumInfo}>
                            <Text style={styles.premiumTitle}>Upgrade to Premium</Text>
                            <Text style={styles.premiumSubtitle}>
                                Unlimited AI messages, no ads
                            </Text>
                        </View>
                        <Ionicons
                            name="chevron-forward"
                            size={20}
                            color={Colors.textMuted}
                        />
                    </View>
                </Card>

                {/* About */}
                <Text style={styles.sectionTitle}>About</Text>
                <Card>
                    <SettingsRow icon="information-circle-outline" label="Version" value="1.0.0" />
                </Card>
            </ScrollView>
        </SafeAreaView>
    );
}

function SettingsRow({
    icon,
    label,
    value,
}: {
    icon: keyof typeof Ionicons.glyphMap;
    label: string;
    value: string;
}) {
    return (
        <View style={styles.settingsRow}>
            <Ionicons name={icon} size={22} color={Colors.textSecondary} />
            <Text style={styles.settingsLabel}>{label}</Text>
            <Text style={styles.settingsValue}>{value}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
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
        color: Colors.text,
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
        backgroundColor: Colors.primaryLight + '20',
        alignItems: 'center',
        justifyContent: 'center',
    },

    userInfo: {
        flex: 1,
    },

    userName: {
        fontSize: FontSize.lg,
        fontWeight: FontWeight.semibold,
        color: Colors.text,
    },

    userEmail: {
        fontSize: FontSize.sm,
        color: Colors.textSecondary,
        marginTop: 2,
    },

    // ── Sections ──
    sectionTitle: {
        fontSize: FontSize.sm,
        fontWeight: FontWeight.semibold,
        color: Colors.textSecondary,
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
        color: Colors.text,
    },

    settingsValue: {
        fontSize: FontSize.base,
        color: Colors.textSecondary,
    },

    divider: {
        height: 1,
        backgroundColor: Colors.border,
        marginVertical: Spacing.sm,
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
        color: Colors.text,
    },

    premiumSubtitle: {
        fontSize: FontSize.sm,
        color: Colors.textSecondary,
        marginTop: 2,
    },
});
