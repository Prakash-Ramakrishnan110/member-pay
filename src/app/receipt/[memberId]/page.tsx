import { createAdminClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';
import { ReceiptClient } from '@/components/dashboard/receipt-client';

export default async function ReceiptPage({ params }: { params: Promise<{ memberId: string }> | { memberId: string } }) {
  const resolvedParams = await params;
  const supabase = createAdminClient();

  // Fetch the member
  const { data: member, error: memberError } = await supabase
    .from('members')
    .select('*')
    .eq('id', resolvedParams.memberId)
    .single();

  if (memberError || !member) {
    console.error('Member error:', memberError);
    return notFound();
  }

  // Fetch the business settings for this member's gym
  const { data: settings } = await supabase
    .from('businesses')
    .select('*')
    .eq('id', member.business_id)
    .single();

  return <ReceiptClient member={member} settings={settings || {}} />;
}
