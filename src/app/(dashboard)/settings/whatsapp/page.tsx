import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { WhatsAppClient } from '@/components/dashboard/whatsapp-client';
import { getSettings } from '@/app/actions/settings-actions';

export default async function WhatsAppSettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: settings } = await getSettings();

  return (
    <WhatsAppClient 
      businessId={user.id} 
      initialStatus={settings?.whatsapp_session_status || 'disconnected'} 
      settings={settings || {}}
    />
  );
}
