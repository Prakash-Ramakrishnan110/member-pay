import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

const WHATSAPP_SERVER_URL = process.env.NEXT_PUBLIC_WHATSAPP_SERVER_URL || 'http://127.0.0.1:3001';

async function sendWhatsAppMessage(businessId: string, phone: string, message: string) {
  try {
    const res = await fetch(`${WHATSAPP_SERVER_URL}/api/send-message`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ businessId, phone, message })
    });
    return res.ok;
  } catch (e) {
    console.error(`Failed to send WA message to ${phone}`, e);
    return false;
  }
}

// Helper to replace variables in template
function formatTemplate(template: string, member: any, business: any, paymentLink: string = '') {
  return template
    .replace(/{{name}}/g, member.name)
    .replace(/{{business_name}}/g, business.name || 'our gym')
    .replace(/{{plan_name}}/g, member.plan_name)
    .replace(/{{due_date}}/g, new Date(member.next_due_date).toLocaleDateString())
    .replace(/{{amount}}/g, member.fee_amount.toString())
    .replace(/{{payment_link}}/g, paymentLink);
}

export async function GET(request: Request) {
  try {
    console.log('[Cron] Starting daily reminder job...');

    // Fetch all businesses with their settings
    const { data: businesses, error: busError } = await supabase.from('businesses').select('*');
    if (busError) throw busError;
    
    // Fetch all active members
    const { data: members, error: memError } = await supabase.from('members').select('*').eq('status', 'Active');
    if (memError) throw memError;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const logsToInsert: any[] = [];
    const membersToSuspend: string[] = [];

    for (const member of members || []) {
      const business = businesses?.find(b => b.id === member.business_id);
      if (!business) continue;

      let paymentLink = '';
      if (business.upi_id) {
        paymentLink = `upi://pay?pa=${business.upi_id}&pn=${encodeURIComponent(business.name || '')}&am=${member.fee_amount}&cu=INR`;
      }

      const nextDueDate = new Date(member.next_due_date);
      nextDueDate.setHours(0, 0, 0, 0);

      const diffTime = nextDueDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      const gracePeriod = business.grace_period_days || 3;

      let messageToSend = null;
      let reminderType = null;

      // 1. Check for Birthday
      if (member.dob) {
        const dob = new Date(member.dob);
        if (dob.getMonth() === today.getMonth() && dob.getDate() === today.getDate()) {
          const bdayMsg = formatTemplate(business.birthday_template || 'Happy Birthday {{name}}!', member, business);
          await sendWhatsAppMessage(business.id, member.phone, bdayMsg);
          logsToInsert.push({ business_id: business.id, member_id: member.id, channel: 'whatsapp', type: 'Birthday', status: 'Sent' });
        }
      }

      // 2. Check for Deactivation (Grace period exceeded)
      if (diffDays <= -gracePeriod) {
        messageToSend = formatTemplate(
          business.suspension_template || 'Hi {{name}}, your membership has been suspended.', 
          member, business, paymentLink
        );
        reminderType = 'Suspension';
        membersToSuspend.push(member.id);
      } 
      // 3. Check for Reminders (T-3, Today, Overdue)
      else if (diffDays === 3 || diffDays === 0 || diffDays === -1) {
        messageToSend = formatTemplate(
          business.whatsapp_template || 'Hi {{name}}, your bill is due.', 
          member, business, paymentLink
        );
        reminderType = diffDays === 3 ? 'Upcoming' : (diffDays === 0 ? 'Due Today' : 'Overdue');
      }

      // Dispatch message if we have one for billing/suspension
      if (messageToSend && reminderType) {
        const success = await sendWhatsAppMessage(business.id, member.phone, messageToSend);
        logsToInsert.push({
          business_id: business.id,
          member_id: member.id,
          channel: 'whatsapp',
          type: reminderType,
          status: success ? 'Sent' : 'Failed'
        });
      }
    }

    // Suspend members who passed grace period
    if (membersToSuspend.length > 0) {
      await supabase.from('members').update({ status: 'Inactive' }).in('id', membersToSuspend);
      console.log(`[Cron] Suspended ${membersToSuspend.length} members.`);
    }

    // Insert logs
    if (logsToInsert.length > 0) {
      await supabase.from('reminders_log').insert(logsToInsert);
      console.log(`[Cron] Inserted ${logsToInsert.length} logs.`);
    }

    console.log('[Cron] Reminder job completed successfully.');
    return NextResponse.json({ success: true, processed: logsToInsert.length }, { status: 200 });

  } catch (error) {
    console.error('[Cron Error]', error);
    return NextResponse.json({ success: false, error: 'Failed to process reminders' }, { status: 500 });
  }
}
