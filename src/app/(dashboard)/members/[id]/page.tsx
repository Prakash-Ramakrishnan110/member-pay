'use client';

import { use, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Send, CheckCircle2, PauseCircle, Trash2, Download, CreditCard } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const mockMemberData = {
  id: '1',
  name: 'Rahul Sharma',
  phone: '9876543210',
  plan: 'Gold Plan',
  fee: 1200,
  cycle: 'Monthly',
  startDate: '2026-06-20',
  nextDue: '2026-07-20',
  status: 'Active',
  notes: 'Prefers evening batch',
  payments: [
    { id: 'p1', date: '2026-06-20', amount: 1200, method: 'Payment Link', status: 'Paid' },
    { id: 'p2', date: '2026-05-20', amount: 1200, method: 'Cash (Manual)', status: 'Paid' },
  ],
  reminders: [
    { id: 'r1', date: '2026-06-17', channel: 'WhatsApp', type: 'T-3 Days', status: 'Sent' },
    { id: 'r2', date: '2026-05-21', channel: 'SMS', type: 'Overdue', status: 'Sent' },
  ]
};

export default function MemberDetailPage({ params }: { params: Promise<{ id: string }> }) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id } = use(params);
  const [member] = useState(mockMemberData);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Active': return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Active</Badge>;
      case 'Expiring Soon': return <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">Expiring</Badge>;
      case 'Overdue': return <Badge className="bg-red-100 text-red-700 hover:bg-red-100">Overdue</Badge>;
      case 'Paused': return <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-100">Paused</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  const getPaymentStatusBadge = (status: string) => {
    if (status === 'Paid') return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Paid</Badge>;
    if (status === 'Failed') return <Badge className="bg-red-100 text-red-700 hover:bg-red-100">Failed</Badge>;
    return <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">Pending</Badge>;
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="flex h-10 w-10 items-center justify-center rounded-md hover:bg-gray-100">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              {member.name} {getStatusBadge(member.status)}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              +91 {member.phone} • {member.plan} (₹{member.fee}/{member.cycle.toLowerCase()})
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">Edit Member</Button>
          <Button variant="outline" className="text-red-600 hover:bg-red-50 hover:text-red-700">Delete</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Details & Quick Actions */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full justify-start bg-blue-600 hover:bg-blue-700 text-white">
                <Send className="mr-2 h-4 w-4" /> Send Payment Link Now
              </Button>
              <Button variant="outline" className="w-full justify-start text-green-700 hover:bg-green-50 border-green-200">
                <CheckCircle2 className="mr-2 h-4 w-4 text-green-600" /> Mark as Paid (Cash)
              </Button>
              <Button variant="outline" className="w-full justify-start text-gray-600">
                <PauseCircle className="mr-2 h-4 w-4" /> Pause Membership
              </Button>
              <Button variant="ghost" className="w-full justify-start text-red-600 hover:bg-red-50 hover:text-red-700">
                <Trash2 className="mr-2 h-4 w-4" /> Cancel Membership
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Membership Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Next Due Date</span>
                <span className="font-medium">{new Date(member.nextDue).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Start Date</span>
                <span className="font-medium">{new Date(member.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Billing Cycle</span>
                <span className="font-medium">{member.cycle}</span>
              </div>
              <div className="pt-2 border-t">
                <span className="text-gray-500 block mb-1">Notes</span>
                <span className="text-gray-900">{member.notes || 'No notes added.'}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - History */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-gray-500" />
                Payment History
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50 text-xs">
                    <TableHead>Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Receipt</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {member.payments.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell className="font-medium">
                        {new Date(p.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </TableCell>
                      <TableCell>₹{p.amount}</TableCell>
                      <TableCell className="text-gray-500">{p.method}</TableCell>
                      <TableCell>{getPaymentStatusBadge(p.status)}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600" title="Download Receipt">
                          <Download className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Reminder Log</CardTitle>
              <CardDescription>Recent automated and manual reminders sent to this member.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50 text-xs">
                    <TableHead>Date Sent</TableHead>
                    <TableHead>Channel</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Delivery Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {member.reminders.map((r) => (
                    <TableRow key={r.id}>
                      <TableCell>
                        {new Date(r.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </TableCell>
                      <TableCell>{r.channel}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-white">{r.type}</Badge>
                      </TableCell>
                      <TableCell>
                        <span className="flex items-center gap-1 text-sm text-green-600">
                          <CheckCircle2 className="h-3 w-3" /> {r.status}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
