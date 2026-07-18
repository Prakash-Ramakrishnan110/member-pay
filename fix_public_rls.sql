-- Fix for Public Payment Links (RLS Policies)
-- Since the payment link is meant to be opened by members (who are not logged in), 
-- we need to allow anonymous (public) read access to specific rows in the database.

-- 1. Allow public read access to members
CREATE POLICY "Public can view member by ID" 
ON public.members FOR SELECT 
TO anon 
USING (true);

-- 2. Allow public read access to businesses (so they can get the UPI ID for the QR code)
CREATE POLICY "Public can view business settings" 
ON public.businesses FOR SELECT 
TO anon 
USING (true);
