import { Button } from '@/app/components/shared/Button';
import { Input } from '@/app/components/shared/Input';
import { Colors } from '@/app/constants/colors';
import { Spacing } from '@/app/constants/spacing';
import { FontSize, FontWeight } from '@/app/constants/typography';
import React from 'react';
import {
    SafeAreaView,
    StyleSheet,
    Text,
    View,
} from 'react-native';

export default function AuthScreen() {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>Welcome Back 👋</Text>
                <Text style={styles.subtitle}>
                    Sign in to sync your habits across devices
                </Text>

                <View style={styles.form}>
                    <Input
                        label="Email"
                        placeholder="your@email.com"
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />

                    <Input
                        label="Password"
                        placeholder="••••••••"
                        secureTextEntry
                    />

                    <Button
                        title="Sign In"
                        onPress={() => {
                            // TODO: Implement Supabase auth
                        }}
                        fullWidth
                        size="lg"
                    />

                    <Button
                        title="Create Account"
                        onPress={() => {
                            // TODO: Toggle sign up form
                        }}
                        variant="ghost"
                        fullWidth
                    />
                </View>
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
        justifyContent: 'center',
    },

    title: {
        fontSize: FontSize['3xl'],
        fontWeight: FontWeight.bold,
        color: Colors.text,
        textAlign: 'center',
    },

    subtitle: {
        fontSize: FontSize.base,
        color: Colors.textSecondary,
        textAlign: 'center',
        marginTop: Spacing.sm,
        marginBottom: Spacing.xl,
    },

    form: {
        gap: Spacing.xs,
    },
});
