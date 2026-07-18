import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { SettingsClient } from '@/components/dashboard/settings-client';
import { getSettings } from '@/app/actions/settings-actions';

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: initialSettings } = await getSettings();

  return (
    <SettingsClient 
      initialSettings={initialSettings || {}} 
      userPhone={user.phone || user.email || ''} 
    />
  );
}
