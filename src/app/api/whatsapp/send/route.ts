import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { phone, message } = await request.json();

    if (!phone || !message) {
      return NextResponse.json({ success: false, error: 'Missing phone or message' }, { status: 400 });
    }

    // Call the WhatsApp Microservice
    const whatsappUrl = process.env.NEXT_PUBLIC_WHATSAPP_SERVER_URL || 'http://127.0.0.1:3001';
    const response = await fetch(`${whatsappUrl}/api/send-message`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        businessId: user.id,
        phone,
        message,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({ success: false, error: data.error || 'Failed to send' }, { status: response.status });
    }

    return NextResponse.json({ success: true, message: 'Sent successfully' });
  } catch (error: any) {
    console.error('Error in whatsapp API route:', error);
    return NextResponse.json({ success: false, error: `Connection failed: ${error.message}` }, { status: 500 });
  }
}
