-- 1. Create the platform_settings table to store global SaaS configuration (Feature Flags, Maintenance Mode)
CREATE TABLE public.platform_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    feature_upi_autopay BOOLEAN DEFAULT false,
    feature_multi_branch BOOLEAN DEFAULT false,
    feature_whatsapp_marketing BOOLEAN DEFAULT false,
    maintenance_mode BOOLEAN DEFAULT false,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert the single default row
INSERT INTO public.platform_settings (feature_upi_autopay, feature_multi_branch, feature_whatsapp_marketing, maintenance_mode)
VALUES (false, false, false, false);

-- Enable RLS
ALTER TABLE public.platform_settings ENABLE ROW LEVEL SECURITY;

-- Allow all access to the admin panel
CREATE POLICY "Enable all access for platform_settings" 
ON public.platform_settings 
FOR ALL 
USING (true) 
WITH CHECK (true);


-- 2. Create the api_errors table to track backend API failures
CREATE TABLE public.api_errors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    endpoint TEXT NOT NULL,
    error_message TEXT NOT NULL,
    status_code INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.api_errors ENABLE ROW LEVEL SECURITY;

-- Allow all access
CREATE POLICY "Enable all access for api_errors" 
ON public.api_errors 
FOR ALL 
USING (true) 
WITH CHECK (true);
