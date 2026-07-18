'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building2, UserPlus, Clock, IndianRupee, Users, Search, Activity } from 'lucide-react';
import { useState } from 'react';
import { Input } from '@/components/ui/input';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function AdminClient({ businesses, allMembers, recentLogs }: { businesses: any[], allMembers: any[], recentLogs: any[] }) {
  const [searchQuery, setSearchQuery] = useState('');

  // Calculate platform-wide metrics
  const activeMembers = allMembers.filter(m => m.status === 'Active');
  
  let estimatedPlatformMRR = 0;
  activeMembers.forEach(member => {
    let mrrMultiplier = 1;
    const cycle = member.billing_cycle?.toLowerCase() || 'monthly';
    const fee = member.fee_amount || 0;

    if (cycle.includes('3 month') || cycle.includes('quarterly')) mrrMultiplier = 1 / 3;
    else if (cycle.includes('6 month')) mrrMultiplier = 1 / 6;
    else if (cycle.includes('year') || cycle.includes('12 month')) mrrMultiplier = 1 / 12;
    else if (cycle.includes('week')) mrrMultiplier = 4;
    
    estimatedPlatformMRR += (fee * mrrMultiplier);
  });

  // Calculate stats per gym
  const gymsWithStats = businesses.map(gym => {
    const gymMembers = allMembers.filter(m => m.business_id === gym.id);
    const gymActiveMembers = gymMembers.filter(m => m.status === 'Active');
    
    let mrr = 0;
    gymActiveMembers.forEach(member => {
      let mrrMultiplier = 1;
      const cycle = member.billing_cycle?.toLowerCase() || 'monthly';
      const fee = member.fee_amount || 0;
      if (cycle.includes('3 month') || cycle.includes('quarterly')) mrrMultiplier = 1 / 3;
      else if (cycle.includes('6 month')) mrrMultiplier = 1 / 6;
      else if (cycle.includes('year') || cycle.includes('12 month')) mrrMultiplier = 1 / 12;
      mrr += (fee * mrrMultiplier);
    });

    return {
      ...gym,
      totalMembers: gymMembers.length,
      activeMembers: gymActiveMembers.length,
      mrr: Math.round(mrr)
    };
  });

  // ... gym directory logic moved to customers-client ...

  return (
    <div className="space-y-6">
      {/* Platform KPI Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-none shadow-sm ring-1 ring-slate-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Total Businesses</CardTitle>
            <Building2 className="h-4 w-4 text-indigo-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">{businesses.length}</div>
            <p className="text-xs text-slate-500 mt-1">Workspaces registered on platform</p>
          </CardContent>
        </Card>
        
        <Card className="border-none shadow-sm ring-1 ring-slate-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Total Members</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">{allMembers.length}</div>
            <p className="text-xs text-slate-500 mt-1">End-users managed</p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm ring-1 ring-slate-200 bg-gradient-to-br from-slate-900 to-slate-800 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Platform Estimated MRR</CardTitle>
            <IndianRupee className="h-4 w-4 text-emerald-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">₹{Math.round(estimatedPlatformMRR).toLocaleString('en-IN')}</div>
            <p className="text-xs text-slate-400 mt-1">Total volume flowing through platform</p>
          </CardContent>
        </Card>
      </div>

      {/* Activity Feed / Charts Space */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-none shadow-sm ring-1 ring-slate-200">
          <CardHeader>
            <CardTitle className="text-lg">Recent Platform Activity</CardTitle>
            <CardDescription>Live feed of signups and activity</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-100">
              {recentLogs?.length > 0 ? (
                recentLogs.map((log) => (
                  <div key={log.id} className="p-4 hover:bg-slate-50 flex gap-4 transition-colors">
                    <div className="mt-1 flex-shrink-0">
                      {log.type === 'business_signup' ? (
                        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                          <Building2 className="h-4 w-4 text-blue-600" />
                        </div>
                      ) : (
                        <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center">
                          <UserPlus className="h-4 w-4 text-emerald-600" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-900">{log.title}</p>
                      <p className="text-sm text-slate-600 mt-0.5">{log.description}</p>
                      <div className="flex items-center gap-1 mt-2 text-xs text-slate-400 font-mono">
                        <Clock className="h-3 w-3" />
                        {new Date(log.timestamp).toLocaleString('en-IN')}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                    <Activity className="h-6 w-6 text-slate-400" />
                  </div>
                  <p className="text-sm font-medium text-slate-900">No activity yet</p>
                  <p className="text-xs text-slate-500 mt-1 max-w-xs">New businesses and members will appear here.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
