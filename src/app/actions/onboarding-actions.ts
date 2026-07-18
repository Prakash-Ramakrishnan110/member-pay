'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function completeOnboarding(prevState: unknown, formData: FormData) {
  try {
    const supabase = await createClient();
    
    // Authenticate user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { error: 'You must be logged in to complete onboarding.' };
    }

    // Extract form data
    const name = formData.get('name') as string;
    const type = formData.get('type') as string;
    const city = formData.get('city') as string;
    const paymentSetup = formData.get('paymentSetup') as string;
    const memberCount = formData.get('memberCount') as string;
    const upiId = formData.get('upiId') as string;
    const razorpayAccountId = formData.get('razorpayAccountId') as string;

    if (!name || !type) {
      return { error: 'Business name and type are required.' };
    }

    // Update the business profile
    const { error: updateError } = await supabase
      .from('businesses')
      .update({
        name: name,
        business_type: type,
        city: city || null,
        payment_setup: paymentSetup || 'manual',
        member_count: memberCount || null,
        upi_id: upiId || null,
        razorpay_account_id: razorpayAccountId || null,
        logo_url: formData.get('logoUrl') as string || null,
      })
      .eq('id', user.id);

    if (updateError) {
      console.error('Update error:', updateError);
      return { error: `Failed: ${updateError.message} (Code: ${updateError.code})` };
    }

    // Force Next.js to re-fetch layout & dashboard data
    revalidatePath('/', 'layout');

  } catch (error: unknown) {
    console.error('Onboarding action error:', error);
    return { error: 'An unexpected error occurred.' };
  }

  // Redirect outside the try-catch because Next.js redirect throws an error internally
  redirect('/dashboard');
}
