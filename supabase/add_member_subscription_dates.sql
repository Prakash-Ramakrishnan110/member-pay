-- Add subscription tracking columns to the members table
ALTER TABLE public.members ADD COLUMN IF NOT EXISTS plan_start_date TIMESTAMPTZ;
ALTER TABLE public.members ADD COLUMN IF NOT EXISTS plan_end_date TIMESTAMPTZ;
ALTER TABLE public.members ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'active';
