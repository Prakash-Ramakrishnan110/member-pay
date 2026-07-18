import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    // Call the WhatsApp Microservice
    const whatsappUrl = process.env.NEXT_PUBLIC_WHATSAPP_SERVER_URL || 'http://127.0.0.1:3001';
    const response = await fetch(`${whatsappUrl}/api/sessions/${user.id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({ success: false, error: data.error || 'Failed to initialize session' }, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error in whatsapp session API route:', error);
    return NextResponse.json({ success: false, error: 'Cannot reach WhatsApp service. Make sure the Node server is running on port 3001.' }, { status: 500 });
  }
}
