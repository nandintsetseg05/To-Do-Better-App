# 🏗️ TO DO BETTER — Master Build Checklist

> **How to use this file:**
> - Work through each phase in order — later phases depend on earlier ones.
> - Mark items `[x]` when done, `[/]` when in progress.
> - Each task has a brief "why" so any developer or AI knows the purpose.
> - Reference `TO_DO_BETTER_BRAIN.md` for architecture details and code samples.

---

## Phase 1 — Project Foundation (Week 1–2)

### 1.1 Initialize Expo Project
- [ ] Run `npx create-expo-app@latest ./` with TypeScript template inside the project root
- [ ] Verify the project starts with `npx expo start` (should show Expo welcome screen)
- [ ] Configure `app.json` — set `name`, `slug`, `version`, `orientation`, `icon`, `splash`, `bundleIdentifier` (iOS) and `package` (Android)
- [ ] Add `.env` file to `.gitignore` (never commit secrets)
- [ ] Create `.env.example` with placeholder keys (see Brain §10)
- [ ] Install `react-native-dotenv` or `expo-constants` for env variable access
- [ ] Set up `tsconfig.json` path aliases (`@components/*`, `@services/*`, `@utils/*`, etc.)

### 1.2 Install Core Dependencies
- [ ] Install React Navigation: `@react-navigation/native`, `@react-navigation/bottom-tabs`, `@react-navigation/native-stack`
- [ ] Install React Navigation peer deps: `react-native-screens`, `react-native-safe-area-context`
- [ ] Install Zustand for state management
- [ ] Install WatermelonDB (`@nozbe/watermelondb`, `@nozbe/with-observables`)
- [ ] Configure WatermelonDB native adapter (follow Expo setup guide — may need config plugin)
- [ ] Install `react-native-reanimated` and add Babel plugin to `babel.config.js`
- [ ] Install `react-native-gesture-handler`
- [ ] Install `react-native-svg`
- [ ] Install `expo-notifications`
- [ ] Install date utility library (`date-fns` recommended for tree-shaking)
- [ ] Verify all installs compile: run `npx expo start` → no red errors

### 1.3 Create Folder Structure
- [ ] Create `app/components/habits/` directory
- [ ] Create `app/components/tasks/` directory
- [ ] Create `app/components/calendar/` directory
- [ ] Create `app/components/shared/` directory
- [ ] Create `app/components/ads/` directory
- [ ] Create `app/screens/` directory
- [ ] Create `app/navigation/` directory
- [ ] Create `app/models/` directory
- [ ] Create `app/services/` directory
- [ ] Create `app/stores/` directory
- [ ] Create `app/utils/` directory
- [ ] Create `app/constants/` directory
- [ ] Create `supabase/functions/generate-motivation/` directory
- [ ] Create `supabase/functions/sync-handler/` directory

### 1.4 Design System & Constants
- [ ] Create `app/constants/colors.ts` — define full color palette (primary, secondary, surface, background, text, success, warning, error, streak colors, heatmap intensity scale)
- [ ] Create `app/constants/config.ts` — feature flags (`AI_ENABLED`, `ADS_ENABLED`), API URLs, rate limits
- [ ] Create `app/constants/typography.ts` — font sizes, weights, line heights
- [ ] Create `app/constants/spacing.ts` — consistent spacing scale (4, 8, 12, 16, 24, 32, 48)

### 1.5 Shared UI Components
- [ ] Build `app/components/shared/Button.tsx` — primary, secondary, outline, danger variants; loading state; disabled state; `accessibilityLabel` prop
- [ ] Build `app/components/shared/Input.tsx` — text input with label, error message, icon support
- [ ] Build `app/components/shared/Card.tsx` — reusable container with shadow, border radius, padding
- [ ] Build `app/components/shared/EmptyState.tsx` — illustration + message + CTA button for empty lists
- [ ] Build `app/components/shared/LoadingSkeleton.tsx` — shimmer placeholder for loading states
- [ ] Build `app/components/shared/ModalWrapper.tsx` — reusable bottom sheet / modal with backdrop

### 1.6 Navigation Setup
- [ ] Build `app/navigation/AppNavigator.tsx` — root stack navigator
- [ ] Create bottom tab navigator with 3 tabs: **Today**, **Calendar**, **Profile**
- [ ] Add tab bar icons (use `@expo/vector-icons` — Ionicons or MaterialCommunityIcons)
- [ ] Create placeholder screens: `HomeScreen.tsx`, `CalendarScreen.tsx`, `ProfileScreen.tsx`
- [ ] Add `AuthScreen.tsx` placeholder (will be fleshed out in Phase 4)
- [ ] Add `PaywallScreen.tsx` placeholder (will be fleshed out in Phase 7)
- [ ] Implement conditional auth flow: show `AuthScreen` if not logged in, `MainTabs` if logged in
- [ ] Verify navigation works: can tap between all 3 tabs, smooth transitions

---

## Phase 2 — Local Database & CRUD (Week 2–3)

### 2.1 WatermelonDB Schema & Models
- [ ] Create `app/models/schema.ts` — full schema with tables: `habits`, `one_time_tasks`, `completions`, `streaks` (see Brain §4.2)
- [ ] Create `app/models/Habit.ts` — WatermelonDB Model class with all columns, `@readonly` for `created_at`, observable queries for completions
- [ ] Create `app/models/Task.ts` — Model class for one-time tasks
- [ ] Create `app/models/Completion.ts` — Model class, belongs-to relationship with Habit
- [ ] Create `app/models/Streak.ts` — Model class, belongs-to relationship with Habit
- [ ] Create `app/models/database.ts` — initialize WatermelonDB with SQLite adapter, register all models
- [ ] Create `app/models/index.ts` — re-export everything for clean imports
- [ ] Test: create a habit record in code, close app, reopen → record persists

### 2.2 Zustand Stores
- [ ] Create `app/stores/habitStore.ts` — actions: `createHabit()`, `updateHabit()`, `deleteHabit()`, `toggleComplete()`, `getHabitsForToday()`, `getHabitById()`
- [ ] Create `app/stores/taskStore.ts` — actions: `createTask()`, `updateTask()`, `deleteTask()`, `toggleTaskComplete()`, `getIncompleteTasks()`, `getTaskById()`
- [ ] Create `app/stores/authStore.ts` — state: `user`, `isAuthenticated`, `isPremium`; actions: `signIn()`, `signOut()`, `checkPremium()`
- [ ] Create `app/stores/settingsStore.ts` — state: `notificationsEnabled`, `theme`; actions: `toggleNotifications()`, `setTheme()`
- [ ] Wire stores to WatermelonDB — each store action should read/write through WatermelonDB, not just in-memory

### 2.3 Habit CRUD UI
- [ ] Build `app/components/habits/HabitForm.tsx` — form with fields: title (required), description (optional), color picker, icon picker, recurrence type selector, reminder toggle + time picker
- [ ] Build `app/components/habits/RecurrenceSelector.tsx` — UI to choose: Daily / Weekly (with day-of-week checkboxes) / Custom (every N days)
- [ ] Build `app/components/habits/HabitCard.tsx` — displays: title, streak badge, color indicator, checkbox, swipe actions (edit, delete)
- [ ] Build `app/components/habits/StreakBadge.tsx` — small pill showing 🔥 + streak count, color changes at milestones (7, 30, 100)
- [ ] Add "Create Habit" FAB (floating action button) to HomeScreen
- [ ] Wire FAB → opens HabitForm in a modal
- [ ] Wire HabitForm submit → calls `habitStore.createHabit()` → saves to WatermelonDB
- [ ] Wire HabitCard checkbox → calls `habitStore.toggleComplete()` → writes completion record
- [ ] Wire HabitCard swipe-edit → opens HabitForm pre-filled with existing data
- [ ] Wire HabitCard swipe-delete → soft-delete with confirmation dialog
- [ ] Test full flow: create habit → see it in list → check it off → edit title → delete it

### 2.4 Task CRUD UI
- [ ] Build `app/components/tasks/TaskForm.tsx` — form with fields: title (required), description (optional), due date (date picker), priority (low/medium/high)
- [ ] Build `app/components/tasks/TaskCard.tsx` — displays: title, due date, priority indicator (colored dot), checkbox, swipe actions
- [ ] Add tab toggle at top of HomeScreen: **Habits** | **Tasks**
- [ ] When "Tasks" tab selected, show list of incomplete one-time tasks sorted by due date
- [ ] Wire task creation, editing, completion, deletion (same patterns as habits)
- [ ] Completed tasks move to a "Completed" section at bottom of list (collapsed by default)
- [ ] Test full flow: create task with due date → see priority color → complete it → it moves to "Completed"

### 2.5 HomeScreen Polish
- [ ] Show today's date at the top of HomeScreen ("Tuesday, February 15")
- [ ] Show greeting based on time of day ("Good morning!", "Good afternoon!", etc.)
- [ ] If Habits tab: show only habits due today (use RecurrenceEngine — see Phase 3)
- [ ] If no habits/tasks exist, show `EmptyState` component with call-to-action
- [ ] Add pull-to-refresh gesture (refreshes list from DB)
- [ ] Add smooth list animations when items are added/removed (`LayoutAnimation` or `reanimated`)

---

## Phase 3 — Recurrence Engine & Streaks (Week 3–4)

### 3.1 Recurrence Engine
- [ ] Create `app/utils/recurrenceEngine.ts` (see Brain §6.1 for full code)
- [ ] Implement `isDueOnDate(config, date)` — returns boolean
  - [ ] Handle `daily` — always true
  - [ ] Handle `weekly` — check `date.getDay()` against config.days array
  - [ ] Handle `custom` — every N days from habit creation date
- [ ] Implement `getNextOccurrences(config, fromDate, count)` — returns Date[]
- [ ] Write unit tests for recurrence engine:
  - [ ] Test daily habit: due every day ✓
  - [ ] Test weekly Mon/Wed/Fri: due on those days ✓, not Tue/Thu ✗
  - [ ] Test custom every 3 days: correct pattern
  - [ ] Test edge case: month boundaries, leap years

### 3.2 Date Helpers
- [ ] Create `app/utils/dateHelpers.ts`
- [ ] `isSameDay(date1, date2)` — ignores time, compares year/month/day
- [ ] `isToday(date)` — checks against current date in user's timezone
- [ ] `formatDate(date, format)` — wrapper around `date-fns` format
- [ ] `getStartOfDay(date)` / `getEndOfDay(date)`
- [ ] `getDaysBetween(date1, date2)` — returns integer count
- [ ] `toUserTimezone(date, timezone)` — converts UTC to user's local time
- [ ] Write unit tests for all helpers

### 3.3 Streak Calculator
- [ ] Create `app/utils/streakCalculator.ts` (see Brain §6.2 for full code)
- [ ] Implement `calculate(completions, config, today)` — returns `{ current, longest, broken }`
- [ ] Handle edge case: weekly habit — non-due days don't break streak
- [ ] Handle edge case: habit created today — streak is 0 or 1
- [ ] Handle edge case: no completions at all — streak is 0
- [ ] Handle edge case: every completion missed — streak is 0, broken is true
- [ ] Write unit tests:
  - [ ] Daily habit with 7 consecutive days → current: 7
  - [ ] Daily habit missed yesterday → current: 0, broken: true
  - [ ] Weekly habit completed on all scheduled days → streak counts only due-day completions
  - [ ] Streak broken then restarted → longest > current

### 3.4 Wire Streaks to UI
- [ ] When habit is completed → recalculate streak via `StreakCalculator`
- [ ] Update `streaks` table in WatermelonDB with new values
- [ ] `StreakBadge` component reads from streaks table and displays current count
- [ ] On HomeScreen, sort habits: incomplete first (by creation date), then completed
- [ ] Visual indicator when streak is "at risk" (due today but not completed yet, nearing end of day)

### 3.5 Celebration Animations
- [ ] Build `app/components/shared/ConfettiAnimation.tsx` — bursts confetti particles using `react-native-reanimated`
- [ ] Trigger confetti on habit completion (checkbox tap → small burst)
- [ ] Special celebration for streak milestones (7 days → bigger burst, 30 days → full screen, 100 days → extra special)
- [ ] Add haptic feedback on completion (`expo-haptics`)
- [ ] Add satisfying sound effect (short "ding" on completion) — optional, respects notification settings

---

## Phase 4 — Backend & Authentication (Week 6–7)

### 4.1 Supabase Project Setup
- [ ] Create Supabase project at [supabase.com](https://supabase.com)
- [ ] Note the project URL and anon key → add to `.env`
- [ ] Run all SQL `CREATE TABLE` statements from Brain §4.1
- [ ] Add Row Level Security (RLS) policies:
  - [ ] `users`: users can only read/update their own row
  - [ ] `habits`: users can only CRUD their own habits
  - [ ] `one_time_tasks`: users can only CRUD their own tasks
  - [ ] `completions`: users can only CRUD their own completions
  - [ ] `streaks`: users can only read/update their own streaks
  - [ ] `ai_messages_cache`: users can only read their own messages
- [ ] Create database indexes (see Brain §4.1 — completions indexes)
- [ ] Test RLS: try querying another user's data → should get empty result

### 4.2 Supabase Client
- [ ] Install `@supabase/supabase-js`
- [ ] Create `app/services/supabase.ts` — initialize Supabase client with URL + anon key
- [ ] Configure `supabase.auth` to use Expo's secure storage for session persistence (`expo-secure-store`)
- [ ] Test connection: run a simple `supabase.from('users').select('*')` → should connect (empty result is fine)

### 4.3 Authentication UI
- [ ] Build `app/screens/AuthScreen.tsx`:
  - [ ] Email + password input fields
  - [ ] "Sign Up" / "Log In" toggle
  - [ ] "Forgot Password?" link
  - [ ] Google sign-in button
  - [ ] Apple sign-in button (iOS only)
  - [ ] Input validation (email format, password min length)
  - [ ] Error messages (wrong password, account exists, etc.)
  - [ ] Loading spinner during auth
- [ ] Implement email/password sign-up: `supabase.auth.signUp()`
- [ ] Implement email/password login: `supabase.auth.signInWithPassword()`
- [ ] Implement Google OAuth: configure Google provider in Supabase dashboard, use `expo-auth-session`
- [ ] Implement Apple sign-in: configure Apple provider, use `expo-apple-authentication`
- [ ] Implement password reset: `supabase.auth.resetPasswordForEmail()`
- [ ] On successful auth: create row in `users` table (if new user), update `authStore`
- [ ] On app launch: check for existing session with `supabase.auth.getSession()`
- [ ] Implement sign-out: `supabase.auth.signOut()`, clear local data if desired
- [ ] Test full auth flow: sign up → verify email (if configured) → log in → close app → reopen → still logged in → sign out

### 4.4 Data Sync Engine
- [ ] Create `app/services/sync.ts` (see Brain §7.2)
- [ ] Create Supabase RPC function `pull_changes(last_pulled_at)`:
  - [ ] Query each table for rows where `updated_at > last_pulled_at` AND `user_id = auth.uid()`
  - [ ] Return created, updated, deleted records grouped by table
- [ ] Create Supabase RPC function `push_changes(changes)`:
  - [ ] Upsert each local change to the corresponding table
  - [ ] Use `ON CONFLICT` to handle duplicates
  - [ ] Apply "last write wins" using `updated_at` comparison
- [ ] Implement `SyncService.performSync()` using WatermelonDB's `synchronize()` function
- [ ] Handle sync conflicts: if same record modified locally and remotely, keep the one with the later `updated_at`
- [ ] Add sync status indicator to UI (subtle icon: syncing / synced / offline)
- [ ] Auto-sync on app foreground (AppState listener)
- [ ] Auto-sync after any local write (debounced, 5-second delay to batch writes)
- [ ] Test offline scenario: turn off WiFi → create habit → turn on WiFi → verify it syncs
- [ ] Test conflict scenario: edit habit on "device A" offline → edit same on "device B" → sync both → verify last write wins

### 4.5 Realtime Subscriptions
- [ ] Set up Supabase Realtime channel in `sync.ts`
- [ ] Subscribe to changes on all user-specific tables (`filter: user_id=eq.{userId}`)
- [ ] On receiving remote change → trigger `performSync()` to pull latest
- [ ] Unsubscribe on sign-out
- [ ] Test: modify a habit directly in Supabase dashboard → app should reflect change within seconds

---

## Phase 5 — AI Motivational Messages (Week 8–9)

### 5.1 Backend Edge Function
- [ ] Install Supabase CLI: `npm install -g supabase`
- [ ] Initialize Supabase locally: `supabase init`
- [ ] Create Edge Function: `supabase functions new generate-motivation`
- [ ] Implement `supabase/functions/generate-motivation/index.ts` (see Brain §7.1):
  - [ ] Parse request body: `{ userId, habitId, taskId, streakData }`
  - [ ] Fetch user record (name, is_premium)
  - [ ] Rate-limit check for free users: count today's AI messages ≤ 5
  - [ ] If over limit → return static fallback message
  - [ ] Fetch habit/task details (title, description)
  - [ ] Construct Claude prompt with user context (name, habit, streak, tone)
  - [ ] Call Anthropic Claude API (`claude-sonnet-4-20250514`)
  - [ ] Cache the AI message in `ai_messages_cache` table
  - [ ] Return `{ message, isAiGenerated }` as JSON response
  - [ ] Error handling: if Claude API fails → return static fallback, don't crash
- [ ] Set environment secrets in Supabase dashboard: `ANTHROPIC_API_KEY`
- [ ] Deploy Edge Function: `supabase functions deploy generate-motivation`
- [ ] Test via curl / Postman → verify AI message returned

### 5.2 Frontend AI Service
- [ ] Create `app/services/ai.ts` (see Brain §7.1)
- [ ] Implement `AIService.getMotivationMessage(habitId?, taskId?, streakData?)`:
  - [ ] Call `supabase.functions.invoke('generate-motivation', { body })` 
  - [ ] On success → return AI message
  - [ ] On failure → return static fallback "Great job! 🌟"
  - [ ] Timeout after 5 seconds → return fallback
- [ ] Build `app/components/shared/MotivationModal.tsx`:
  - [ ] Shows AI-generated message in a beautiful card overlay
  - [ ] Animated entrance (slide up + fade in)
  - [ ] "Share" button (optional, uses `Share` API)
  - [ ] "Dismiss" button
  - [ ] Auto-dismiss after 5 seconds if user doesn't interact
  - [ ] Show ✨ sparkle icon if AI-generated, generic icon if fallback

### 5.3 Wire AI to Completion Flow
- [ ] When user completes a habit:
  1. Write completion locally (immediate)
  2. Play confetti animation (immediate)
  3. Request AI message in background
  4. When message arrives → show MotivationModal
- [ ] When user completes a one-time task:
  - Same flow but with `taskId` instead of `habitId`
- [ ] If user is offline → skip AI message, show only confetti
- [ ] Premium indicator: if free user and over daily limit, show "Upgrade to get unlimited personalized messages ✨" in modal

### 5.4 Message History
- [ ] Add "Past Messages" section to ProfileScreen
- [ ] Query `ai_messages_cache` for current user, ordered by `created_at DESC`
- [ ] Display in a flat list: message text, associated habit/task name, date
- [ ] Limit to last 50 messages with "Load more" button

---

## Phase 6 — Calendar Heatmap (Week 5–6)

### 6.1 Heatmap Component
- [ ] Build `app/components/calendar/HeatmapGrid.tsx` (see Brain §7.4):
  - [ ] Render a 52×7 grid of SVG `<Rect>` elements (365 days)
  - [ ] Color intensity based on number of completions per day (0→gray, 1-2→light green, 3-4→medium, 5+→dark green)
  - [ ] Support dark mode color scheme
  - [ ] Day-of-week labels on left (Mon, Wed, Fri)
  - [ ] Month labels on top (Jan, Feb, Mar…)
  - [ ] Horizontal scroll for the full year
- [ ] Make each day square tappable → opens `DayDetailModal`
- [ ] Add color legend at bottom: "Less ▪▪▪▪▪ More"

### 6.2 Day Detail Modal
- [ ] Build `app/components/calendar/DayDetailModal.tsx`:
  - [ ] Shows date header ("February 15, 2026")
  - [ ] Lists all completions for that day: habit name + completion time
  - [ ] Lists all tasks completed that day
  - [ ] If no completions → "Nothing completed this day"
  - [ ] AI motivation message from that day (if any)

### 6.3 Calendar Screen
- [ ] Build `app/screens/CalendarScreen.tsx`:
  - [ ] Month/year navigation arrows at top
  - [ ] Full `HeatmapGrid` component
  - [ ] Summary stats below heatmap:
    - [ ] Total completions this month
    - [ ] Current longest active streak (across all habits)
    - [ ] Busiest day (most completions)
    - [ ] Completion rate this month (completed / total due × 100%)
- [ ] Query `completions` table grouped by date for heatmap data
- [ ] Support smooth scrolling through months
- [ ] Test: complete several habits over multiple days → verify heatmap updates correctly

---

## Phase 7 — Notifications (Week 10)

### 7.1 Permission Handling
- [ ] Create `app/services/notifications.ts` (see Brain §7.3)
- [ ] Implement `NotificationService.requestPermissions()` → returns boolean
- [ ] Show permission request during onboarding (explain why notifications help)
- [ ] Gracefully handle permission denied: show banner in settings "Enable notifications to get reminders"
- [ ] Configure notification handler: `Notifications.setNotificationHandler()`

### 7.2 Habit Reminder Scheduling
- [ ] Implement `NotificationService.scheduleHabitReminders(habit)`:
  - [ ] Cancel existing notifications for this habit (by identifier prefix)
  - [ ] Use `RecurrenceEngine.getNextOccurrences()` to get next 30 due dates
  - [ ] For each occurrence: schedule local notification at the habit's `reminder_time`
  - [ ] Notification content: title = habit name, body = "Time to complete your habit! 💪"
  - [ ] Include `habitId` in notification data payload
- [ ] Implement `cancelHabitReminders(habitId)` — removes all scheduled for that habit
- [ ] Reschedule all notifications whenever:
  - [ ] App comes to foreground (refresh schedule)
  - [ ] User edits a habit's time or recurrence
  - [ ] User archives/deletes a habit

### 7.3 Notification Actions
- [ ] Handle notification tap: deep-link to HomeScreen with the relevant habit highlighted
- [ ] Handle notification when app is in foreground: show in-app toast instead of system notification
- [ ] "Mark as done" quick action from notification (iOS notification actions / Android actions)

### 7.4 Settings UI
- [ ] Add notification settings section to ProfileScreen:
  - [ ] Master toggle: enable/disable all notifications
  - [ ] Sound toggle: notification sound on/off
  - [ ] Per-habit: remind time is editable in HabitForm
- [ ] Persist settings in `users.notification_preferences` JSONB and locally in `settingsStore`

---

## Phase 8 — Monetization (Week 11–12)

### 8.1 AdMob Integration
- [ ] Create AdMob account at [admob.google.com](https://admob.google.com)
- [ ] Create iOS app + ad units: 1 banner, 1 interstitial
- [ ] Create Android app + ad units: 1 banner, 1 interstitial
- [ ] Install `react-native-google-mobile-ads`
- [ ] Configure `app.json` with AdMob app IDs
- [ ] Build `app/components/ads/BannerAd.tsx`:
  - [ ] Shows adaptive banner at HomeScreen bottom
  - [ ] Hidden for premium users (`isPremium` check)
  - [ ] Uses test ad IDs in development mode
- [ ] Build `app/components/ads/InterstitialAd.tsx`:
  - [ ] Preloads interstitial ad on app launch
  - [ ] Shows once per day after first task completion
  - [ ] Track last shown time to enforce 1×/day limit
  - [ ] Hidden for premium users
- [ ] Test with test ads: `TestIds.BANNER`, `TestIds.INTERSTITIAL`

### 8.2 RevenueCat Subscriptions
- [ ] Create RevenueCat account at [revenuecat.com](https://revenuecat.com)
- [ ] Create project, configure iOS and Android apps
- [ ] Set up "Premium" entitlement
- [ ] Create monthly product: $2.99/month
- [ ] Create yearly product (optional): $24.99/year (save 30%)
- [ ] Install `react-native-purchases`
- [ ] Create `app/services/subscriptions.ts` (see Brain §9.3):
  - [ ] `SubscriptionService.initialize()` — configure RevenueCat on app launch
  - [ ] `getOfferings()` — fetch available packages
  - [ ] `purchasePremium(pkg)` — handle purchase flow
  - [ ] `restorePurchases()` — restore for reinstalls / new devices
  - [ ] `checkPremiumStatus()` — returns boolean
- [ ] On app launch: check premium status → update `authStore.isPremium`
- [ ] On purchase success: update `authStore.isPremium`, update `users.is_premium` in DB

### 8.3 Paywall Screen
- [ ] Build `app/screens/PaywallScreen.tsx`:
  - [ ] Hero section: "Unlock Your Full Potential" header
  - [ ] Feature comparison table: Free vs Premium
    - [ ] AI messages: 5/day vs Unlimited
    - [ ] Ads: Yes vs No ads
    - [ ] Support: Standard vs Priority
  - [ ] Pricing cards: monthly ($2.99) and yearly ($24.99)
  - [ ] "Start Free Trial" button (if offering a trial)
  - [ ] "Restore Purchases" link
  - [ ] Terms of use / Privacy policy links (required by Apple/Google)
  - [ ] Close button (X) at top right
- [ ] Show Paywall from:
  - [ ] ProfileScreen "Upgrade" button
  - [ ] AI rate limit reached → "Upgrade to get more"
  - [ ] Optional: after 7 days of usage (soft prompt)

### 8.4 Premium Feature Gating
- [ ] Throughout the app, check `authStore.isPremium` to:
  - [ ] Show/hide banner ads
  - [ ] Show/hide interstitial ads
  - [ ] Allow unlimited AI messages vs enforce daily limit
  - [ ] Show premium badge on ProfileScreen
- [ ] Test purchase flow end-to-end (use sandbox/test accounts)

---

## Phase 9 — Analytics & Error Tracking (Week 12)

### 9.1 Analytics Setup
- [ ] Choose analytics provider: PostHog or Mixpanel
- [ ] Create account, get API key
- [ ] Install SDK (`posthog-react-native` or `@mixpanel/mixpanel-react-native`)
- [ ] Create `app/services/analytics.ts`:
  - [ ] `AnalyticsService.identify(userId)` — associate events with user
  - [ ] `AnalyticsService.track(event, properties)` — fire event
  - [ ] `AnalyticsService.reset()` — on sign-out
- [ ] Instrument all events from Brain §12:
  - [ ] `ONBOARDING_STARTED`, `ONBOARDING_COMPLETED`
  - [ ] `HABIT_CREATED`, `TASK_CREATED`
  - [ ] `HABIT_COMPLETED`, `TASK_COMPLETED`
  - [ ] `STREAK_MILESTONE` (7, 30, 100)
  - [ ] `CALENDAR_VIEWED`
  - [ ] `AI_MESSAGE_VIEWED`
  - [ ] `PAYWALL_VIEWED`, `PREMIUM_PURCHASED`
  - [ ] `AD_CLICKED`
  - [ ] `NOTIFICATION_RECEIVED`, `NOTIFICATION_OPENED`
  - [ ] `DAILY_ACTIVE` (on each app open)

### 9.2 Error Tracking
- [ ] Create Sentry account, get DSN
- [ ] Install `@sentry/react-native`
- [ ] Initialize Sentry in app entry point with DSN
- [ ] Create `app/components/shared/ErrorBoundary.tsx` — wraps each screen, catches JS errors, logs to Sentry, shows user-friendly error UI
- [ ] Add Sentry breadcrumbs for key user actions (habit complete, sync, auth)
- [ ] Test: throw a test error → verify it appears in Sentry dashboard

---

## Phase 10 — Onboarding & Polish (Week 13–15)

### 10.1 Onboarding Flow
- [ ] Build 3-screen onboarding swiper (shown only on first launch):
  - [ ] Screen 1: "Track Your Habits" — visual of habit list + streaks
  - [ ] Screen 2: "Get Personalized Motivation" — visual of AI message
  - [ ] Screen 3: "See Your Progress" — visual of calendar heatmap
- [ ] Each screen has illustration, title, subtitle
- [ ] Dot indicators showing progress
- [ ] "Skip" button, "Next" button, "Get Started" on last screen
- [ ] After onboarding → navigate to AuthScreen (sign up) or HomeScreen (if skip)
- [ ] Persist `hasCompletedOnboarding` in AsyncStorage

### 10.2 Empty States & Edge Cases
- [ ] HomeScreen empty state: "No habits yet!" + "Create your first habit" button
- [ ] Tasks empty state: "All caught up! 🎉" + "Add a task" button
- [ ] Calendar empty state: faded heatmap with message "Start completing habits to see your progress here"
- [ ] No internet: show subtle offline banner, disable sync button, keep local CRUD working
- [ ] Auth error: show toast with retry option
- [ ] AI timeout: skip modal gracefully, don't block completion flow

### 10.3 UI Polish
- [ ] Refine all screen layouts for consistency (spacing, fonts, colors)
- [ ] Add pull-to-refresh on HomeScreen and CalendarScreen
- [ ] Add smooth entry/exit animations for modals and screens
- [ ] Improve HabitCard: subtle shadow, press feedback, animated checkbox
- [ ] Improve StreakBadge: pulse animation when streak increases
- [ ] Dark mode support: respect system preference, allow override in settings
- [ ] Keyboard handling: dismiss keyboard on tap outside, scroll input into view
- [ ] Safe area handling: respect notch, home indicator, status bar on all screens

### 10.4 Performance Optimization
- [ ] Profile with React DevTools → identify unnecessary re-renders
- [ ] Add `React.memo` to `HabitCard`, `TaskCard`, heatmap `Rect` components
- [ ] Lazy load CalendarScreen heatmap data (only fetch when tab is active)
- [ ] Debounce sync triggers (5-second window)
- [ ] Limit `completions` query to last 365 days by default
- [ ] Test on low-end device: verify smooth scrolling with 50+ habits

### 10.5 Accessibility
- [ ] Every tappable element has `accessibilityLabel` and `accessibilityRole`
- [ ] StreakBadge announces: "7-day streak on Drink Water"
- [ ] Checkbox announces: "Completed" / "Not yet completed" state
- [ ] Calendar heatmap days announce: "February 15, 3 completions"
- [ ] Test with screen reader (VoiceOver on iOS, TalkBack on Android)

---

## Phase 11 — Testing (Week 14–15)

### 11.1 Unit Tests (Jest)
- [ ] Set up Jest with TypeScript and React Native preset
- [ ] Write tests for `RecurrenceEngine` (all recurrence types + edge cases)
- [ ] Write tests for `StreakCalculator` (all streak scenarios + edge cases)
- [ ] Write tests for `dateHelpers` (all date utility functions)
- [ ] Write tests for Zustand stores (mock WatermelonDB, test actions)
- [ ] Write tests for `AIService` (mock Supabase functions, test fallback)
- [ ] Write tests for `NotificationService` (mock expo-notifications)
- [ ] Achieve ≥ 80% coverage on utility and service files

### 11.2 Integration Tests
- [ ] Test auth flow: sign up → creates user record → sign in → session persists → sign out
- [ ] Test sync: local create → push → verify in Supabase → remote update → pull → verify locally
- [ ] Test habit completion flow: complete → streak updates → AI message requested
- [ ] Test notification scheduling: create habit with time → verify notifications scheduled

### 11.3 E2E Tests (Detox or Maestro)
- [ ] Choose E2E framework: Detox (Wix) or Maestro (simpler setup)
- [ ] Test: Launch app → onboarding → sign up → create habit → complete habit → verify streak
- [ ] Test: Open calendar → tap day → see completion detail
- [ ] Test: Upgrade to premium → verify ads disappear
- [ ] Test: Sign out → sign in on "new device" → verify data synced

### 11.4 Manual Testing Checklist
- [ ] Test on physical iPhone (latest iOS)
- [ ] Test on physical Android phone (latest Android)
- [ ] Test on older iPhone (2–3 generations back)
- [ ] Test on older Android (Android 11 or 12)
- [ ] Test landscape orientation (should work or gracefully lock to portrait)
- [ ] Test with system dark mode enabled
- [ ] Test with large system font size (accessibility)
- [ ] Test airplane mode → create/complete habits → reconnect → sync

---

## Phase 12 — Deployment & Launch (Week 16)

### 12.1 Pre-Submission Preparation
- [ ] Create app icon (1024×1024) — clean, recognizable, matches brand
- [ ] Create splash screen — app logo on brand background
- [ ] Take 6+ screenshots for each platform (different screen sizes):
  - [ ] HomeScreen with habits
  - [ ] Habit with streak badge
  - [ ] AI motivational message modal
  - [ ] Calendar heatmap filled in
  - [ ] Premium paywall
  - [ ] Onboarding screen
- [ ] Write app store description (short + full):
  - [ ] Highlight: AI motivation, habit streaks, beautiful calendar, cross-device sync
  - [ ] Keywords: habit tracker, to-do list, streak, AI motivation, productivity
- [ ] Write privacy policy (data collected, how used, third parties)
- [ ] Write terms of service
- [ ] Host privacy policy and ToS on a simple web page (GitHub Pages works)

### 12.2 Build & Submit
- [ ] Set up EAS Build: `eas build:configure`
- [ ] Configure `eas.json` with development, preview, and production profiles
- [ ] Build iOS production binary: `eas build --platform ios --profile production`
- [ ] Build Android production bundle (AAB): `eas build --platform android --profile production`
- [ ] Create Apple Developer account ($99/year) if not already done
- [ ] Create Google Play Developer account ($25 one-time) if not already done
- [ ] Submit to Apple App Store Connect:
  - [ ] Upload binary via Transporter or EAS Submit
  - [ ] Fill in app metadata, screenshots, review notes
  - [ ] Set pricing (free with in-app purchases)
  - [ ] Submit for review (allow 7–14 days)
- [ ] Submit to Google Play Console:
  - [ ] Upload AAB
  - [ ] Fill in store listing, screenshots, content rating
  - [ ] Set pricing and distribution
  - [ ] Submit for review (allow 1–3 days)

### 12.3 Post-Launch
- [ ] Monitor Sentry for crashes in first 48 hours
- [ ] Monitor analytics for user flow drop-offs
- [ ] Respond to first user reviews within 24 hours
- [ ] Prepare hotfix release pipeline in case of critical bugs
- [ ] Plan first feature update based on user feedback (2 weeks post-launch)
- [ ] Set up weekly metrics review: DAU, retention (D1, D7, D30), revenue, crash-free rate

---

## 🎉 Done!

When all boxes are checked, **To Do Better** is live on both app stores.

---

> **Maintenance reminders:**
> - Keep dependencies updated monthly (`npx expo install --check`)
> - Review Sentry errors weekly
> - Respond to user reviews within 48 hours
> - Plan feature releases every 2–4 weeks
> - Update `TO_DO_BETTER_BRAIN.md` when architecture changes
