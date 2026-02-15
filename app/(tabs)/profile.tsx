import { Button } from '@/app/components/shared/Button';
import { Card } from '@/app/components/shared/Card';
import { Colors } from '@/app/constants/colors';
import { Spacing } from '@/app/constants/spacing';
import { FontSize, FontWeight } from '@/app/constants/typography';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';

export default function ProfileScreen() {
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
                            <Text style={styles.userName}>Guest User</Text>
                            <Text style={styles.userEmail}>Sign in to sync your data</Text>
                        </View>
                    </View>
                    <Button
                        title="Sign In"
                        onPress={() => {
                            // TODO: Navigate to AuthScreen
                        }}
                        variant="outline"
                        size="sm"
                        fullWidth
                    />
                </Card>

                {/* Settings Section */}
                <Text style={styles.sectionTitle}>Settings</Text>
                <Card>
                    <SettingsRow
                        icon="notifications-outline"
                        label="Notifications"
                        value="On"
                    />
                    <View style={styles.divider} />
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
