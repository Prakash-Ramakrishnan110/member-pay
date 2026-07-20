-- MemberPay Premium Features Migration

-- 1. Add Grace Period and new WhatsApp Templates to businesses table
ALTER TABLE public.businesses 
  ADD COLUMN IF NOT EXISTS grace_period_days INT DEFAULT 3,
  ADD COLUMN IF NOT EXISTS welcome_template TEXT DEFAULT 'Welcome {{name}} to {{business_name}}! Your {{plan_name}} plan is active until {{due_date}}.',
  ADD COLUMN IF NOT EXISTS suspension_template TEXT DEFAULT 'Hi {{name}}, your membership at {{business_name}} has been suspended due to non-payment. Please pay Rs. {{amount}} to reactivate.',
  ADD COLUMN IF NOT EXISTS birthday_template TEXT DEFAULT 'Happy Birthday {{name}}! Wishing you a fantastic day from all of us at {{business_name}}! 🎉';

-- 2. Add Date of Birth (dob) to members table
ALTER TABLE public.members 
  ADD COLUMN IF NOT EXISTS dob DATE;

-- 3. Create member_otps table for Self-Service Portal login
DROP TABLE IF EXISTS public.member_otps;
CREATE TABLE public.member_otps (
  member_id UUID PRIMARY KEY REFERENCES public.members(id) ON DELETE CASCADE,
  otp_code TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Note: RLS for member_otps is not strictly necessary if only accessed via secure API routes,
-- but we can add it just in case:
ALTER TABLE public.member_otps ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role can manage member_otps" 
ON public.member_otps FOR ALL 
USING (true) WITH CHECK (true);
