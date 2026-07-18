-- Add messaging and payment settings directly to the businesses table
ALTER TABLE public.businesses ADD COLUMN enable_online_payments BOOLEAN DEFAULT true;
ALTER TABLE public.businesses ADD COLUMN enable_whatsapp_click_to_chat BOOLEAN DEFAULT true;
ALTER TABLE public.businesses ADD COLUMN whatsapp_template TEXT DEFAULT 'Hi {{name}},

This is a gentle reminder from {{business_name}} that your gym membership fee is due.

*Member Details:*
👤 Name: {{name}}
🏋️ Plan: {{plan_name}}
📅 Due Date: {{due_date}}
💰 Amount Due: ₹{{amount}}

Please click the secure link below to view your invoice and complete your payment via Google Pay, PhonePe, or Paytm:
👉 {{payment_link}}

Thank you!';

-- Drop the old business_settings table since we no longer need it
DROP TABLE IF EXISTS public.business_settings CASCADE;
