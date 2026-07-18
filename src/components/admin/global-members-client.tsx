'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search } from 'lucide-react';
import { useState } from 'react';
import { Input } from '@/components/ui/input';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function GlobalMembersClient({ allMembers }: { allMembers: any[] }) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredMembers = allMembers.filter(member => 
    (member.name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
    (member.phone?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
    (member.businesses?.name?.toLowerCase() || '').includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <Card className="border-none shadow-sm ring-1 ring-slate-200">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 bg-white pb-4 gap-4">
          <div>
            <CardTitle className="text-lg">Global Members Directory</CardTitle>
            <CardDescription>Search across all {allMembers.length} end-users on the platform.</CardDescription>
          </div>
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
            <Input
              type="text"
              placeholder="Search by name, phone, or business..."
              className="pl-9 bg-slate-50 border-slate-200"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto max-h-[70vh]">
            <table className="w-full text-sm text-left relative">
              <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-100 sticky top-0 z-10">
                <tr>
                  <th className="px-6 py-4 font-medium">Member Details</th>
                  <th className="px-6 py-4 font-medium">Phone</th>
                  <th className="px-6 py-4 font-medium">Business / Workspace</th>
                  <th className="px-6 py-4 font-medium">Plan & Fee</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {filteredMembers.length > 0 ? (
                  filteredMembers.map((member) => (
                    <tr key={member.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium text-slate-900">{member.name}</div>
                        <div className="text-slate-500 text-xs mt-0.5">Joined {new Date(member.created_at).toLocaleDateString('en-IN')}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-slate-900">{member.phone}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-blue-600 font-medium">{member.businesses?.name || 'Unknown Business'}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-slate-900 font-medium">₹{member.fee_amount} / {member.billing_cycle || 'month'}</div>
                        <div className="text-slate-500 text-xs">Due: {member.due_date ? new Date(member.due_date).toLocaleDateString('en-IN') : 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4">
                        {member.status === 'Active' ? (
                          <Badge className="bg-green-100 text-green-700 hover:bg-green-100 shadow-none border-none">Active</Badge>
                        ) : member.status === 'Past Due' ? (
                          <Badge className="bg-red-100 text-red-700 hover:bg-red-100 shadow-none border-none">Past Due</Badge>
                        ) : (
                          <Badge variant="outline" className="text-slate-600">{member.status}</Badge>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                      No members found matching your search.
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
