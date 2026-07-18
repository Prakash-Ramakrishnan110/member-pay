-- Add whatsapp_session_status to the businesses table
ALTER TABLE public.businesses ADD COLUMN whatsapp_session_status TEXT DEFAULT 'disconnected';
