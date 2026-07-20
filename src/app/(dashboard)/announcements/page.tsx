import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { AnnouncementsClient } from '@/components/dashboard/announcements-client';

export default async function AnnouncementsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Fetch metrics to show audience sizes
  const { data: members } = await supabase
    .from('members')
    .select('id, status, next_due_date, phone, name')
    .eq('business_id', user.id);

  const activeCount = (members || []).filter(m => m.status === 'Active').length;
  const inactiveCount = (members || []).filter(m => m.status === 'Inactive').length;

  const today = new Date();
  today.setHours(0,0,0,0);
  const in7Days = new Date(today);
  in7Days.setDate(in7Days.getDate() + 7);

  const expiringSoonCount = (members || []).filter(m => {
    if (m.status !== 'Active' || !m.next_due_date) return false;
    const nextDue = new Date(m.next_due_date);
    return nextDue >= today && nextDue <= in7Days;
  }).length;

  return (
    <AnnouncementsClient 
      businessId={user.id} 
      stats={{
        activeCount,
        inactiveCount,
        expiringSoonCount
      }}
    />
  );
}
