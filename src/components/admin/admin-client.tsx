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

  // Calculate signups over the last 7 days
  const last7Days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().split('T')[0]; // YYYY-MM-DD
  });

  const signupsData = last7Days.map(dateStr => {
    // Count members joined on this day
    const membersJoined = allMembers.filter(m => m.created_at?.startsWith(dateStr)).length;
    // Count businesses joined on this day
    const businessesJoined = businesses.filter(b => b.created_at?.startsWith(dateStr)).length;
    
    return {
      date: dateStr,
      label: new Date(dateStr).toLocaleDateString('en-US', { weekday: 'short' }),
      members: membersJoined,
      businesses: businessesJoined,
    };
  });
  
  const maxSignups = Math.max(1, ...signupsData.map(d => d.members + d.businesses));

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
            <div className="divide-y divide-slate-100 max-h-[400px] overflow-y-auto">
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

        {/* Growth Chart */}
        <Card className="border-none shadow-sm ring-1 ring-slate-200">
          <CardHeader>
            <CardTitle className="text-lg">Platform Growth</CardTitle>
            <CardDescription>New members & businesses over last 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[280px] flex items-end gap-2 sm:gap-4 mt-4 px-2">
              {signupsData.map((data, i) => {
                const memberHeight = (data.members / maxSignups) * 100;
                const bizHeight = (data.businesses / maxSignups) * 100;
                
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                    <div className="w-full relative flex flex-col justify-end h-full bg-slate-50/50 rounded-t-md overflow-hidden ring-1 ring-slate-100">
                      {/* Tooltip */}
                      <div className="absolute inset-0 z-10 flex flex-col justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900/10 backdrop-blur-[1px] p-1 text-center cursor-pointer">
                        {data.businesses > 0 && <span className="text-[10px] font-bold text-slate-800 bg-white/90 px-1.5 py-0.5 rounded shadow-sm mb-1">Biz: {data.businesses}</span>}
                        {data.members > 0 && <span className="text-[10px] font-bold text-slate-800 bg-white/90 px-1.5 py-0.5 rounded shadow-sm">Users: {data.members}</span>}
                      </div>
                      
                      <div 
                        className="w-full bg-emerald-400 transition-all duration-700 ease-out" 
                        style={{ height: `${bizHeight}%` }}
                      ></div>
                      <div 
                        className="w-full bg-blue-500 transition-all duration-700 ease-out" 
                        style={{ height: `${memberHeight}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-slate-500 font-medium">{data.label}</span>
                  </div>
                )
              })}
            </div>
            
            <div className="flex items-center justify-center gap-6 mt-8 border-t border-slate-100 pt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500 shadow-sm"></div>
                <span className="text-xs text-slate-600 font-medium">New Members</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-400 shadow-sm"></div>
                <span className="text-xs text-slate-600 font-medium">New Businesses</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
