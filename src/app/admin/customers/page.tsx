import { createClient } from '@/utils/supabase/server';
import { CustomersClient } from '@/components/admin/customers-client';

export const dynamic = 'force-dynamic';

export default async function CustomersPage() {
  const supabase = await createClient();

  // Fetch all businesses
  const { data: businesses } = await supabase
    .from('businesses')
    .select('*')
    .order('created_at', { ascending: false });

  // Fetch all members across platform to calculate global MRR
  const { data: members } = await supabase
    .from('members')
    .select('id, business_id, status, fee_amount, billing_cycle');

  return <CustomersClient businesses={businesses || []} allMembers={members || []} />;
}
