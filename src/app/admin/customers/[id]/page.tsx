import { createClient, createAdminClient } from '@/utils/supabase/server';
import { CustomerDetailClient } from '@/components/admin/customer-detail-client';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function CustomerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const businessId = resolvedParams.id;
  const supabase = createAdminClient();

  // Fetch business info
  const { data: business } = await supabase
    .from('businesses')
    .select('*')
    .eq('id', businessId)
    .single();

  if (!business) {
    redirect('/admin/customers');
  }

  // Fetch business members
  const { data: members } = await supabase
    .from('members')
    .select('*')
    .eq('business_id', businessId);

  // Fetch admin notes (we catch the error if the table doesn't exist yet)
  const { data: adminNotes, error: notesError } = await supabase
    .from('admin_notes')
    .select('*')
    .eq('business_id', businessId)
    .order('created_at', { ascending: false });

  return (
    <CustomerDetailClient 
      business={business} 
      members={members || []} 
      initialNotes={adminNotes || []}
      notesError={notesError ? true : false}
    />
  );
}
