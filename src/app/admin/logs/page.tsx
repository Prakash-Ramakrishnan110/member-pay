import { createClient, createAdminClient } from '@/utils/supabase/server';
import { LogsClient } from '@/components/admin/logs-client';

export const dynamic = 'force-dynamic';

export default async function LogsPage() {
  const supabase = createAdminClient();

  // Fetch all members
  const { data: members } = await supabase
    .from('members')
    .select('id, name, created_at, business_id, businesses(name)')
    .order('created_at', { ascending: false })
    .limit(50);

  // Fetch all businesses
  const { data: businesses, error: dbError } = await supabase
    .from('businesses')
    .select('id, name, created_at')
    .order('created_at', { ascending: false })
    .limit(20);

  // DB Health Status
  const dbOperational = !dbError;

  // Fetch API errors
  const { data: apiErrors } = await supabase
    .from('api_errors')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(10);

  // Merge and sort them into a synthetic "log feed"
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

  // Sort by newest first
  const sortedLogs = rawLogs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return <LogsClient logs={sortedLogs} dbOperational={dbOperational} apiErrors={apiErrors || []} />;
}
