import { createClient, createAdminClient } from '@/utils/supabase/server';
import { RevenueClient } from '@/components/admin/revenue-client';

export const dynamic = 'force-dynamic';

export default async function RevenuePage() {
  const supabase = createAdminClient();

  // Fetch all members across platform to calculate global MRR and ARR
  const { data: members } = await supabase
    .from('members')
    .select('id, business_id, status, fee_amount, billing_cycle');

  return <RevenueClient allMembers={members || []} />;
}
