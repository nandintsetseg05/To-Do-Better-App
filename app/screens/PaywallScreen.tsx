import { Button } from '@/app/components/shared/Button';
import { Card } from '@/app/components/shared/Card';
import { Config } from '@/app/constants/config';
import { BorderRadius, Spacing } from '@/app/constants/spacing';
import { FontSize, FontWeight } from '@/app/constants/typography';
import { useColors } from '@/app/constants/useColors';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    SafeAreaView,
    StyleSheet,
    Text,
    View,
} from 'react-native';

const PREMIUM_FEATURES = [
    { icon: 'chatbubble-ellipses', label: 'Unlimited AI motivational messages' },
    { icon: 'eye-off', label: 'No advertisements' },
    { icon: 'analytics', label: 'Advanced analytics & insights' },
    { icon: 'cloud-upload', label: 'Priority cloud sync' },
] as const;

export default function PaywallScreen() {
    const colors = useColors();

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.content}>
                {/* Crown Header */}
                <View style={styles.header}>
                    <View style={[styles.crownCircle, { backgroundColor: colors.secondaryLight + '30' }]}>
                        <Ionicons name="star" size={40} color={colors.secondary} />
                    </View>
                    <Text style={[styles.title, { color: colors.text }]}>Go Premium ✨</Text>
                    <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                        Unlock the full To Do Better experience
                    </Text>
                </View>

                {/* Features */}
                <Card style={styles.featuresCard}>
                    {PREMIUM_FEATURES.map((feature, index) => (
                        <View key={index} style={styles.featureRow}>
                            <Ionicons
                                name={feature.icon as keyof typeof Ionicons.glyphMap}
                                size={22}
                                color={colors.primary}
                            />
                            <Text style={[styles.featureLabel, { color: colors.text }]}>{feature.label}</Text>
                        </View>
                    ))}
                </Card>

                {/* Pricing CTAs */}
                <View style={styles.pricingSection}>
                    <Button
                        title={`Monthly — ${Config.PREMIUM_MONTHLY_PRICE}/mo`}
                        onPress={() => {
                            // TODO: RevenueCat purchase
                        }}
                        variant="outline"
                        fullWidth
                        size="lg"
                    />

                    <View style={styles.bestValue}>
                        <Text style={[styles.bestValueBadge, { color: colors.primary, backgroundColor: colors.primaryLight + '20' }]}>BEST VALUE</Text>
                    </View>

                    <Button
                        title={`Yearly — ${Config.PREMIUM_YEARLY_PRICE}/yr`}
                        onPress={() => {
                            // TODO: RevenueCat purchase
                        }}
                        fullWidth
                        size="lg"
                    />
                </View>

                {/* Restore */}
                <Button
                    title="Restore Purchases"
                    onPress={() => {
                        // TODO: RevenueCat restore
                    }}
                    variant="ghost"
                    size="sm"
                />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    content: {
        flex: 1,
        paddingHorizontal: Spacing.lg,
        alignItems: 'center',
        justifyContent: 'center',
    },

    header: {
        alignItems: 'center',
        marginBottom: Spacing.xl,
    },

    crownCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: Spacing.base,
    },

    title: {
        fontSize: FontSize['3xl'],
        fontWeight: FontWeight.extrabold,
        textAlign: 'center',
    },

    subtitle: {
        fontSize: FontSize.base,
        textAlign: 'center',
        marginTop: Spacing.xs,
    },

    featuresCard: {
        width: '100%',
        gap: Spacing.md,
        marginBottom: Spacing.xl,
    },

    featureRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.md,
    },

    featureLabel: {
        fontSize: FontSize.base,
        flex: 1,
    },

    pricingSection: {
        width: '100%',
        gap: Spacing.sm,
        marginBottom: Spacing.base,
    },

    bestValue: {
        alignItems: 'center',
    },

    bestValueBadge: {
        fontSize: FontSize.xs,
        fontWeight: FontWeight.bold,
        paddingVertical: 2,
        paddingHorizontal: Spacing.sm,
        borderRadius: BorderRadius.sm,
        overflow: 'hidden',
    },
});
