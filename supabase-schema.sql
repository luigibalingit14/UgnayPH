-- VibeCheck PH Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    username TEXT UNIQUE,
    email TEXT,
    avatar_url TEXT,
    streak_count INTEGER DEFAULT 0,
    last_check_date DATE,
    total_checks INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Reports table (stores vibe check history)
CREATE TABLE IF NOT EXISTS public.reports (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    content_hash TEXT,
    score INTEGER NOT NULL CHECK (score >= 0 AND score <= 100),
    label_en TEXT NOT NULL,
    label_tagalog TEXT NOT NULL,
    explanation TEXT,
    red_flags TEXT[],
    tips TEXT[],
    is_url BOOLEAN DEFAULT FALSE,
    source_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_reports_user_id ON public.reports(user_id);
CREATE INDEX IF NOT EXISTS idx_reports_created_at ON public.reports(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reports_content_hash ON public.reports(content_hash);
CREATE INDEX IF NOT EXISTS idx_profiles_username ON public.profiles(username);

-- Row Level Security (RLS) Policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can only read/update their own profile
CREATE POLICY "Users can view own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
    ON public.profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

-- Reports: Users can only access their own reports
CREATE POLICY "Users can view own reports"
    ON public.reports FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own reports"
    ON public.reports FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own reports"
    ON public.reports FOR DELETE
    USING (auth.uid() = user_id);

-- Function to create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, username)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'username', SPLIT_PART(NEW.email, '@', 1))
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update streak
CREATE OR REPLACE FUNCTION public.update_user_streak(p_user_id UUID)
RETURNS void AS $$
DECLARE
    v_last_check DATE;
    v_today DATE := CURRENT_DATE;
BEGIN
    SELECT last_check_date INTO v_last_check
    FROM public.profiles
    WHERE id = p_user_id;

    IF v_last_check IS NULL OR v_last_check < v_today - INTERVAL '1 day' THEN
        -- Reset streak if more than 1 day gap
        UPDATE public.profiles
        SET streak_count = 1,
            last_check_date = v_today,
            total_checks = total_checks + 1,
            updated_at = NOW()
        WHERE id = p_user_id;
    ELSIF v_last_check = v_today - INTERVAL '1 day' THEN
        -- Increment streak if consecutive day
        UPDATE public.profiles
        SET streak_count = streak_count + 1,
            last_check_date = v_today,
            total_checks = total_checks + 1,
            updated_at = NOW()
        WHERE id = p_user_id;
    ELSIF v_last_check = v_today THEN
        -- Same day, just increment total checks
        UPDATE public.profiles
        SET total_checks = total_checks + 1,
            updated_at = NOW()
        WHERE id = p_user_id;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON public.profiles TO anon, authenticated;
GRANT ALL ON public.reports TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.update_user_streak(UUID) TO authenticated;

-- Helpful comment
COMMENT ON TABLE public.profiles IS 'User profiles for VibeCheck PH with streak tracking';
COMMENT ON TABLE public.reports IS 'Vibe check report history for users';
