-- Add subscription tracking columns to the businesses table
ALTER TABLE public.businesses ADD COLUMN subscription_starts_at TIMESTAMPTZ;
ALTER TABLE public.businesses ADD COLUMN subscription_ends_at TIMESTAMPTZ;
