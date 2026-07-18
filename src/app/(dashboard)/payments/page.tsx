import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { PaymentsClient } from '@/components/dashboard/payments-client';

export default async function PaymentsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Fetch all members to calculate Accounts Receivable
  const { data: members } = await supabase
    .from('members')
    .select('*, payments(*)')
    .eq('business_id', user.id)
    .order('created_at', { ascending: false });

  // Fetch business settings for WhatsApp template and Smart Links
  const { data: settings } = await supabase
    .from('businesses')
    .select('whatsapp_template, upi_id, name, whatsapp_session_status')
    .eq('id', user.id)
    .single();

  return (
    <PaymentsClient 
      members={members || []} 
      whatsappTemplate={settings?.whatsapp_template}
      upiId={settings?.upi_id}
      businessName={settings?.name}
      whatsappSessionStatus={settings?.whatsapp_session_status}
    />
  );
}
