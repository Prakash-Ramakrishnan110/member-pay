'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CreditCard, Download, ExternalLink, CalendarClock } from 'lucide-react';

const mockMemberProfile = {
  name: 'Anjali Sharma',
  phone: '9876543210',
  plan: 'Gold Plan',
  fee: 1500,
  cycle: 'Monthly',
  status: 'Expiring Soon',
  nextDue: '2026-07-16',
  history: [
    { id: 'tx_1', date: '2026-06-16', amount: 1500, method: 'UPI (Razorpay)', status: 'Paid' },
    { id: 'tx_2', date: '2026-05-16', amount: 1500, method: 'UPI (Razorpay)', status: 'Paid' },
  ]
};

export default function MemberPortalDashboard() {
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = async () => {
    setIsProcessing(true);
    // Simulate generating Razorpay link and redirecting
    setTimeout(() => {
      setIsProcessing(false);
      alert('Redirecting to secure Razorpay checkout...');
    }, 1500);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Active': return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Active</Badge>;
      case 'Expiring Soon': return <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">Expiring Soon</Badge>;
      case 'Overdue': return <Badge className="bg-red-100 text-red-700 hover:bg-red-100">Overdue</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  const isDue = mockMemberProfile.status === 'Expiring Soon' || mockMemberProfile.status === 'Overdue';

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Welcome back, {mockMemberProfile.name.split(' ')[0]}!</h1>
        <p className="text-gray-500">View your membership details and payment history.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Current Plan Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              Current Plan
              {getStatusBadge(mockMemberProfile.status)}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="text-lg font-medium">{mockMemberProfile.plan}</div>
              <div className="text-gray-500 text-sm">₹{mockMemberProfile.fee} / {mockMemberProfile.cycle}</div>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-100">
              <CalendarClock className="h-4 w-4 text-gray-400" />
              <span>Next due: <strong>{new Date(mockMemberProfile.nextDue).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</strong></span>
            </div>
          </CardContent>
          <CardFooter className="bg-gray-50 border-t rounded-b-xl py-4">
            {isDue ? (
              <Button 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white" 
                onClick={handlePayment}
                disabled={isProcessing}
              >
                <CreditCard className="mr-2 h-4 w-4" />
                {isProcessing ? 'Processing...' : `Pay ₹${mockMemberProfile.fee} Now`}
              </Button>
            ) : (
              <div className="text-sm text-green-700 font-medium flex items-center justify-center w-full">
                Your payments are up to date.
              </div>
            )}
          </CardFooter>
        </Card>

        {/* Payment History */}
        <Card>
          <CardHeader>
            <CardTitle>Payment History</CardTitle>
            <CardDescription>Your recent transactions</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 text-xs">
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead className="text-right">Receipt</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockMemberProfile.history.map((tx) => (
                  <TableRow key={tx.id}>
                    <TableCell>
                      {new Date(tx.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </TableCell>
                    <TableCell>₹{tx.amount}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" className="text-blue-600 h-8 gap-1">
                        <Download className="h-3 w-3" /> PDF
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter className="pt-4 border-t">
            <Button variant="outline" className="w-full text-gray-600">
              <ExternalLink className="mr-2 h-4 w-4" /> View All History
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
