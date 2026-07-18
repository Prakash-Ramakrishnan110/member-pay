'use client';

import { useState, useMemo } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Download, CheckCircle, FileText } from 'lucide-react';

interface Member {
  id: string;
  name: string;
  phone: string;
  plan_name: string;
  fee_amount: number;
  next_due_date: string;
  start_date?: string;
  billing_cycle?: string;
  status: string;
}

interface Invoice {
  id: string;
  date: string;
  amount: number;
  status: 'Paid' | 'Pending' | 'Overdue';
}

export function BillingHistoryDialog({ 
  member, 
  open, 
  onOpenChange,
  onDownloadReceipt
}: { 
  member: Member | null; 
  open: boolean; 
  onOpenChange: (open: boolean) => void;
  onDownloadReceipt: (member: Member, invoiceDate: string) => void;
}) {
  const [filter, setFilter] = useState<'All' | 'Paid' | 'Unpaid'>('All');

  const invoices = useMemo(() => {
    if (!member) return [];
    
    // If no start date, just return the current due payment as the only invoice
    if (!member.start_date || !member.next_due_date) {
      const today = new Date();
      today.setHours(0,0,0,0);
      let status: 'Pending' | 'Overdue' = 'Pending';
      if (member.next_due_date && new Date(member.next_due_date) < today) {
        status = 'Overdue';
      }
      return [{
        id: `INV-${member.id.substring(0,4).toUpperCase()}-001`,
        date: member.next_due_date || new Date().toISOString(),
        amount: member.fee_amount,
        status: status as 'Paid' | 'Pending' | 'Overdue'
      }];
    }

    const generatedInvoices: Invoice[] = [];
    let currentCycleStart = new Date(member.start_date);
    const nextDueDate = new Date(member.next_due_date);
    const today = new Date();
    today.setHours(0,0,0,0);
    
    let invoiceCount = 1;

    // Generate cycles from start date up to and including the next due date
    while (currentCycleStart <= nextDueDate) {
      const nextCycleStart = new Date(currentCycleStart);
      if (member.billing_cycle === 'Monthly') {
        nextCycleStart.setMonth(nextCycleStart.getMonth() + 1);
      } else if (member.billing_cycle === 'Quarterly') {
        nextCycleStart.setMonth(nextCycleStart.getMonth() + 3);
      } else if (member.billing_cycle === 'Yearly') {
        nextCycleStart.setFullYear(nextCycleStart.getFullYear() + 1);
      } else {
        nextCycleStart.setMonth(nextCycleStart.getMonth() + 1); // fallback to monthly
      }

      let status: 'Paid' | 'Pending' | 'Overdue' = 'Paid';
      
      // If this cycle is the same as the next due date, it's not paid yet.
      // We check getTime to handle exact day matches.
      if (currentCycleStart.getTime() === nextDueDate.getTime()) {
        if (nextDueDate < today) {
          status = 'Overdue';
        } else {
          status = 'Pending';
        }
      }

      generatedInvoices.push({
        id: `INV-${member.id.substring(0,4).toUpperCase()}-${String(invoiceCount).padStart(3, '0')}`,
        date: currentCycleStart.toISOString(),
        amount: member.fee_amount,
        status: status
      });
      
      // Safety break to prevent infinite loops if data is weird
      if (invoiceCount > 120) break; 
      
      currentCycleStart = nextCycleStart;
      invoiceCount++;
    }
    
    return generatedInvoices.reverse(); // Newest first
  }, [member]);

  const filteredInvoices = invoices.filter(inv => {
    if (filter === 'All') return true;
    if (filter === 'Paid') return inv.status === 'Paid';
    if (filter === 'Unpaid') return inv.status === 'Pending' || inv.status === 'Overdue';
    return true;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Paid': return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Paid</Badge>;
      case 'Pending': return <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">Pending</Badge>;
      case 'Overdue': return <Badge className="bg-red-100 text-red-700 hover:bg-red-100">Overdue</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  if (!member) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Billing History</DialogTitle>
          <DialogDescription>
            View all past and upcoming bills for {member.name}.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              {(['All', 'Paid', 'Unpaid'] as const).map(f => (
                <Button
                  key={f}
                  variant={filter === f ? 'default' : 'outline'}
                  className={filter === f ? 'bg-gray-900' : 'bg-white text-gray-600'}
                  onClick={() => setFilter(f)}
                  size="sm"
                >
                  {f}
                </Button>
              ))}
            </div>
            <div className="text-sm text-slate-500 font-medium">
              Plan: {member.plan_name} ({member.billing_cycle})
            </div>
          </div>

          <div className="border rounded-md max-h-[400px] overflow-y-auto">
            <Table>
              <TableHeader className="bg-slate-50 sticky top-0 shadow-sm z-10">
                <TableRow>
                  <TableHead>Invoice #</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Receipt</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInvoices.length > 0 ? (
                  filteredInvoices.map((inv) => (
                    <TableRow key={inv.id}>
                      <TableCell className="font-medium text-slate-700">{inv.id}</TableCell>
                      <TableCell>{new Date(inv.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</TableCell>
                      <TableCell>₹{inv.amount.toLocaleString('en-IN')}</TableCell>
                      <TableCell>{getStatusBadge(inv.status)}</TableCell>
                      <TableCell className="text-right">
                        {inv.status === 'Paid' ? (
                          <Button 
                            onClick={() => onDownloadReceipt(member, inv.date)} 
                            variant="outline" 
                            size="sm" 
                            className="h-8 text-slate-700 bg-white shadow-sm border-slate-200"
                          >
                            <Download className="h-3.5 w-3.5 mr-1.5" /> Download
                          </Button>
                        ) : (
                          <span className="text-xs text-slate-400 italic">Not available</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="h-32 text-center">
                      <div className="flex flex-col items-center justify-center text-slate-500">
                        <FileText className="h-8 w-8 mb-2 opacity-20" />
                        <p>No invoices found for this filter.</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
