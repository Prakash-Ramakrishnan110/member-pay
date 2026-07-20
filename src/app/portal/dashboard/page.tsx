import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import crypto from 'crypto';
import { PortalDashboardClient } from '@/components/portal/portal-dashboard-client';

export default async function PortalDashboardPage() {
  const cookieStore = cookies();
  const token = cookieStore.get('member_portal_token')?.value;

  if (!token) {
    redirect('/portal');
  }

  const [memberId, signature] = token.split('.');
  if (!memberId || !signature) {
    redirect('/portal');
  }

  const secret = process.env.SUPABASE_JWT_SECRET || 'fallback_secret_for_local_dev';
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(memberId);
  const expectedSignature = hmac.digest('hex');

  if (signature !== expectedSignature) {
    redirect('/portal');
  }

  // Fetch member details and business details
  const { data: member } = await supabase
    .from('members')
    .select('*, businesses(name, upi_id)')
    .eq('id', memberId)
    .single();

  if (!member) {
    redirect('/portal');
  }

  return <PortalDashboardClient member={member} />;
}
