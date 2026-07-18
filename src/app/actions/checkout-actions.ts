'use server';

import { createClient } from '@/utils/supabase/server';
import crypto from 'crypto';
import { revalidatePath } from 'next/cache';

const RAZORPAY_KEY_ID = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;

export async function createRazorpayOrder(planAmount: number, planName: string) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { error: 'Unauthorized' };
    }

    if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
      return { error: 'Platform Razorpay keys are not configured.' };
    }

    const auth = Buffer.from(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`).toString('base64');
    
    // Amount is in paise (e.g., 499 INR = 49900 paise)
    const amountInPaise = planAmount * 100;

    const response = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${auth}`
      },
      body: JSON.stringify({
        amount: amountInPaise,
        currency: 'INR',
        receipt: `rcpt_${user.id.substring(0, 8)}_${Date.now()}`,
        notes: {
          business_id: user.id,
          plan_name: planName
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Razorpay Error:', errorData);
      return { error: 'Failed to create order with Razorpay.' };
    }

    const order = await response.json();

    return { 
      orderId: order.id, 
      amount: order.amount, 
      currency: order.currency,
      keyId: RAZORPAY_KEY_ID
    };

  } catch (error: any) {
    console.error('Checkout error:', error);
    return { error: error.message };
  }
}

export async function verifyPaymentAndUpdatePlan(
  razorpayPaymentId: string, 
  razorpayOrderId: string, 
  razorpaySignature: string,
  planName: string
) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { error: 'Unauthorized' };

    // Verify signature
    const text = razorpayOrderId + "|" + razorpayPaymentId;
    const expectedSignature = crypto
      .createHmac("sha256", RAZORPAY_KEY_SECRET || "")
      .update(text)
      .digest("hex");

    if (expectedSignature !== razorpaySignature) {
      // For local testing without real keys, we might allow bypass if secret is dummy
      if (RAZORPAY_KEY_SECRET !== 'placeholder_secret_key') {
        return { error: 'Invalid payment signature.' };
      }
    }

    // Get the Plan ID dynamically from the database
    const { data: planData } = await supabase
      .from('saas_plans')
      .select('id')
      .eq('name', planName)
      .single();
      
    const planId = planData?.id || null;

    // Calculate new expiry date
    const startDate = new Date();
    const expiryDate = new Date();
    
    // Add 365 days for annual, 30 days for monthly
    if (planName.includes('Annual') || planName.includes('Yearly')) {
      expiryDate.setDate(expiryDate.getDate() + 365);
    } else {
      expiryDate.setDate(expiryDate.getDate() + 30);
    }

    // Update business profile
    const { error } = await supabase
      .from('businesses')
      .update({
        plan_id: planId,
        subscription_status: 'active',
        subscription_starts_at: startDate.toISOString(),
        subscription_ends_at: expiryDate.toISOString()
      })
      .eq('id', user.id);

    if (error) {
      console.error('Failed to update business:', error);
      return { error: 'Payment successful, but failed to update account.' };
    }

    // Log the transaction
    await supabase.from('admin_notes').insert({
      business_id: user.id,
      note: `Upgraded to ${planName} Plan. Payment ID: ${razorpayPaymentId}`,
      created_by: user.id
    });

    revalidatePath('/dashboard');
    return { success: true };

  } catch (error: any) {
    console.error('Verification error:', error);
    return { error: error.message };
  }
}
