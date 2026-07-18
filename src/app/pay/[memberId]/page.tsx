import { createClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';
import { PayClient } from '@/components/dashboard/pay-client';

export default async function PayPage({ params }: { params: Promise<{ memberId: string }> | { memberId: string } }) {
  const resolvedParams = await params;
  const supabase = await createClient();

  // Fetch the member
  const { data: member, error: memberError } = await supabase
    .from('members')
    .select('*')
    .eq('id', resolvedParams.memberId)
    .single();

  if (memberError || !member) {
    return notFound();
  }

  // Fetch the business settings for this member's gym
  const { data: settings } = await supabase
    .from('businesses')
    .select('*')
    .eq('id', member.business_id)
    .single();

  if (!settings || !settings.upi_id) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-sm text-center max-w-md w-full ring-1 ring-slate-200">
          <div className="h-16 w-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-slate-900 mb-2">Payment Setup Incomplete</h1>
          <p className="text-slate-500">
            This business has not configured their UPI payment details yet. Please contact the gym directly to make a payment.
          </p>
        </div>
      </div>
    );
  }

  return <PayClient member={member} settings={settings} />;
}
