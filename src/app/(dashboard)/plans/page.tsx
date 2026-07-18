import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { PlansClient } from '@/components/dashboard/plans-client';
import { getPlans } from '@/app/actions/plan-actions';

export default async function PlansPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Fetch plans from DB
  const plans = await getPlans();

  // Fetch all members to match with plans and count subscribers
  const { data: members } = await supabase
    .from('members')
    .select('id, name, phone, next_due_date, plan_name')
    .eq('business_id', user.id);

  // Group members by plan_name
  const plansWithMembers = plans.map(plan => {
    const planMembers = (members || []).filter(m => m.plan_name === plan.name);
    return {
      ...plan,
      membersCount: planMembers.length,
      members: planMembers
    };
  });

  return <PlansClient initialPlans={plansWithMembers} />;
}
