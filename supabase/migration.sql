-- =============================================================
-- To Do Better App — Supabase Migration
-- Run this in Supabase SQL Editor (Dashboard > SQL Editor > New Query)
-- =============================================================

-- ── 1. TABLES ──

-- Habits table
CREATE TABLE IF NOT EXISTS public.habits (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id       UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name          TEXT NOT NULL,
  emoji         TEXT NOT NULL DEFAULT '💪',
  recurrence_type TEXT NOT NULL DEFAULT 'daily' CHECK (recurrence_type IN ('daily', 'weekly')),
  recurrence_days INTEGER[] DEFAULT '{0,1,2,3,4,5,6}',
  reminder_time TEXT,        -- "HH:mm" format or null
  priority      TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  is_active     BOOLEAN NOT NULL DEFAULT true,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- One-time tasks
CREATE TABLE IF NOT EXISTS public.one_time_tasks (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id       UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name          TEXT NOT NULL,
  due_date      TEXT,        -- ISO date string or null
  priority      TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  is_completed  BOOLEAN NOT NULL DEFAULT false,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Habit completions
CREATE TABLE IF NOT EXISTS public.completions (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id       UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  habit_id      UUID NOT NULL REFERENCES public.habits(id) ON DELETE CASCADE,
  completed_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Streak cache
CREATE TABLE IF NOT EXISTS public.streaks (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id       UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  habit_id      UUID NOT NULL REFERENCES public.habits(id) ON DELETE CASCADE,
  current_count INTEGER NOT NULL DEFAULT 0,
  longest_count INTEGER NOT NULL DEFAULT 0,
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, habit_id)
);


-- ── 2. INDEXES ──

CREATE INDEX IF NOT EXISTS idx_habits_user       ON public.habits(user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_user        ON public.one_time_tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_completions_habit ON public.completions(habit_id);
CREATE INDEX IF NOT EXISTS idx_completions_user  ON public.completions(user_id);
CREATE INDEX IF NOT EXISTS idx_streaks_habit     ON public.streaks(habit_id);


-- ── 3. ROW LEVEL SECURITY ──

ALTER TABLE public.habits          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.one_time_tasks  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.completions     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.streaks         ENABLE ROW LEVEL SECURITY;

-- Habits: users can only CRUD their own
CREATE POLICY "Users manage own habits"
  ON public.habits FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Tasks: users can only CRUD their own
CREATE POLICY "Users manage own tasks"
  ON public.one_time_tasks FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Completions: users can only CRUD their own
CREATE POLICY "Users manage own completions"
  ON public.completions FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Streaks: users can only CRUD their own
CREATE POLICY "Users manage own streaks"
  ON public.streaks FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);


-- ── 4. UPDATED_AT TRIGGER ──

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER habits_updated_at
  BEFORE UPDATE ON public.habits
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER tasks_updated_at
  BEFORE UPDATE ON public.one_time_tasks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
