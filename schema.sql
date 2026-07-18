-- Supabase Schema for MemberPay (V2)

-- Drop existing tables to recreate them safely
DROP TABLE IF EXISTS public.reminders_log CASCADE;
DROP TABLE IF EXISTS public.payments CASCADE;
DROP TABLE IF EXISTS public.members CASCADE;
DROP TABLE IF EXISTS public.businesses CASCADE;

-- 1. Businesses Table
-- Link directly to auth.users
CREATE TABLE public.businesses (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT, -- Can be null initially until they complete onboarding
  owner_email TEXT UNIQUE NOT NULL,
  business_type TEXT,
  city TEXT,
  logo_url TEXT,
  razorpay_account_id TEXT,
  upi_id TEXT,
  payment_setup TEXT DEFAULT 'pending',
  member_count TEXT,
  subscription_status TEXT DEFAULT 'trial',
  whatsapp_session_status TEXT DEFAULT 'disconnected',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Note: To update your existing database without deleting data, run these commands in the Supabase SQL Editor:
-- ALTER TABLE public.businesses ADD COLUMN member_count TEXT;
-- ALTER TABLE public.businesses ADD COLUMN subscription_status TEXT DEFAULT 'trial';
-- ALTER TABLE public.businesses ADD COLUMN upi_id TEXT;

-- 2. Members Table
CREATE TABLE public.members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  plan_name TEXT NOT NULL,
  fee_amount DECIMAL(10, 2) NOT NULL,
  billing_cycle TEXT NOT NULL, -- e.g., 'Monthly', 'Quarterly', 'Yearly'
  start_date DATE NOT NULL,
  next_due_date DATE NOT NULL,
  status TEXT DEFAULT 'Active', -- 'Active', 'Expiring', 'Overdue', 'Inactive'
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Ensure a member's phone is unique per business
ALTER TABLE public.members ADD CONSTRAINT unique_phone_per_business UNIQUE (business_id, phone);

-- 3. Payments Table
CREATE TABLE public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE NOT NULL,
  member_id UUID REFERENCES public.members(id) ON DELETE CASCADE NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  razorpay_payment_id TEXT,
  status TEXT DEFAULT 'Pending', -- 'Paid', 'Pending', 'Failed'
  payment_link_url TEXT,
  method TEXT DEFAULT 'link', -- 'link', 'manual', 'autopay'
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Reminders Log Table
CREATE TABLE public.reminders_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE NOT NULL,
  member_id UUID REFERENCES public.members(id) ON DELETE CASCADE NOT NULL,
  channel TEXT NOT NULL, -- 'whatsapp', 'sms'
  type TEXT NOT NULL, -- 'T-3', 'Due', 'Overdue'
  status TEXT DEFAULT 'Sent', -- 'Sent', 'Failed'
  sent_at TIMESTAMPTZ DEFAULT now()
);

-- Row Level Security (RLS) setup
ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reminders_log ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Businesses: An authenticated user can only view and update their own business row.
CREATE POLICY "Users can view own business" 
ON public.businesses FOR SELECT 
TO authenticated 
USING (auth.uid() = id);

CREATE POLICY "Users can update own business" 
ON public.businesses FOR UPDATE 
TO authenticated 
USING (auth.uid() = id);

-- Members: Users can only see, insert, update, delete members linked to their business
CREATE POLICY "Users can manage own members" 
ON public.members FOR ALL 
TO authenticated 
USING (business_id = auth.uid());

-- Payments: Users can only see, insert, update, delete payments linked to their business
CREATE POLICY "Users can manage own payments" 
ON public.payments FOR ALL 
TO authenticated 
USING (business_id = auth.uid());

-- Reminders: Users can only see, insert, update, delete reminders linked to their business
CREATE POLICY "Users can manage own reminders" 
ON public.reminders_log FOR ALL 
TO authenticated 
USING (business_id = auth.uid());

-- Auto-create a business record when a user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.businesses (id, owner_email, name)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to run handle_new_user()
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
