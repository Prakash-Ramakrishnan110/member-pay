'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function addMember(prevState: unknown, formData: FormData) {
  try {
    const supabase = await createClient();
    
    // Authenticate user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { error: 'You must be logged in to add a member.' };
    }

    // Get business profile
    const { data: business } = await supabase
      .from('businesses')
      .select('id')
      .eq('id', user.id)
      .single();

    if (!business) {
      return { error: 'Business profile not found.' };
    }

    // Extract form data
    const name = formData.get('name') as string;
    const phone = formData.get('phone') as string;
    const plan_name = formData.get('plan_name') as string;
    const fee_amount = parseFloat(formData.get('fee_amount') as string);
    const billing_cycle = formData.get('billing_cycle') as string;
    const start_date = formData.get('start_date') as string;
    const batch_timing = formData.get('batch_timing') as string;
    const working_days = formData.get('working_days') as string;
    const dob = formData.get('dob') as string;

    // Validate inputs
    if (!name || !phone || !plan_name || isNaN(fee_amount) || !billing_cycle || !start_date) {
      return { error: 'Please fill out all required fields correctly.' };
    }

    // Check for existing member with same phone number in this business
    const { data: existingMember } = await supabase
      .from('members')
      .select('id')
      .eq('business_id', business.id)
      .eq('phone', phone)
      .single();

    if (existingMember) {
      return { error: 'A member with this phone number already exists in your workspace.' };
    }

    // Calculate next due date / plan_end_date
    const isTrial = formData.get('is_trial') === 'on';
    
    let next_due_date = formData.get('next_due_date') as string;
    const startDateObj = new Date(start_date);
    const nextDueDateObj = new Date(startDateObj);
    
    if (isTrial) {
      nextDueDateObj.setDate(nextDueDateObj.getDate() + 7);
    } else {
      if (billing_cycle === 'Monthly' || billing_cycle === '1 Month') {
        nextDueDateObj.setMonth(nextDueDateObj.getMonth() + 1);
      } else if (billing_cycle === 'Quarterly' || billing_cycle === '3 Months') {
        nextDueDateObj.setMonth(nextDueDateObj.getMonth() + 3);
      } else if (billing_cycle === '6 Months') {
        nextDueDateObj.setMonth(nextDueDateObj.getMonth() + 6);
      } else if (billing_cycle === 'Yearly' || billing_cycle === '12 Months') {
        nextDueDateObj.setFullYear(nextDueDateObj.getFullYear() + 1);
      }
    }

    if (!next_due_date) {
      next_due_date = nextDueDateObj.toISOString().split('T')[0];
    }
    
    const subscription_status = isTrial ? 'Trial' : 'Active';

    // Insert into Supabase
    const { error: insertError } = await supabase
      .from('members')
      .insert({
        business_id: business.id,
        name,
        phone,
        plan_name,
        fee_amount: isTrial ? 0 : fee_amount,
        billing_cycle: isTrial ? '7 Days' : billing_cycle,
        start_date, // Legacy field
        next_due_date, // Legacy field
        plan_start_date: startDateObj.toISOString(),
        plan_end_date: nextDueDateObj.toISOString(),
        subscription_status: subscription_status,
        batch_timing,
        working_days,
        dob: dob || null,
        status: 'Active'
      });

    if (insertError) {
      console.error('Insert error:', insertError);
      
      // Handle unique constraint error gracefully
      if (insertError.code === '23505') {
        return { error: 'A member with this phone number already exists in your workspace.' };
      }
      
      return { error: 'Failed to add member to database.' };
    }

    // Try to send Welcome Message
    const { data: businessData } = await supabase
      .from('businesses')
      .select('name, welcome_template')
      .eq('id', business.id)
      .single();

    if (businessData && businessData.welcome_template) {
      try {
        let msg = businessData.welcome_template
          .replace(/{{name}}/g, name)
          .replace(/{{business_name}}/g, businessData.name || 'our gym')
          .replace(/{{plan_name}}/g, plan_name)
          .replace(/{{due_date}}/g, nextDueDateObj.toLocaleDateString());

        const whatsappUrl = process.env.NEXT_PUBLIC_WHATSAPP_SERVER_URL || 'http://127.0.0.1:3001';
        fetch(`${whatsappUrl}/api/send-message`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            businessId: business.id,
            phone: phone,
            message: msg
          })
        }).catch(err => console.error("Failed to send welcome message", err));
      } catch (e) {
        console.error("Error constructing welcome message", e);
      }
    }

    // Revalidate the dashboard to show the new member instantly
    revalidatePath('/dashboard');
    
    return { success: true };

  } catch (error: unknown) {
    console.error('Action error:', error);
    return { error: 'An unexpected error occurred.' };
  }
}

export async function editMember(prevState: unknown, formData: FormData) {
  try {
    const supabase = await createClient();
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { error: 'You must be logged in to edit a member.' };
    }

    const { data: business } = await supabase
      .from('businesses')
      .select('id')
      .eq('id', user.id)
      .single();

    if (!business) {
      return { error: 'Business profile not found.' };
    }

    const member_id = formData.get('member_id') as string;
    const name = formData.get('name') as string;
    const phone = formData.get('phone') as string;
    const plan_name = formData.get('plan_name') as string;
    const fee_amount = parseFloat(formData.get('fee_amount') as string);
    const billing_cycle = formData.get('billing_cycle') as string;
    const plan_start_date = formData.get('plan_start_date') as string;
    const plan_end_date = formData.get('plan_end_date') as string;
    const subscription_status = formData.get('subscription_status') as string;
    const batch_timing = formData.get('batch_timing') as string;
    const working_days = formData.get('working_days') as string;
    const dob = formData.get('dob') as string;

    if (!member_id || !name || !phone || !plan_name || isNaN(fee_amount) || !billing_cycle || !plan_start_date || !plan_end_date) {
      return { error: 'Please fill out all required fields correctly.' };
    }

    // Check for existing member with same phone number but different ID
    const { data: existingMember } = await supabase
      .from('members')
      .select('id')
      .eq('business_id', business.id)
      .eq('phone', phone)
      .neq('id', member_id)
      .maybeSingle();

    if (existingMember) {
      return { error: 'Another member with this phone number already exists.' };
    }

    // Prepare date strings (fallback to start_date and next_due_date for backwards compatibility if needed, but we now use plan dates)
    const startDateObj = new Date(plan_start_date);
    const endDateObj = new Date(plan_end_date);

    const updateData: any = {
      name,
      phone,
      plan_name,
      fee_amount,
      billing_cycle,
      plan_start_date: startDateObj.toISOString(),
      plan_end_date: endDateObj.toISOString(),
      subscription_status,
      start_date: plan_start_date, // Legacy field sync
      next_due_date: plan_end_date, // Legacy field sync
      batch_timing,
      working_days,
      dob: dob || null
    };

    const { error: updateError } = await supabase
      .from('members')
      .update(updateData)
      .eq('id', member_id)
      .eq('business_id', business.id);

    if (updateError) {
      console.error('Update error:', updateError);
      return { error: 'Failed to update member in database.' };
    }

    revalidatePath('/dashboard');
    revalidatePath('/members');
    
    return { success: true };

  } catch (error: unknown) {
    console.error('Action error:', error);
    return { error: 'An unexpected error occurred.' };
  }
}

export async function deleteMember(prevState: unknown, formData: FormData) {
  try {
    const supabase = await createClient();
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { error: 'You must be logged in to delete a member.' };
    }

    const { data: business } = await supabase
      .from('businesses')
      .select('id')
      .eq('id', user.id)
      .single();

    if (!business) {
      return { error: 'Business profile not found.' };
    }

    const member_id = formData.get('member_id') as string;
    
    if (!member_id) {
      return { error: 'Member ID is missing.' };
    }

    const { error: deleteError } = await supabase
      .from('members')
      .delete()
      .eq('id', member_id)
      .eq('business_id', business.id);

    if (deleteError) {
      console.error('Delete error:', deleteError);
      return { error: 'Failed to delete member.' };
    }

    revalidatePath('/dashboard');
    revalidatePath('/members');
    
    return { success: true };

  } catch (error: unknown) {
    console.error('Action error:', error);
    return { error: 'An unexpected error occurred.' };
  }
}

export async function markAsPaid(memberId: string, paymentDetails?: { method: string, transactionId: string }) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: 'Unauthorized' };

    const { data: member } = await supabase
      .from('members')
      .select('next_due_date, billing_cycle, fee_amount')
      .eq('id', memberId)
      .eq('business_id', user.id)
      .single();

    if (!member) return { error: 'Member not found' };

    const nextDueDateObj = new Date(member.next_due_date || new Date());
    
    if (member.billing_cycle === 'Monthly' || member.billing_cycle === '1 Month') {
      nextDueDateObj.setMonth(nextDueDateObj.getMonth() + 1);
    } else if (member.billing_cycle === 'Quarterly' || member.billing_cycle === '3 Months') {
      nextDueDateObj.setMonth(nextDueDateObj.getMonth() + 3);
    } else if (member.billing_cycle === '6 Months') {
      nextDueDateObj.setMonth(nextDueDateObj.getMonth() + 6);
    } else if (member.billing_cycle === 'Yearly' || member.billing_cycle === '12 Months') {
      nextDueDateObj.setFullYear(nextDueDateObj.getFullYear() + 1);
    }

    const { error: updateError } = await supabase
      .from('members')
      .update({ next_due_date: nextDueDateObj.toISOString().split('T')[0] })
      .eq('id', memberId)
      .eq('business_id', user.id);

    if (updateError) throw updateError;
    
    // Log the payment
    if (paymentDetails) {
      await supabase.from('payments').insert({
        business_id: user.id,
        member_id: memberId,
        amount: member.fee_amount,
        status: 'Paid',
        method: paymentDetails.method,
        razorpay_payment_id: paymentDetails.transactionId || null,
        paid_at: new Date().toISOString()
      });
    }

    revalidatePath('/dashboard');
    revalidatePath('/members');
    revalidatePath('/payments');

    return { success: true };
  } catch (error) {
    console.error('markAsPaid error:', error);
    return { error: 'Failed to mark as paid' };
  }
}

export async function markAsUnpaid(memberId: string) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: 'Unauthorized' };

    const { data: member } = await supabase
      .from('members')
      .select('next_due_date, billing_cycle')
      .eq('id', memberId)
      .eq('business_id', user.id)
      .single();

    if (!member) return { error: 'Member not found' };

    const nextDueDateObj = new Date(member.next_due_date || new Date());
    
    if (member.billing_cycle === 'Monthly' || member.billing_cycle === '1 Month') {
      nextDueDateObj.setMonth(nextDueDateObj.getMonth() - 1);
    } else if (member.billing_cycle === 'Quarterly' || member.billing_cycle === '3 Months') {
      nextDueDateObj.setMonth(nextDueDateObj.getMonth() - 3);
    } else if (member.billing_cycle === '6 Months') {
      nextDueDateObj.setMonth(nextDueDateObj.getMonth() - 6);
    } else if (member.billing_cycle === 'Yearly' || member.billing_cycle === '12 Months') {
      nextDueDateObj.setFullYear(nextDueDateObj.getFullYear() - 1);
    }

    const { error } = await supabase
      .from('members')
      .update({ next_due_date: nextDueDateObj.toISOString().split('T')[0] })
      .eq('id', memberId)
      .eq('business_id', user.id);

    if (error) throw error;

    revalidatePath('/dashboard');
    revalidatePath('/members');
    revalidatePath('/payments');

    return { success: true };
  } catch (error) {
    console.error('markAsUnpaid error:', error);
    return { error: 'Failed to mark as unpaid' };
  }
}

import { createClient as createSupabaseClient } from '@supabase/supabase-js';

export async function markAsPaidByStudent(memberId: string, transactionId?: string) {
  try {
    const supabase = await createClient();
    
    // No auth check because this is called by the student from the public payment link
        const { data: member } = await supabase
        .from('members')
        .select('business_id, next_due_date, billing_cycle, fee_amount, name, phone, businesses(name)')
        .eq('id', memberId)
        .single();

    if (!member) return { error: 'Member not found' };

    // Log the payment as Verification Pending
    const { error: insertError } = await supabase.from('payments').insert({
      business_id: member.business_id,
      member_id: memberId,
      amount: member.fee_amount,
      status: 'Verification Pending',
      method: 'UPI',
      razorpay_payment_id: transactionId || null,
      paid_at: new Date().toISOString()
    });

    if (insertError) throw insertError;

    revalidatePath('/dashboard');
    revalidatePath('/payments');

    // Send the WhatsApp verification processing message from the server
    try {
      const whatsappUrl = process.env.NEXT_PUBLIC_WHATSAPP_SERVER_URL || 'http://127.0.0.1:3001';
      // @ts-ignore - Supabase type inference for nested objects is sometimes strict
      const gymName = member.businesses?.name || 'our gym';
      
      await fetch(`${whatsappUrl}/api/send-message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessId: member.business_id,
          phone: member.phone,
          message: `Hello ${member.name},\n\nYour payment verification for ${gymName} is currently under process.\n\nWe will notify you once it is confirmed.`
        }),
      });
    } catch (e) {
      console.error("Failed to send WA message in action", e);
    }

    return { success: true };
  } catch (error) {
    console.error('markAsPaidByStudent error:', error);
    return { error: 'Failed to confirm payment' };
  }
}

export async function verifyPayment(memberId: string, paymentId: string) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: 'Unauthorized' };

    const { data: member } = await supabase
      .from('members')
      .select('next_due_date, billing_cycle')
      .eq('id', memberId)
      .eq('business_id', user.id)
      .single();

    if (!member) return { error: 'Member not found' };

    const nextDueDateObj = new Date(member.next_due_date || new Date());
    
    if (member.billing_cycle === 'Monthly' || member.billing_cycle === '1 Month') {
      nextDueDateObj.setMonth(nextDueDateObj.getMonth() + 1);
    } else if (member.billing_cycle === 'Quarterly' || member.billing_cycle === '3 Months') {
      nextDueDateObj.setMonth(nextDueDateObj.getMonth() + 3);
    } else if (member.billing_cycle === '6 Months') {
      nextDueDateObj.setMonth(nextDueDateObj.getMonth() + 6);
    } else if (member.billing_cycle === 'Yearly' || member.billing_cycle === '12 Months') {
      nextDueDateObj.setFullYear(nextDueDateObj.getFullYear() + 1);
    }

    // 1. Update member due date
    const { error: updateError } = await supabase
      .from('members')
      .update({ next_due_date: nextDueDateObj.toISOString().split('T')[0] })
      .eq('id', memberId);

    if (updateError) throw updateError;

    // 2. Mark payment as Paid
    const { error: payError } = await supabase
      .from('payments')
      .update({ status: 'Paid' })
      .eq('id', paymentId);

    if (payError) throw payError;

    revalidatePath('/dashboard');
    revalidatePath('/members');
    revalidatePath('/payments');

    return { success: true };
  } catch (error) {
    console.error('verifyPayment error:', error);
    return { error: 'Failed to verify payment' };
  }
}

export async function rejectPayment(paymentId: string) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: 'Unauthorized' };

    // Mark payment as Failed
    const { error: payError } = await supabase
      .from('payments')
      .update({ status: 'Failed' })
      .eq('id', paymentId)
      .eq('business_id', user.id);

    if (payError) throw payError;

    revalidatePath('/dashboard');
    revalidatePath('/payments');

    return { success: true };
  } catch (error) {
    console.error('rejectPayment error:', error);
    return { error: 'Failed to reject payment' };
  }
}
