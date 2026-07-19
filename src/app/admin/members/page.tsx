import { createClient, createAdminClient } from '@/utils/supabase/server';
import { GlobalMembersClient } from '@/components/admin/global-members-client';

export const dynamic = 'force-dynamic';

export default async function GlobalMembersPage() {
  const supabase = createAdminClient();

  // Fetch all members
  const { data: members } = await supabase
    .from('members')
    .select('*, businesses(name)')
    .order('created_at', { ascending: false });

  return <GlobalMembersClient allMembers={members || []} />;
}
