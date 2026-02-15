import { authService } from '@/app/services/auth';
import type { Session, User } from '@supabase/supabase-js';
import { create } from 'zustand';

interface AuthState {
    session: Session | null;
    user: User | null;
    isLoading: boolean;
    error: string | null;
    isSignUp: boolean;

    // Actions
    setSession: (session: Session | null) => void;
    setError: (error: string | null) => void;
    toggleSignUp: () => void;
    signIn: (email: string, password: string) => Promise<void>;
    signUp: (email: string, password: string) => Promise<void>;
    signOut: () => Promise<void>;
    resetPassword: (email: string) => Promise<boolean>;
    initialize: () => () => void; // returns unsubscribe
}

export const useAuthStore = create<AuthState>((set, get) => ({
    session: null,
    user: null,
    isLoading: true,
    error: null,
    isSignUp: false,

    setSession: (session) =>
        set({ session, user: session?.user ?? null }),

    setError: (error) => set({ error }),

    toggleSignUp: () =>
        set((state) => ({ isSignUp: !state.isSignUp, error: null })),

    signIn: async (email, password) => {
        set({ isLoading: true, error: null });
        const result = await authService.signIn(email, password);
        if (!result.success) {
            set({ isLoading: false, error: result.error });
        }
        // Session will be updated via onAuthStateChange listener
    },

    signUp: async (email, password) => {
        set({ isLoading: true, error: null });
        const result = await authService.signUp(email, password);
        if (!result.success) {
            set({ isLoading: false, error: result.error });
        } else {
            set({
                isLoading: false,
                error: null,
            });
        }
    },

    signOut: async () => {
        set({ isLoading: true });
        await authService.signOut();
        set({ session: null, user: null, isLoading: false });
    },

    resetPassword: async (email) => {
        set({ isLoading: true, error: null });
        const result = await authService.resetPassword(email);
        set({ isLoading: false });
        if (!result.success) {
            set({ error: result.error });
            return false;
        }
        return true;
    },

    /**
     * Initialize auth — restore session and listen for changes.
     * Call this once in _layout.tsx. Returns unsubscribe function.
     */
    initialize: () => {
        // Restore existing session
        authService.getSession().then((session) => {
            set({ session, user: session?.user ?? null, isLoading: false });
        });

        // Listen for auth state changes (sign in, sign out, token refresh)
        const unsubscribe = authService.onAuthStateChange((session) => {
            set({ session, user: session?.user ?? null, isLoading: false });
        });

        return unsubscribe;
    },
}));
