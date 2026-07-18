import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { ReportsClient } from '@/components/dashboard/reports-client';

export default async function ReportsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Fetch all members for this user
  const { data: members } = await supabase
    .from('members')
    .select('*')
    .eq('business_id', user.id)
    .order('created_at', { ascending: true });

  const activeMembers = (members || []).filter(m => {
    if (m.subscription_status === 'Trial') return false; // Exclude trials from revenue reports
    
    const endDateStr = m.plan_end_date || m.next_due_date;
    if (endDateStr) {
      const dueDate = new Date(endDateStr);
      if (dueDate < new Date()) {
        return false; // Expired
      }
    } else if (m.status !== 'Active') {
      return false;
    }
    
    return true;
  });
  const currentYear = new Date().getFullYear();
  let totalRevenueYTD = 0;
  let newMembersYTD = 0;
  let totalMRR = 0;

  activeMembers.forEach(member => {
    // New Members YTD
    const startYear = new Date(member.plan_start_date || member.start_date || member.created_at).getFullYear();
    if (startYear === currentYear) {
      newMembersYTD++;
    }

    // Calculate MRR equivalent for each member
    let mrrMultiplier = 1;
    const cycle = member.billing_cycle?.toLowerCase() || 'monthly';
    const fee = member.fee_amount || 0;

    if (cycle.includes('3 month') || cycle.includes('quarterly')) mrrMultiplier = 1 / 3;
    else if (cycle.includes('6 month')) mrrMultiplier = 1 / 6;
    else if (cycle.includes('year') || cycle.includes('12 month')) mrrMultiplier = 1 / 12;
    else if (cycle.includes('week')) mrrMultiplier = 4;
    
    const mrr = fee * mrrMultiplier;
    totalMRR += mrr;
    
    // Estimate YTD Revenue:
    // Simply MRR * (months active in current year)
    const joinDate = new Date(member.plan_start_date || member.start_date || member.created_at);
    const monthsActiveThisYear = startYear < currentYear 
      ? new Date().getMonth() + 1 
      : new Date().getMonth() - joinDate.getMonth() + 1;
      
    if (monthsActiveThisYear > 0) {
      totalRevenueYTD += mrr * monthsActiveThisYear;
    }
  });

  const avgRevenuePerUser = activeMembers.length > 0 ? totalMRR / activeMembers.length : 0;

  // Chart Data: Cumulative MRR over the last 6 months
  const chartData = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    const monthName = d.toLocaleString('default', { month: 'short' });
    const targetYear = d.getFullYear();
    const targetMonth = d.getMonth();

    let monthMRR = 0;
    activeMembers.forEach(member => {
    const joinDate = new Date(member.plan_start_date || member.start_date || member.created_at);
      // If member joined before or during this target month/year
      if (
        joinDate.getFullYear() < targetYear || 
        (joinDate.getFullYear() === targetYear && joinDate.getMonth() <= targetMonth)
      ) {
        let mrrMultiplier = 1;
        const cycle = member.billing_cycle?.toLowerCase() || 'monthly';
        if (cycle.includes('3 month') || cycle.includes('quarterly')) mrrMultiplier = 1 / 3;
        else if (cycle.includes('6 month')) mrrMultiplier = 1 / 6;
        else if (cycle.includes('year') || cycle.includes('12 month')) mrrMultiplier = 1 / 12;
        
        monthMRR += (member.fee_amount || 0) * mrrMultiplier;
      }
    });

    chartData.push({
      month: monthName,
      revenue: Math.round(monthMRR)
    });
  }

  const metrics = {
    totalRevenueYTD: Math.round(totalRevenueYTD),
    newMembersYTD,
    avgRevenuePerUser: Math.round(avgRevenuePerUser)
  };

  return (
    <ReportsClient 
      metrics={metrics} 
      chartData={chartData} 
      members={members || []} 
    />
  );
}
