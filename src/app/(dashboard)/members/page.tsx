import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { MembersClient } from '@/components/dashboard/members-client';
import { getPlans } from '@/app/actions/plan-actions';

export default async function MembersPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Fetch all members for the business
  const { data: members } = await supabase
    .from('members')
    .select('*')
    .eq('business_id', user.id)
    .order('created_at', { ascending: false });

  const { data: plans } = await supabase
    .from('plans')
    .select('*')
    .eq('business_id', user.id);

  const { data: settings } = await supabase
    .from('businesses')
    .select('*')
    .eq('id', user.id)
    .single();

  return (
    <MembersClient 
      initialMembers={members || []} 
      plans={plans || []} 
      settings={settings || {}}
    />
  );
}
