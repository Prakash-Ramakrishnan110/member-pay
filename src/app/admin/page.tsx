import { createClient, createAdminClient } from '@/utils/supabase/server';
import { AdminClient } from '@/components/admin/admin-client';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const supabase = await createClient(); // Still need this to check if user is admin if we wanted to
  const adminSupabase = createAdminClient();

  // Fetch all businesses (bypassing RLS with admin client)
  const { data: businesses } = await adminSupabase
    .from('businesses')
    .select('*')
    .order('created_at', { ascending: false });

  // Fetch all members across platform to calculate global MRR and logs
  const { data: members } = await adminSupabase
    .from('members')
    .select('id, name, created_at, business_id, status, fee_amount, billing_cycle, businesses(name)');

  // Synthesize logs
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let rawLogs: any[] = [];
  
  if (members) {
    rawLogs = [...rawLogs, ...members.map(m => ({
      id: `member-${m.id}`,
      type: 'member_added',
      title: 'New Member Added',
      description: `Member "${m.name}" joined ${(Array.isArray(m.businesses) ? m.businesses[0]?.name : (m.businesses as any)?.name) || 'a business'}.`,
      timestamp: m.created_at,
      businessId: m.business_id,
    }))];
  }

  if (businesses) {
    rawLogs = [...rawLogs, ...businesses.map(b => ({
      id: `biz-${b.id}`,
      type: 'business_signup',
      title: 'New Business Registered',
      description: `Business "${b.name}" created their account.`,
      timestamp: b.created_at,
      businessId: b.id,
    }))];
  }

  const sortedLogs = rawLogs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 5);

  return <AdminClient businesses={businesses || []} allMembers={members || []} recentLogs={sortedLogs} />;
}
