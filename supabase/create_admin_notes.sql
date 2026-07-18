-- Create the admin_notes table to store CRM notes for businesses
CREATE TABLE public.admin_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
    note_text TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Turn on Row Level Security (RLS)
ALTER TABLE public.admin_notes ENABLE ROW LEVEL SECURITY;

-- Allow anyone to select/insert for now (since the Admin panel is protected by Next.js routing)
-- In a production environment, you would restrict this to only the Super Admin email.
CREATE POLICY "Enable all access for now" 
ON public.admin_notes 
FOR ALL 
USING (true) 
WITH CHECK (true);
