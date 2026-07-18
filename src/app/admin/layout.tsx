import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import { AdminLayoutClient } from '@/components/admin/admin-layout-client';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Check if this user is the Super Admin
  const superAdminEmail = process.env.SUPER_ADMIN_EMAIL;
  
  if (!superAdminEmail || user.email?.toLowerCase() !== superAdminEmail.toLowerCase()) {
    redirect('/dashboard');
  }

  return (
    <AdminLayoutClient userEmail={user.email}>
      {children}
    </AdminLayoutClient>
  );
}
