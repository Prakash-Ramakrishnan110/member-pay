'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function updatePlatformConfig(configId: string, settings: any) {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { error: 'Not authenticated' };
  }

  const { error } = await supabase
    .from('platform_settings')
    .update({ 
      ...settings,
      updated_at: new Date().toISOString()
    })
    .eq('id', configId);

  if (error) {
    console.error("Error updating platform config:", error);
    return { error: error.message };
  }

  revalidatePath('/admin/settings');
  return { success: true };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function updateSaaSPlan(planId: string, planData: any) {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { error: 'Not authenticated' };
  }

  const { error } = await supabase
    .from('saas_plans')
    .update({ 
      ...planData,
      updated_at: new Date().toISOString()
    })
    .eq('id', planId);

  if (error) {
    console.error("Error updating saas plan:", error);
    return { error: error.message };
  }

  revalidatePath('/admin/settings');
  return { success: true };
}
