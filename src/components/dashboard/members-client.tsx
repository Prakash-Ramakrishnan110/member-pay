'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Users, MessageCircle, MoreHorizontal, Search, Edit2, Trash2, Eye } from 'lucide-react';
import { AddMemberDialog } from '@/components/dashboard/add-member-dialog';
import { ViewMemberDialog } from '@/components/dashboard/view-member-dialog';
import { EditMemberDialog } from '@/components/dashboard/edit-member-dialog';
import { DeleteMemberDialog } from '@/components/dashboard/delete-member-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from '@/components/ui/dropdown-menu';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function MembersClient({ initialMembers, plans = [], settings = {} }: { initialMembers: any[], plans?: any[], settings?: any }) {
  const [searchQuery, setSearchQuery] = useState('');
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [actionState, setActionState] = useState<{type: 'view' | 'edit' | 'delete', member: any} | null>(null);
  
  const today = new Date();
  today.setHours(0,0,0,0);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getStatus = (member: any) => {
    // If the new DB fields exist, use them
    if (member.subscription_status === 'Trial') return 'Trial';
    
    const endDateStr = member.plan_end_date || member.next_due_date;
    if (endDateStr) {
      const dueDate = new Date(endDateStr);
      if (dueDate < today) {
        return 'Expired';
      }
    }
    
    // Check old unpaid logic just in case
    if (member.next_due_date) {
      const dueDate = new Date(member.next_due_date);
      if (dueDate < today) {
        return 'Expired';
      }
    }
    
    return member.status || 'Active';
  };

  const handleBulkRemind = async () => {
    if (settings?.whatsapp_session_status !== 'connected') {
      if (confirm('Your WhatsApp bot is disconnected. Would you like to go to settings to scan the QR code?')) {
        window.location.href = '/settings/whatsapp';
      }
      return;
    }

    const membersToRemind = filteredMembers.filter(m => getStatus(m) === 'Expired');

    if (membersToRemind.length === 0) {
      alert('No expired members found in the current list.');
      return;
    }

    if (!confirm(`Are you sure you want to send automated reminders to ${membersToRemind.length} expired members?`)) {
      return;
    }

    let successCount = 0;
    
    // Using a simple notification in UI would be better, but let's stick to alert for simplicity for now
    for (const member of membersToRemind) {
      const template = settings?.whatsapp_template || `Hi {{name}},\nThis is a gentle reminder that your fee is due.`;
      const message = template
        .replace(/{{name}}/g, member.name || '')
        .replace(/{{amount}}/g, member.fee_amount || 0)
        .replace(/{{due_date}}/g, member.next_due_date ? new Date(member.next_due_date).toLocaleDateString() : 'soon')
        .replace(/{{business_name}}/g, settings?.business_name || 'Our Gym')
        .replace(/{{payment_link}}/g, `https://memberpay.vercel.app/pay/${member.id}`)
        .replace(/{{plan_name}}/g, member.plan_name || 'Membership');

      try {
        const res = await fetch('/api/whatsapp/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phone: member.phone, message })
        });
        const data = await res.json();
        if (data.success) {
          successCount++;
        }
        // Small delay between sends
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (err) {
        console.error('Failed to send to', member.name);
      }
    }
    
    alert(`Sent successfully to ${successCount} out of ${membersToRemind.length} members!`);
  };

  const filteredMembers = initialMembers.filter(member => 
    member.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    member.phone.includes(searchQuery)
  );

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-10">
      
      {/* Members Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Members Directory
          </h1>
          <p className="text-slate-500 font-medium text-sm mt-1">
            Manage your members, track payments, and send WhatsApp reminders.
          </p>
        </div>
        <div className="flex gap-2 shrink-0 items-center">
          <Button onClick={handleBulkRemind} variant="outline" className="h-9 px-4 rounded-md shadow-sm border-emerald-200 text-emerald-700 hover:bg-emerald-50">
            <MessageCircle className="h-4 w-4 mr-2" /> Bulk Auto Send
          </Button>
          <div className="[&>button]:bg-blue-600 [&>button]:hover:bg-blue-700 [&>button]:text-white [&>button]:font-semibold [&>button]:h-9 [&>button]:px-4 [&>button]:rounded-md [&>button]:shadow-sm">
            <AddMemberDialog plans={plans} />
          </div>
        </div>
      </div>

      <Card className="border-none shadow-sm ring-1 ring-slate-200">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 bg-white pb-4 gap-4">
          <div>
            <CardTitle className="text-lg">All Members</CardTitle>
            <CardDescription>A complete list of your members.</CardDescription>
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
            <Input
              type="text"
              placeholder="Search by name or phone..."
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
                  <th className="px-6 py-4 font-medium">Name</th>
                  <th className="px-6 py-4 font-medium">Plan Details</th>
                  <th className="px-6 py-4 font-medium">Schedule</th>
                  <th className="px-6 py-4 font-medium">Due Date</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {filteredMembers && filteredMembers.length > 0 ? (
                  filteredMembers.map((member) => {
                    const status = getStatus(member);
                    const isExpired = status === 'Expired';
                    const isTrial = status === 'Trial';
                    
                    return (
                    <tr key={member.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium text-slate-900">{member.name}</div>
                        <div className="text-slate-500 text-xs">{member.phone}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-slate-900">{member.plan_name}</div>
                        <div className="text-slate-500 text-xs font-medium">₹{member.fee_amount} / {member.billing_cycle}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-slate-600 text-sm">{member.batch_timing || 'Any Time'}</div>
                        <div className="text-slate-500 text-xs">{member.working_days || 'All Days'}</div>
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        {member.plan_end_date ? new Date(member.plan_end_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : (member.next_due_date ? new Date(member.next_due_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A')}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ring-1 ring-inset ${
                          isExpired 
                            ? 'bg-red-50 text-red-700 ring-red-600/20' 
                            : isTrial
                              ? 'bg-amber-50 text-amber-700 ring-amber-600/20'
                              : 'bg-green-50 text-green-700 ring-green-600/20'
                        }`}>
                          {status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">

                          <button 
                            onClick={async (e) => {
                              if (settings?.whatsapp_session_status !== 'connected') {
                                if (confirm('Your WhatsApp bot is disconnected. Would you like to go to settings to scan the QR code?')) {
                                  window.location.href = '/settings/whatsapp';
                                }
                                return;
                              }

                              const btn = e.currentTarget;
                              btn.disabled = true;
                              btn.innerHTML = '<span class="animate-pulse">Sending...</span>';
                              
                              const template = settings?.whatsapp_template || `Hi {{name}},\nThis is a gentle reminder that your fee is due.`;
                              const message = template
                                .replace(/{{name}}/g, member.name || '')
                                .replace(/{{amount}}/g, member.fee_amount || 0)
                                .replace(/{{due_date}}/g, member.next_due_date ? new Date(member.next_due_date).toLocaleDateString() : 'soon')
                                .replace(/{{business_name}}/g, settings?.business_name || 'Our Gym')
                                .replace(/{{payment_link}}/g, `https://memberpay.vercel.app/pay/${member.id}`)
                                .replace(/{{plan_name}}/g, member.plan_name || 'Membership');

                              try {
                                const res = await fetch('/api/whatsapp/send', {
                                  method: 'POST',
                                  headers: { 'Content-Type': 'application/json' },
                                  body: JSON.stringify({ phone: member.phone, message })
                                });
                                const data = await res.json();
                                if (data.success) {
                                  btn.innerHTML = 'Sent!';
                                  btn.classList.add('bg-emerald-100', 'text-emerald-700');
                                } else {
                                  if (data.error === 'Session not connected for this business') {
                                    if (confirm('Your WhatsApp session expired. Would you like to reconnect?')) {
                                      window.location.href = '/settings/whatsapp';
                                    }
                                  }
                                  btn.innerHTML = 'Failed';
                                  btn.classList.add('bg-red-100', 'text-red-700');
                                }
                              } catch(err) {
                                btn.innerHTML = 'Error';
                              }
                              setTimeout(() => {
                                btn.disabled = false;
                                btn.innerHTML = 'Auto Send';
                                btn.className = "inline-flex items-center justify-center rounded-md text-xs font-medium transition-colors border shadow-sm h-7 px-2 text-emerald-700 border-emerald-200 bg-emerald-50 hover:bg-emerald-100";
                              }, 3000);
                            }}
                            className="inline-flex items-center justify-center rounded-md text-xs font-medium transition-colors border shadow-sm h-7 px-2 text-emerald-700 border-emerald-200 bg-emerald-50 hover:bg-emerald-100"
                            title="Send automatically via Bot"
                          >
                            Auto Send
                          </button>
                          
                          <DropdownMenu>
                            <DropdownMenuTrigger render={
                              <Button variant="ghost" className="h-8 w-8 p-0" />
                            }>
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4 text-slate-600" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                              <DropdownMenuGroup>
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="cursor-pointer" onClick={() => setActionState({ type: 'view', member })}>
                                  <Eye className="mr-2 h-4 w-4" /> View Profile
                                </DropdownMenuItem>
                                <DropdownMenuItem className="cursor-pointer" onClick={() => setActionState({ type: 'edit', member })}>
                                  <Edit2 className="mr-2 h-4 w-4" /> Edit Details
                                </DropdownMenuItem>
                              </DropdownMenuGroup>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600 focus:text-red-600 cursor-pointer" onClick={() => setActionState({ type: 'delete', member })}>
                                <Trash2 className="mr-2 h-4 w-4" /> Delete Member
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </td>
                    </tr>
                  )})
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <Users className="h-10 w-10 text-slate-300 mb-3" />
                        <p className="text-slate-500 font-medium">No members found</p>
                        <p className="text-slate-400 text-xs mt-1">
                          {searchQuery ? 'Try adjusting your search filter.' : 'Get started by adding your first member.'}
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <ViewMemberDialog 
        member={actionState?.type === 'view' ? actionState.member : null}
        open={actionState?.type === 'view'}
        onOpenChange={(open) => !open && setActionState(null)}
      />

      <EditMemberDialog 
        member={actionState?.type === 'edit' ? actionState.member : null}
        open={actionState?.type === 'edit'}
        onOpenChange={(open) => !open && setActionState(null)}
      />

      <DeleteMemberDialog 
        member={actionState?.type === 'delete' ? actionState.member : null}
        open={actionState?.type === 'delete'}
        onOpenChange={(open) => !open && setActionState(null)}
      />
    </div>
  );
}
