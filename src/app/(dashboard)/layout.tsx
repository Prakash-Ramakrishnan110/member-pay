import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export default async function DashboardGroupRouteLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Fetch business profile to check onboarding status and trial status
  const { data: business } = await supabase
    .from('businesses')
    .select('business_type, created_at, subscription_status, name, logo_url, plan_id, subscription_starts_at, subscription_ends_at')
    .eq('id', user.id)
    .single();

  // If the user has not completed onboarding, force them to the onboarding page
  // if (!business?.business_type) {
  //   redirect('/onboarding');
  // }

  // Check 7-day trial limit
  if (business?.subscription_status === 'trial' && business?.created_at) {
    const trialStartDate = new Date(business.created_at);
    const currentDate = new Date();
    // Calculate difference in days
    const diffTime = Math.abs(currentDate.getTime() - trialStartDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    
    if (diffDays > 7) {
      // Trial expired! Redirect to billing
      redirect('/billing');
    }
  }

  const isSuperAdmin = process.env.SUPER_ADMIN_EMAIL && user.email 
    ? user.email.toLowerCase() === process.env.SUPER_ADMIN_EMAIL.toLowerCase() 
    : false;

  return (
    <DashboardLayout 
      businessName={business?.name} 
      logoUrl={business?.logo_url} 
      isSuperAdmin={isSuperAdmin}
      subscriptionStatus={business?.subscription_status}
      planId={business?.plan_id}
      createdAt={business?.created_at}
    >
      {children}
    </DashboardLayout>
  );
}
