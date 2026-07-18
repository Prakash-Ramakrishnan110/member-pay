'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search } from 'lucide-react';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function CustomersClient({ businesses, allMembers }: { businesses: any[], allMembers: any[] }) {
  const [searchQuery, setSearchQuery] = useState('');

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
      else if (cycle.includes('week')) mrrMultiplier = 4;
      mrr += (fee * mrrMultiplier);
    });

    return {
      ...gym,
      totalMembers: gymMembers.length,
      activeMembers: gymActiveMembers.length,
      mrr: Math.round(mrr)
    };
  });

  const filteredGyms = gymsWithStats.filter(gym => 
    (gym.name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
    (gym.city?.toLowerCase() || '').includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <Card className="border-none shadow-sm ring-1 ring-slate-200">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 bg-white pb-4 gap-4">
          <div>
            <CardTitle className="text-lg">Customers</CardTitle>
            <CardDescription>All businesses registered on your platform.</CardDescription>
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
            <Input
              type="text"
              placeholder="Search by name or city..."
              className="pl-9 bg-slate-50 border-slate-200"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4 font-medium">Business Name</th>
                  <th className="px-6 py-4 font-medium">Location</th>
                  <th className="px-6 py-4 font-medium">Members</th>
                  <th className="px-6 py-4 font-medium">Volume (MRR)</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {filteredGyms.length > 0 ? (
                  filteredGyms.map((gym) => (
                    <tr key={gym.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium text-slate-900">{gym.name || 'Unnamed Business'}</div>
                        <div className="text-slate-500 text-xs font-mono mt-0.5" title="Business ID (Owner)">{gym.id.substring(0,8)}...</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-slate-900">{gym.city || 'Not specified'}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-slate-900 font-medium">{gym.activeMembers} <span className="text-slate-500 font-normal">active</span></div>
                        <div className="text-slate-500 text-xs">{gym.totalMembers} total</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-slate-900 font-medium">₹{gym.mrr.toLocaleString('en-IN')}</div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge className="bg-green-100 text-green-700 hover:bg-green-100 shadow-none border-none">Active</Badge>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link href={`/admin/customers/${gym.id}`}>
                          <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                            View Detail
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                      No customers found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
