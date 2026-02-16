import { Button } from '@/app/components/shared/Button';
import { Input } from '@/app/components/shared/Input';
import { Spacing } from '@/app/constants/spacing';
import { FontSize, FontWeight } from '@/app/constants/typography';
import { useColors } from '@/app/constants/useColors';
import { useAuthStore } from '@/app/stores/useAuthStore';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';

export default function AuthScreen() {
    const colors = useColors();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const { isLoading, error, isSignUp, signIn, signUp, toggleSignUp, resetPassword, setError } =
        useAuthStore();

    const handleSubmit = async () => {
        if (!email.trim()) {
            setError('Please enter your email');
            return;
        }
        if (!password) {
            setError('Please enter your password');
            return;
        }

        if (isSignUp) {
            await signUp(email, password);
        } else {
            await signIn(email, password);
        }
    };

    const handleForgotPassword = async () => {
        if (!email.trim()) {
            Alert.alert('Enter your email', 'Please enter your email address first, then tap "Forgot Password".');
            return;
        }
        const success = await resetPassword(email);
        if (success) {
            Alert.alert('Check your email', 'We sent you a password reset link.');
        }
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.flex}
            >
                <ScrollView
                    contentContainerStyle={styles.content}
                    keyboardShouldPersistTaps="handled"
                >
                    <Text style={[styles.title, { color: colors.text }]}>
                        {isSignUp ? 'Create Account ✨' : 'Welcome Back 👋'}
                    </Text>
                    <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                        {isSignUp
                            ? 'Sign up to sync your habits across devices'
                            : 'Sign in to sync your habits across devices'}
                    </Text>

                    <View style={styles.form}>
                        <Input
                            label="Email"
                            placeholder="your@email.com"
                            keyboardType="email-address"
                            autoCapitalize="none"
                            autoCorrect={false}
                            value={email}
                            onChangeText={(text) => {
                                setEmail(text);
                                if (error) setError(null);
                            }}
                        />

                        <Input
                            label="Password"
                            placeholder="••••••••"
                            secureTextEntry
                            value={password}
                            onChangeText={(text) => {
                                setPassword(text);
                                if (error) setError(null);
                            }}
                            error={error ?? undefined}
                        />

                        <Button
                            title={isSignUp ? 'Create Account' : 'Sign In'}
                            onPress={handleSubmit}
                            loading={isLoading}
                            fullWidth
                            size="lg"
                        />

                        {!isSignUp && (
                            <Button
                                title="Forgot Password?"
                                onPress={handleForgotPassword}
                                variant="ghost"
                                size="sm"
                            />
                        )}

                        <Button
                            title={isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
                            onPress={toggleSignUp}
                            variant="ghost"
                            fullWidth
                        />

                        <Button
                            title="Continue as Guest"
                            onPress={() => router.back()}
                            variant="ghost"
                            size="sm"
                        />
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    flex: {
        flex: 1,
    },

    content: {
        flexGrow: 1,
        paddingHorizontal: Spacing.lg,
        justifyContent: 'center',
    },

    title: {
        fontSize: FontSize['3xl'],
        fontWeight: FontWeight.bold,
        textAlign: 'center',
    },

    subtitle: {
        fontSize: FontSize.base,
        textAlign: 'center',
        marginTop: Spacing.sm,
        marginBottom: Spacing.xl,
    },

    form: {
        gap: Spacing.xs,
    },
});
