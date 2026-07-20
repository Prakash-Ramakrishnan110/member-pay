'use server';

import { createClient } from '@/utils/supabase/server';

const WHATSAPP_SERVER_URL = process.env.NEXT_PUBLIC_WHATSAPP_SERVER_URL || 'http://127.0.0.1:3001';

export async function sendBulkAnnouncement(audience: 'All Active' | 'Inactive' | 'Expiring Soon', message: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Not authenticated' };
  }

  const { data: members, error } = await supabase
    .from('members')
    .select('id, name, phone, status, next_due_date')
    .eq('business_id', user.id);

  if (error) {
    return { error: 'Failed to fetch members' };
  }

  let targetMembers = members || [];
  
  if (audience === 'All Active') {
    targetMembers = targetMembers.filter(m => m.status === 'Active');
  } else if (audience === 'Inactive') {
    targetMembers = targetMembers.filter(m => m.status === 'Inactive');
  } else if (audience === 'Expiring Soon') {
    const today = new Date();
    today.setHours(0,0,0,0);
    const in7Days = new Date(today);
    in7Days.setDate(in7Days.getDate() + 7);
    
    targetMembers = targetMembers.filter(m => {
      if (m.status !== 'Active' || !m.next_due_date) return false;
      const nextDue = new Date(m.next_due_date);
      return nextDue >= today && nextDue <= in7Days;
    });
  }

  if (targetMembers.length === 0) {
    return { error: 'No members found for this audience' };
  }

  let successCount = 0;
  let failCount = 0;

  for (const member of targetMembers) {
    const personalizedMessage = message.replace(/{{name}}/g, member.name);
    try {
      const res = await fetch(`${WHATSAPP_SERVER_URL}/api/send-message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          businessId: user.id, 
          phone: member.phone, 
          message: personalizedMessage 
        })
      });
      if (res.ok) successCount++;
      else failCount++;
    } catch (err) {
      failCount++;
    }
    
    // Slight delay to prevent rate limiting
    await new Promise(r => setTimeout(r, 200));
  }

  return { success: true, successCount, failCount };
}
