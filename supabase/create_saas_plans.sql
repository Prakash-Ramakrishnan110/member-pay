-- Create the saas_plans table to store global pricing and limits
CREATE TABLE public.saas_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    price INTEGER NOT NULL,
    member_limit INTEGER NOT NULL,
    whatsapp_limit INTEGER NOT NULL,
    is_popular BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default plans
INSERT INTO public.saas_plans (name, price, member_limit, whatsapp_limit, is_popular)
VALUES 
('Pro Plan', 499, 999999, 999999, false),
('Pro Plan (Annual)', 4999, 999999, 999999, true);

-- Enable RLS
ALTER TABLE public.saas_plans ENABLE ROW LEVEL SECURITY;

-- Allow all access to the admin panel
CREATE POLICY "Enable all access for saas_plans" 
ON public.saas_plans 
FOR ALL 
USING (true) 
WITH CHECK (true);
