import type { AuthError, Session, User } from '@supabase/supabase-js';
import { supabase } from './supabase';

export interface AuthResult {
    success: boolean;
    error?: string;
}

/**
 * Auth service — wraps Supabase auth methods with error handling.
 */
export const authService = {
    /**
     * Sign in with email and password.
     */
    async signIn(email: string, password: string): Promise<AuthResult> {
        const { error } = await supabase.auth.signInWithPassword({
            email: email.trim().toLowerCase(),
            password,
        });

        if (error) return { success: false, error: mapAuthError(error) };
        return { success: true };
    },

    /**
     * Create a new account.
     */
    async signUp(email: string, password: string): Promise<AuthResult> {
        if (password.length < 6) {
            return { success: false, error: 'Password must be at least 6 characters' };
        }

        const { error } = await supabase.auth.signUp({
            email: email.trim().toLowerCase(),
            password,
        });

        if (error) return { success: false, error: mapAuthError(error) };
        return { success: true };
    },

    /**
     * Sign out the current user.
     */
    async signOut(): Promise<AuthResult> {
        const { error } = await supabase.auth.signOut();
        if (error) return { success: false, error: error.message };
        return { success: true };
    },

    /**
     * Get the current session (from secure storage).
     */
    async getSession(): Promise<Session | null> {
        const { data } = await supabase.auth.getSession();
        return data.session;
    },

    /**
     * Get the current user.
     */
    async getUser(): Promise<User | null> {
        const { data } = await supabase.auth.getUser();
        return data.user;
    },

    /**
     * Listen for auth state changes.
     * Returns an unsubscribe function.
     */
    onAuthStateChange(callback: (session: Session | null) => void) {
        const { data } = supabase.auth.onAuthStateChange((_event, session) => {
            callback(session);
        });
        return data.subscription.unsubscribe;
    },

    /**
     * Send a password reset email.
     */
    async resetPassword(email: string): Promise<AuthResult> {
        const { error } = await supabase.auth.resetPasswordForEmail(
            email.trim().toLowerCase()
        );
        if (error) return { success: false, error: mapAuthError(error) };
        return { success: true };
    },
};

/**
 * Map Supabase auth errors to user-friendly messages.
 */
function mapAuthError(error: AuthError): string {
    const msg = error.message.toLowerCase();

    if (msg.includes('invalid login credentials'))
        return 'Incorrect email or password';
    if (msg.includes('email not confirmed'))
        return 'Please check your email to confirm your account';
    if (msg.includes('already registered') || msg.includes('already exists'))
        return 'An account with this email already exists';
    if (msg.includes('rate limit'))
        return 'Too many attempts. Please try again later';
    if (msg.includes('network'))
        return 'No internet connection. Please try again';

    return error.message;
}
