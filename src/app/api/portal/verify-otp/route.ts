import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { cookies } from 'next/headers';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const { phone, otp } = await request.json();
    if (!phone || !otp) {
      return NextResponse.json({ error: 'Phone and OTP are required' }, { status: 400 });
    }

    // 1. Get member by phone
    const { data: member } = await supabase
      .from('members')
      .select('id')
      .eq('phone', phone)
      .single();

    if (!member) {
      return NextResponse.json({ error: 'Invalid phone number' }, { status: 404 });
    }

    // 2. Check OTP
    const { data: otpData } = await supabase
      .from('member_otps')
      .select('*')
      .eq('member_id', member.id)
      .single();

    if (!otpData) {
      return NextResponse.json({ error: 'No OTP found or expired' }, { status: 400 });
    }

    if (otpData.otp_code !== otp) {
      return NextResponse.json({ error: 'Invalid OTP' }, { status: 400 });
    }

    if (new Date(otpData.expires_at) < new Date()) {
      return NextResponse.json({ error: 'OTP has expired' }, { status: 400 });
    }

    // 3. OTP valid. Delete it.
    await supabase.from('member_otps').delete().eq('member_id', member.id);

    // 4. Generate signed cookie
    const secret = process.env.SUPABASE_JWT_SECRET || 'fallback_secret_for_local_dev';
    const hmac = crypto.createHmac('sha256', secret);
    hmac.update(member.id);
    const signature = hmac.digest('hex');
    
    const token = `${member.id}.${signature}`;

    const cookieStore = await cookies();
    cookieStore.set('member_portal_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 30 // 30 days
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[Verify OTP Error]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
