import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { BillingClient } from '@/components/dashboard/billing-client';

export default async function BillingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Get business details
  const { data: business } = await supabase
    .from('businesses')
    .select('*')
    .eq('id', user.id)
    .single();

  return <BillingClient business={business} userPhone={user.phone || ''} />;
}
