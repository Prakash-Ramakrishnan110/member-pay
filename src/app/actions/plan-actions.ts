'use server';

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

export async function getPlans() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data: plans } = await supabase
    .from('plans')
    .select('*')
    .eq('business_id', user.id)
    .order('created_at', { ascending: false });

  return plans || [];
}

export async function addPlan(prevState: any, formData: FormData) {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          cookieStore.set(name, value, options);
        },
        remove(name: string, options: any) {
          cookieStore.set(name, '', { ...options, maxAge: 0 });
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Not authenticated' };

  const name = formData.get('name') as string;
  const price = formData.get('price') as string;
  const duration = formData.get('duration') as string;

  if (!name || !price || !duration) {
    return { error: 'All fields are required' };
  }

  const { error } = await supabase
    .from('plans')
    .insert([{
      business_id: user.id,
      name,
      price: parseFloat(price),
      duration,
      status: 'Active'
    }]);

  if (error) {
    console.error('Error adding plan:', error);
    return { error: error.message };
  }

  revalidatePath('/plans');
  return { success: true };
}

export async function archivePlan(id: string) {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          cookieStore.set(name, value, options);
        },
        remove(name: string, options: any) {
          cookieStore.set(name, '', { ...options, maxAge: 0 });
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { error } = await supabase
    .from('plans')
    .update({ status: 'Archived' })
    .eq('id', id)
    .eq('business_id', user.id);

  if (error) throw new Error(error.message);

  revalidatePath('/plans');
  return { success: true };
}
