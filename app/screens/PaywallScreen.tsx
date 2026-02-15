import { Button } from '@/app/components/shared/Button';
import { Card } from '@/app/components/shared/Card';
import { Colors } from '@/app/constants/colors';
import { Config } from '@/app/constants/config';
import { BorderRadius, Spacing } from '@/app/constants/spacing';
import { FontSize, FontWeight } from '@/app/constants/typography';
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
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                {/* Crown Header */}
                <View style={styles.header}>
                    <View style={styles.crownCircle}>
                        <Ionicons name="star" size={40} color={Colors.secondary} />
                    </View>
                    <Text style={styles.title}>Go Premium ✨</Text>
                    <Text style={styles.subtitle}>
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
                                color={Colors.primary}
                            />
                            <Text style={styles.featureLabel}>{feature.label}</Text>
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
                        <Text style={styles.bestValueBadge}>BEST VALUE</Text>
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
        backgroundColor: Colors.background,
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
        backgroundColor: Colors.secondaryLight + '30',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: Spacing.base,
    },

    title: {
        fontSize: FontSize['3xl'],
        fontWeight: FontWeight.extrabold,
        color: Colors.text,
        textAlign: 'center',
    },

    subtitle: {
        fontSize: FontSize.base,
        color: Colors.textSecondary,
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
        color: Colors.text,
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
        color: Colors.primary,
        backgroundColor: Colors.primaryLight + '20',
        paddingVertical: 2,
        paddingHorizontal: Spacing.sm,
        borderRadius: BorderRadius.sm,
        overflow: 'hidden',
    },
});
