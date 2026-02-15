const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY ?? '';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

export interface HabitContext {
    habitName: string;
    emoji: string;
    currentStreak: number;
    isCompletedToday: boolean;
    totalHabits: number;
    completedToday: number;
}

/**
 * Gemini AI service — generates contextual motivational messages.
 *
 * Uses Gemini 2.0 Flash for fast, low-cost responses.
 */
export const geminiService = {
    /**
     * Generate a motivational message based on the user's habit context.
     */
    async getMotivation(context: HabitContext): Promise<string> {
        if (!GEMINI_API_KEY) {
            return getOfflineFallback(context);
        }

        try {
            const prompt = buildPrompt(context);

            const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [
                        {
                            parts: [{ text: prompt }],
                        },
                    ],
                    generationConfig: {
                        maxOutputTokens: 80,
                        temperature: 0.9,
                        topP: 0.95,
                    },
                    safetySettings: [
                        {
                            category: 'HARM_CATEGORY_HARASSMENT',
                            threshold: 'BLOCK_ONLY_HIGH',
                        },
                    ],
                }),
            });

            if (!response.ok) {
                console.warn('[Gemini] API error:', response.status);
                return getOfflineFallback(context);
            }

            const data = await response.json();
            const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

            if (!text) {
                return getOfflineFallback(context);
            }

            // Clean up response (remove markdown, trim)
            return text.replace(/\*\*/g, '').replace(/\*/g, '').trim();
        } catch (error) {
            console.warn('[Gemini] Request failed:', error);
            return getOfflineFallback(context);
        }
    },

    /**
     * Generate a streak celebration message.
     */
    async celebrateStreak(habitName: string, streakCount: number): Promise<string> {
        if (!GEMINI_API_KEY || streakCount < 3) {
            return `🔥 ${streakCount} day streak on ${habitName}! Keep it up!`;
        }

        try {
            const prompt = `You are a cheerful habit coach. The user just hit a ${streakCount}-day streak on "${habitName}". 
Write a SHORT (1 sentence, max 15 words) celebration message. Be enthusiastic and use 1-2 emojis. 
Don't use "great job" or "keep it up" - be creative.`;

            const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }],
                    generationConfig: { maxOutputTokens: 40, temperature: 1.0 },
                }),
            });

            if (!response.ok) return `🔥 ${streakCount} day streak! Amazing!`;

            const data = await response.json();
            const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
            return text?.replace(/\*\*/g, '').trim() || `🔥 ${streakCount} day streak!`;
        } catch {
            return `🔥 ${streakCount} day streak on ${habitName}!`;
        }
    },
};

// ── Prompt Engineering ──

function buildPrompt(ctx: HabitContext): string {
    const timeOfDay = getTimeOfDay();
    const progress = `${ctx.completedToday}/${ctx.totalHabits}`;

    let situationHint = '';
    if (ctx.completedToday === 0) {
        situationHint = 'The user hasn\'t started yet today. Encourage them gently to begin.';
    } else if (ctx.completedToday === ctx.totalHabits) {
        situationHint = 'The user completed ALL their habits today! Celebrate their achievement.';
    } else if (ctx.completedToday >= ctx.totalHabits * 0.7) {
        situationHint = 'The user is almost done! Push them to finish the last few.';
    } else {
        situationHint = 'The user is making progress. Encourage them to keep going.';
    }

    if (ctx.currentStreak > 7) {
        situationHint += ` They have an impressive ${ctx.currentStreak}-day streak — acknowledge it!`;
    }

    return `You are a warm, encouraging habit coach inside a mobile app called "To Do Better".
It's ${timeOfDay}. The user has completed ${progress} habits today.
${situationHint}

Write a SHORT motivational message (1-2 sentences, max 25 words total).
Rules:
- Use 1-2 relevant emojis
- Be warm and personal, not generic
- Vary your tone (sometimes playful, sometimes calm, sometimes energetic)
- Never say "I" or refer to yourself
- Don't use quotes or markdown`;
}

function getTimeOfDay(): string {
    const hour = new Date().getHours();
    if (hour < 6) return 'very early morning';
    if (hour < 12) return 'morning';
    if (hour < 17) return 'afternoon';
    if (hour < 21) return 'evening';
    return 'late night';
}

// ── Offline Fallbacks ──

const FALLBACK_MESSAGES = {
    notStarted: [
        '🌅 A fresh day, a fresh start. You\'ve got this!',
        '☀️ Today is full of potential. Start with one small win.',
        '🎯 Every journey begins with a single step. Ready?',
        '💫 Yesterday is gone, today is yours. Let\'s go!',
    ],
    inProgress: [
        '💪 You\'re making it happen! Keep that momentum.',
        '🚀 Look at you go! Every habit counts.',
        '⚡ You\'re on a roll — don\'t stop now!',
        '🌟 Progress, not perfection. And you\'re progressing!',
    ],
    almostDone: [
        '🏁 So close! Just a few more to crush it.',
        '🔥 Almost there! Finish strong!',
        '⭐ The finish line is in sight. Push through!',
    ],
    allDone: [
        '🎉 All habits done! You\'re unstoppable today!',
        '👑 100% complete — what a champion!',
        '🏆 Perfect day! Your future self thanks you.',
        '✨ Every single one done. That\'s discipline!',
    ],
};

function getOfflineFallback(ctx: HabitContext): string {
    let pool: string[];

    if (ctx.completedToday === ctx.totalHabits && ctx.totalHabits > 0) {
        pool = FALLBACK_MESSAGES.allDone;
    } else if (ctx.completedToday >= ctx.totalHabits * 0.7) {
        pool = FALLBACK_MESSAGES.almostDone;
    } else if (ctx.completedToday > 0) {
        pool = FALLBACK_MESSAGES.inProgress;
    } else {
        pool = FALLBACK_MESSAGES.notStarted;
    }

    return pool[Math.floor(Math.random() * pool.length)];
}
