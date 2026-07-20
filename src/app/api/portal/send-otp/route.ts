import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

const WHATSAPP_SERVER_URL = process.env.NEXT_PUBLIC_WHATSAPP_SERVER_URL || 'http://127.0.0.1:3001';

export async function POST(request: Request) {
  try {
    const { phone } = await request.json();
    if (!phone) {
      return NextResponse.json({ error: 'Phone number is required' }, { status: 400 });
    }

    // 1. Check if member exists
    const { data: member, error: memError } = await supabase
      .from('members')
      .select('id, business_id')
      .eq('phone', phone)
      .single();

    if (memError || !member) {
      return NextResponse.json({ error: 'No active membership found with this number' }, { status: 404 });
    }

    // 2. Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 10); // 10 min expiry

    // 3. Upsert into member_otps
    const { error: otpError } = await supabase
      .from('member_otps')
      .upsert({ member_id: member.id, otp_code: otp, expires_at: expiresAt.toISOString() }, { onConflict: 'member_id' });

    if (otpError) {
      throw otpError;
    }

    // 4. Send via WhatsApp
    const message = `Your MemberPay verification code is: ${otp}. It will expire in 10 minutes.`;
    
    // We send it from the business's WhatsApp session
    const res = await fetch(`${WHATSAPP_SERVER_URL}/api/send-message`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ businessId: member.business_id, phone, message })
    });

    if (!res.ok) {
      console.error('Failed to send OTP via WA');
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[Send OTP Error]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
