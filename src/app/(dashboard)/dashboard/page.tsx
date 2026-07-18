import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Users, 
  IndianRupee, 
  TrendingUp, 
  Activity, 
  Plus
} from 'lucide-react';
import { AddMemberDialog } from '@/components/dashboard/add-member-dialog';

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Fetch Business Profile
  const { data: business } = await supabase
    .from('businesses')
    .select('*')
    .eq('id', user.id)
    .single();

  // Fetch all members for the business
  const { data: members } = await supabase
    .from('members')
    .select('*')
    .eq('business_id', user.id)
    .order('created_at', { ascending: false });
    
  let totalMonthlyRevenue = 0;
  let activeMembersCount = 0;
  let pendingCollections = 0;
  let unpaidMembersCount = 0;

  const today = new Date();
  today.setHours(0,0,0,0);

  members?.forEach(member => {
    // Determine active status from new or old fields
    const isTrial = member.subscription_status === 'Trial';
    let isExpired = false;
    
    const endDateStr = member.plan_end_date || member.next_due_date;
    if (endDateStr) {
      const dueDate = new Date(endDateStr);
      if (dueDate < today) {
        isExpired = true;
      }
    } else if (member.status !== 'Active') {
      isExpired = true;
    }

    if (!isExpired && !isTrial) {
      activeMembersCount++;
      if (member.billing_cycle === 'Monthly' || member.billing_cycle === '1 Month') totalMonthlyRevenue += member.fee_amount;
      else if (member.billing_cycle === 'Quarterly' || member.billing_cycle === '3 Months') totalMonthlyRevenue += (member.fee_amount / 3);
      else if (member.billing_cycle === '6 Months') totalMonthlyRevenue += (member.fee_amount / 6);
      else if (member.billing_cycle === 'Yearly' || member.billing_cycle === '12 Months') totalMonthlyRevenue += (member.fee_amount / 12);
    }
    
    // Check pending collections (plan_end_date is in the past)
    if (isExpired && !isTrial) {
      unpaidMembersCount++;
      pendingCollections += (member.fee_amount || 0);
    }
  });

  const recentMembers = members?.slice(0, 5) || [];

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-10">
      
      {/* Page Header (Slim & Elegant) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Welcome back, {business?.name || 'Admin'}
          </h1>
          <p className="text-slate-500 font-medium text-sm mt-1">
            Here is what&apos;s happening at {business?.name || 'your workspace'} today.
          </p>
        </div>
        <div className="flex gap-3 shrink-0 items-center">
          <Button variant="outline" className="bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:text-slate-900 font-semibold h-9 px-4 rounded-md shadow-sm">
            View Reports
          </Button>
          <div className="[&>button]:h-9 [&>button]:px-4 [&>button]:rounded-md [&>button]:shadow-sm">
            <AddMemberDialog />
          </div>
        </div>
      </div>

      {/* Stat Cards Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-none shadow-sm ring-1 ring-slate-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Total Revenue (Monthly)</CardTitle>
            <IndianRupee className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">₹{totalMonthlyRevenue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</div>
            <p className="text-xs text-green-600 font-medium flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" /> Estimated monthly run-rate
            </p>
          </CardContent>
        </Card>
        
        <Card className="border-none shadow-sm ring-1 ring-slate-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Active Members</CardTitle>
            <Users className="h-4 w-4 text-indigo-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{activeMembersCount}</div>
            <p className="text-xs text-slate-500 mt-1">
              Currently active in the system
            </p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm ring-1 ring-slate-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Pending Collections</CardTitle>
            <Activity className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">₹{pendingCollections.toLocaleString('en-IN')}</div>
            <p className="text-xs text-orange-600 font-medium mt-1">
              From {unpaidMembersCount} unpaid members
            </p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm ring-1 ring-slate-200 bg-gradient-to-br from-slate-900 to-slate-800 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">WhatsApp Reminders</CardTitle>
            <svg className="h-5 w-5 text-green-400" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-slate-400 mt-1">
              Automated messages sent
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Data Section */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Members Table */}
        <div className="xl:col-span-2">
          <Card className="border-none shadow-sm ring-1 ring-slate-200">
            <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 bg-white pb-4">
              <div>
                <CardTitle className="text-lg">Recent Members</CardTitle>
                <CardDescription>Members recently added to your workspace.</CardDescription>
              </div>
              <Button variant="outline" size="sm">View All</Button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-100">
                    <tr>
                      <th className="px-6 py-4 font-medium">Name</th>
                      <th className="px-6 py-4 font-medium">Plan</th>
                      <th className="px-6 py-4 font-medium">Status</th>
                      <th className="px-6 py-4 font-medium text-right">Fee</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {recentMembers && recentMembers.length > 0 ? (
                      recentMembers.map((member) => (
                        <tr key={member.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="font-medium text-slate-900">{member.name}</div>
                            <div className="text-slate-500 text-xs">{member.phone}</div>
                          </td>
                          <td className="px-6 py-4 text-slate-600">{member.plan_name}</td>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20">
                              {member.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right font-medium text-slate-900">
                            ₹{member.fee_amount}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="px-6 py-12 text-center">
                          <div className="flex flex-col items-center justify-center">
                            <Users className="h-10 w-10 text-slate-300 mb-3" />
                            <p className="text-slate-500 font-medium">No members found</p>
                            <p className="text-slate-400 text-xs mt-1">Get started by adding your first member.</p>
                            <Button variant="outline" className="mt-4" size="sm">
                              <Plus className="h-4 w-4 mr-2" /> Add Member
                            </Button>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Side Panel: Recent Activity */}
        <div className="xl:col-span-1">
          <Card className="border-none shadow-sm ring-1 ring-slate-200">
            <CardHeader className="border-b border-slate-100 pb-4 bg-white">
              <CardTitle className="text-lg">Recent Activity</CardTitle>
              <CardDescription>Payments and notifications.</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                {recentMembers && recentMembers.length > 0 ? (
                  recentMembers.slice(0, 4).map((member) => (
                    <div key={member.id} className="flex items-start gap-4">
                      <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Users className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900">New member joined</p>
                        <p className="text-xs text-slate-500">{member.name} • Added on {new Date(member.created_at).toLocaleDateString('en-IN')}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-slate-500 text-sm">
                    No recent activity to display.
                  </div>
                )}
              </div>
              
              <a href="/members" className="flex w-full items-center justify-center rounded-md text-sm font-medium transition-colors h-9 px-4 mt-6 text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                View All Members
              </a>
            </CardContent>
          </Card>
        </div>
        
      </div>
    </div>
  );
}
