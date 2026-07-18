'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function getSettings() {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { error: 'Not authenticated' };
  }

  const { data, error } = await supabase
    .from('businesses')
    .select('name, city, upi_id, razorpay_account_id, enable_online_payments, enable_whatsapp_click_to_chat, whatsapp_template, whatsapp_session_status')
    .eq('id', user.id)
    .single();

  if (error && error.code !== 'PGRST116') {
    return { error: error.message };
  }

  // Map 'name' back to 'business_name' for the frontend compatibility if needed
  if (data) {
    return { data: { ...data, business_name: data.name } };
  }

  return { data };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function updateSettings(settings: any) {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { error: 'Not authenticated' };
  }

  // Extract variables
  const { business_name, ...otherSettings } = settings;
  const updatePayload: any = { ...otherSettings };
  
  // Only update name if it's provided
  if (business_name) {
    updatePayload.name = business_name;
  }

  const { error } = await supabase
    .from('businesses')
    .update(updatePayload)
    .eq('id', user.id);

  if (error) {
    console.error("Error updating settings:", error);
    return { error: error.message };
  }

  revalidatePath('/settings');
  revalidatePath('/dashboard');
  revalidatePath('/members');
  return { success: true };
}
