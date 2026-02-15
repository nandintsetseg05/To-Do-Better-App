/**
 * To Do Better — App Configuration
 * Feature flags, rate limits, and runtime constants.
 */

export const Config = {
    // ── Feature Flags ──
    AI_ENABLED: true,
    ADS_ENABLED: true,
    SYNC_ENABLED: true,

    // ── AI Rate Limits ──
    FREE_AI_MESSAGES_PER_DAY: 5,

    // ── Sync ──
    SYNC_DEBOUNCE_MS: 5000,         // Wait 5s after last write before syncing
    SYNC_NOTIFICATION_COUNT: 30,    // Schedule next 30 notification occurrences

    // ── Ads ──
    INTERSTITIAL_COOLDOWN_HOURS: 24, // 1 interstitial ad per 24 hours

    // ── Streaks ──
    STREAK_MILESTONE_SMALL: 7,
    STREAK_MILESTONE_MEDIUM: 30,
    STREAK_MILESTONE_LARGE: 100,
    STREAK_LOOKBACK_DAYS: 365,      // Look back 1 year for streak calculation

    // ── Performance ──
    HEATMAP_DAYS: 365,
    MESSAGE_HISTORY_PAGE_SIZE: 50,

    // ── Premium ──
    PREMIUM_MONTHLY_PRICE: '$2.99',
    PREMIUM_YEARLY_PRICE: '$24.99',
} as const;
