'use client';

import { useState, useTransition } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Send, CheckCircle2, AlertCircle, Download, MoreHorizontal, MessageCircle, FileText, CheckCircle, Smartphone } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { BillingHistoryDialog } from '@/components/dashboard/billing-history-dialog';
import { markAsPaid, markAsUnpaid, verifyPayment, rejectPayment } from '@/app/actions/member-actions';

interface Member {
  id: string;
  name: string;
  phone: string;
  plan_name: string;
  fee_amount: number;
  next_due_date: string;
  status: string;
  payments?: { id: string, status: string, amount: number, paid_at?: string, razorpay_payment_id?: string }[];
}

export function PaymentsClient({ 
  members,
  whatsappTemplate,
  upiId,
  businessName,
  whatsappSessionStatus
}: { 
  members: Member[],
  whatsappTemplate?: string,
  upiId?: string,
  businessName?: string,
  whatsappSessionStatus?: string
}) {
  const [filter, setFilter] = useState('All');
  const [viewHistoryMember, setViewHistoryMember] = useState<Member | null>(null);

  const [verificationMember, setVerificationMember] = useState<(Member & { pendingPayment?: { id: string, status: string, amount: number, paid_at?: string, razorpay_payment_id?: string } }) | null>(null);

  const [isPending, startTransition] = useTransition();
  
  const today = new Date();
  today.setHours(0,0,0,0);

  const getPaymentStatus = (member: Member) => {
    if (member.payments?.some(p => p.status === 'Verification Pending')) {
      return 'Verification Pending';
    }
    if (member.next_due_date) {
      const dueDate = new Date(member.next_due_date);
      if (dueDate < today) {
        return 'Overdue';
      } else {
        return 'Paid';
      }
    }
    return 'Pending';
  };

  const processedPayments = members.map(m => {
    const pendingPayment = m.payments?.find(p => p.status === 'Verification Pending');
    return {
      ...m,
      paymentStatus: getPaymentStatus(m),
      pendingPaymentId: pendingPayment?.id,
      // For paid members, assume they paid on their last cycle start (just a visual representation)
      lastPaidDate: m.next_due_date ? new Date(new Date(m.next_due_date).setMonth(new Date(m.next_due_date).getMonth() - 1)).toISOString() : new Date().toISOString()
    };
  });

  const filteredPayments = processedPayments.filter(p => {
    if (filter === 'All') return true;
    if (filter === 'Paid') return p.paymentStatus === 'Paid';
    if (filter === 'Overdue') return p.paymentStatus === 'Overdue';
    if (filter === 'Pending') return p.paymentStatus === 'Pending';
    return true;
  });

  const totalCollected = processedPayments.filter(p => p.paymentStatus === 'Paid').reduce((sum, p) => sum + p.fee_amount, 0);
  const totalOverdue = processedPayments.filter(p => p.paymentStatus === 'Overdue').reduce((sum, p) => sum + p.fee_amount, 0);
  const overdueCount = processedPayments.filter(p => p.paymentStatus === 'Overdue').length;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Paid': return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Paid</Badge>;
      case 'Verification Pending': return <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100">Verification Pending</Badge>;
      case 'Pending': return <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">Pending</Badge>;
      case 'Overdue': return <Badge className="bg-red-100 text-red-700 hover:bg-red-100">Overdue</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  const handleDownloadReceipt = (member: Member, invoiceDate?: string) => {
    const receiptHtml = `
      <html>
        <head>
          <title>Receipt - ${member.name}</title>
          <style>
            body { font-family: system-ui, -apple-system, sans-serif; padding: 40px; color: #1e293b; max-width: 800px; margin: 0 auto; }
            .header { display: flex; justify-content: space-between; border-bottom: 2px solid #e2e8f0; padding-bottom: 20px; margin-bottom: 30px; }
            .title { font-size: 28px; font-weight: bold; color: #0f172a; margin: 0; }
            .subtitle { color: #64748b; margin-top: 5px; }
            .details { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 40px; }
            .label { font-size: 12px; text-transform: uppercase; color: #64748b; font-weight: 600; letter-spacing: 0.05em; }
            .value { font-size: 16px; font-weight: 500; margin-top: 4px; }
            .table { width: 100%; border-collapse: collapse; margin-bottom: 40px; }
            .table th { text-align: left; padding: 12px; border-bottom: 2px solid #e2e8f0; color: #64748b; font-weight: 600; }
            .table td { padding: 16px 12px; border-bottom: 1px solid #e2e8f0; }
            .total-row { font-weight: bold; font-size: 18px; }
            .footer { text-align: center; color: #94a3b8; font-size: 14px; margin-top: 60px; border-top: 1px solid #e2e8f0; padding-top: 20px; }
            @media print {
              body { padding: 0; margin: 20px; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <h1 class="title">PAYMENT RECEIPT</h1>
              <div class="subtitle">Receipt #${Math.floor(100000 + Math.random() * 900000)}</div>
            </div>
            <div style="text-align: right;">
              <h2 style="margin:0; font-size: 20px; color: #0f172a;">Your Gym Name</h2>
              <div class="subtitle">123 Fitness Street, City</div>
            </div>
          </div>
          
          <div class="details">
            <div>
              <div class="label">Billed To</div>
              <div class="value">${member.name}</div>
              <div class="value" style="color: #64748b; font-size: 14px;">${member.phone}</div>
            </div>
            <div style="text-align: right;">
              <div class="label">Payment Date</div>
              <div class="value">${new Date(invoiceDate || new Date()).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
            </div>
          </div>
          
          <table class="table">
            <thead>
              <tr>
                <th>Description</th>
                <th>Cycle</th>
                <th style="text-align: right;">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Membership Fee (${member.plan_name})</td>
                <td>1 Month</td>
                <td style="text-align: right;">₹${member.fee_amount.toLocaleString('en-IN')}</td>
              </tr>
              <tr class="total-row">
                <td colspan="2" style="text-align: right; padding-top: 24px;">Total Paid:</td>
                <td style="text-align: right; padding-top: 24px; color: #16a34a;">₹${member.fee_amount.toLocaleString('en-IN')}</td>
              </tr>
            </tbody>
          </table>
          
          <div class="footer">
            Thank you for your business! This is a computer generated receipt.
          </div>
        </body>
      </html>
    `;
    
    const printWindow = window.open('', '', 'width=800,height=900');
    if (printWindow) {
      printWindow.document.open();
      printWindow.document.write(receiptHtml);
      printWindow.document.close();
      
      // Wait for resources to load before printing
      setTimeout(() => {
        printWindow.focus();
        printWindow.print();
        printWindow.close();
      }, 250);
    }
  };

  const checkWhatsAppConnection = () => {
    if (whatsappSessionStatus !== 'connected') {
      if (confirm('Your WhatsApp bot is disconnected. Would you like to go to settings to scan the QR code?')) {
        window.location.href = '/settings/whatsapp';
      }
      return false;
    }
    return true;
  };

  const handleSendReceipt = async (member: Member, details?: { method: string, transactionId: string }, silent = false) => {
    if (!checkWhatsAppConnection()) return;
    
    const receiptLink = `${window.location.origin}/receipt/${member.id}`;
    
    let text = `Hi ${member.name},

Thank you for your payment to ${businessName || 'our gym'}!

Your payment for the ${member.plan_name} has been successfully received.`;

    if (details) {
      text += `\n\n*Payment Details:*\nMethod: ${details.method}`;
      if (details.transactionId) {
        text += `\nTransaction ID: ${details.transactionId}`;
      }
    }

    text += `\n\nYou can view and download your official receipt here:
${receiptLink}

Thank you!`;
    
    try {
      const res = await fetch('/api/whatsapp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: member.phone, message: text })
      });
      const data = await res.json();
      if (!silent) {
        if (data.success) {
          alert('Receipt sent successfully!');
        } else {
          alert('Failed to send receipt: ' + data.error);
        }
      }
    } catch(err) {
      if (!silent) alert('Error sending receipt.');
    }
  };

  const getReminderMessage = (member: Member) => {
    let text = whatsappTemplate || `Hi {{name}},

This is a gentle reminder from {{business_name}} that your gym membership fee is due.

*Member Details:*
👤 Name: {{name}}
🏋️ Plan: {{plan_name}}
📅 Due Date: {{due_date}}
💰 Amount Due: ₹{{amount}}

Please click the secure link below to view your invoice and complete your payment via Google Pay, PhonePe, or Paytm:
👉 {{payment_link}}

Thank you!`;
    
    // Generate Smart Payment Link if UPI ID is present
    const paymentLink = upiId 
      ? `${window.location.origin}/pay/${member.id}` 
      : '(Please contact us for payment details)';
      
    text = text.replace(/{{name}}/g, member.name);
    text = text.replace(/{{amount}}/g, member.fee_amount.toString());
    text = text.replace(/{{due_date}}/g, member.next_due_date ? new Date(member.next_due_date).toLocaleDateString('en-IN') : 'N/A');
    text = text.replace(/{{business_name}}/g, businessName || 'our gym');
    text = text.replace(/{{payment_link}}/g, paymentLink);
    text = text.replace(/{{plan_name}}/g, member.plan_name || 'Membership');
    
    return text;
  };

  const handleSendReminder = async (member: Member, e: React.MouseEvent<HTMLButtonElement>) => {
    if (!checkWhatsAppConnection()) return;
    
    const btn = e.currentTarget;
    const originalText = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = '<span class="animate-pulse">Sending...</span>';

    try {
      const res = await fetch('/api/whatsapp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: member.phone, message: getReminderMessage(member) })
      });
      const data = await res.json();
      if (data.success) {
        btn.innerHTML = 'Sent!';
        btn.classList.add('bg-emerald-100', 'text-emerald-700');
      } else {
        btn.innerHTML = 'Failed';
        btn.classList.add('bg-red-100', 'text-red-700');
      }
    } catch(err) {
      btn.innerHTML = 'Error';
    }
    
    setTimeout(() => {
      btn.disabled = false;
      btn.innerHTML = originalText;
      btn.classList.remove('bg-emerald-100', 'text-emerald-700', 'bg-red-100', 'text-red-700');
    }, 3000);
  };

  const handleBulkRemind = async () => {
    if (!checkWhatsAppConnection()) return;

    const membersToRemind = processedPayments.filter(p => p.paymentStatus === 'Overdue' || p.paymentStatus === 'Pending');
    
    if (membersToRemind.length === 0) {
      alert('No pending or overdue payments found!');
      return;
    }
    
    if (!confirm(`Are you sure you want to send automated reminders to ${membersToRemind.length} members?`)) {
      return;
    }

    let successCount = 0;
    
    for (const member of membersToRemind) {
      try {
        const res = await fetch('/api/whatsapp/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phone: member.phone, message: getReminderMessage(member) })
        });
        const data = await res.json();
        if (data.success) {
          successCount++;
        }
        await new Promise(resolve => setTimeout(resolve, 8000));
      } catch (err) {
        console.error('Failed to send to', member.name);
      }
    }
    
    alert(`Sent successfully to ${successCount} out of ${membersToRemind.length} members!`);
  };

  const handleBulkVerify = async () => {
    if (!checkWhatsAppConnection()) return;

    const membersToVerify = processedPayments.filter(p => p.paymentStatus === 'Verification Pending');
    
    if (membersToVerify.length === 0) {
      alert('No pending verifications found!');
      return;
    }
    
    if (!confirm(`Are you sure you want to approve ${membersToVerify.length} pending payments? This will automatically send receipts with an 8-second delay between each to protect your WhatsApp account.`)) {
      return;
    }

    let successCount = 0;
    
    // We cannot use startTransition around an 8-second loop effectively, 
    // it will block other UI updates too much. We will just run it directly.
    for (const member of membersToVerify) {
      if (!member.pendingPaymentId) continue;
      try {
        const res = await verifyPayment(member.id, member.pendingPaymentId);
        if (!res.error) {
          await handleSendReceipt(member, undefined, true); // silent
          successCount++;
        }
        await new Promise(resolve => setTimeout(resolve, 8000));
      } catch (err) {
        console.error('Failed to verify', member.name);
      }
    }
    
    alert(`Verified successfully for ${successCount} out of ${membersToVerify.length} members!`);
  };

  const handleMarkPaidClick = (member: Member) => {
    startTransition(async () => {
      const res = await markAsPaid(member.id);
      if (res.error) {
        alert(res.error);
      } else {
        handleSendReceipt(member);
      }
    });
  };

  const handleVerifyPaymentClick = (member: Member & { pendingPaymentId?: string }) => {
    if (!member.pendingPaymentId) return;
    const pendingPayment = member.payments?.find(p => p.id === member.pendingPaymentId);
    setVerificationMember({ ...member, pendingPayment });
  };

  const handleApprovePayment = () => {
    if (!verificationMember?.pendingPayment) return;
    
    startTransition(async () => {
      const res = await verifyPayment(verificationMember.id, verificationMember.pendingPayment!.id);
      if (res.error) {
        alert(res.error);
      } else {
        handleSendReceipt(verificationMember);
        setVerificationMember(null);
      }
    });
  };

  const handleRejectPayment = () => {
    if (!verificationMember?.pendingPayment) return;
    
    startTransition(async () => {
      const res = await rejectPayment(verificationMember.pendingPayment!.id);
      if (res.error) {
        alert(res.error);
      } else {
        setVerificationMember(null);
        
        try {
          await fetch('/api/whatsapp/send', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              phone: verificationMember.phone, 
              message: `Hello ${verificationMember.name},\n\nYour recent payment could not be verified. Please provide valid proof of the transaction (e.g., a screenshot) for verification.`
            })
          });
        } catch (e) {
          console.error("Failed to send rejection message", e);
        }
      }
    });
  };

  const handleMarkUnpaid = (memberId: string) => {
    startTransition(async () => {
      const res = await markAsUnpaid(memberId);
      if (res.error) alert(res.error);
    });
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-10">
      
      {/* Payments Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Payments & Receivables
          </h1>
          <p className="text-slate-500 font-medium text-sm mt-1">
            Track pending payments and send bulk reminders easily.
          </p>
        </div>
        <div className="flex gap-2 shrink-0 items-center flex-wrap justify-end">
          <Button onClick={handleBulkVerify} className="bg-purple-600 hover:bg-purple-700 text-white font-semibold h-9 px-4 rounded-md shadow-sm">
            <CheckCircle className="mr-2 h-4 w-4" /> Bulk Verify Pending
          </Button>
          <Button onClick={handleBulkRemind} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold h-9 px-4 rounded-md shadow-sm">
            <Send className="mr-2 h-4 w-4" /> Send Bulk Reminders
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Collected (Cycle)</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalCollected.toLocaleString('en-IN')}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Reminders</CardTitle>
            <Send className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalOverdue.toLocaleString('en-IN')}</div>
            <p className="text-xs text-muted-foreground">{overdueCount} members</p>
          </CardContent>
        </Card>
        <Card className="border-red-100 bg-red-50/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-red-800">Overdue Amount</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-700">₹{totalOverdue.toLocaleString('en-IN')}</div>
            <p className="text-xs text-red-600">Action required</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-2">
        {['All', 'Paid', 'Pending', 'Overdue'].map(f => (
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

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead>Member</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPayments.map(p => (
                  <TableRow key={p.id}>
                    <TableCell className="font-medium text-gray-900">{p.name}</TableCell>
                    <TableCell>{p.plan_name}</TableCell>
                    <TableCell>₹{p.fee_amount}</TableCell>
                    <TableCell>{p.next_due_date ? new Date(p.next_due_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : 'N/A'}</TableCell>
                    <TableCell>{getStatusBadge(p.paymentStatus)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        {p.paymentStatus === 'Paid' ? (
                          <>
                            <Button onClick={() => handleSendReceipt(p)} variant="outline" size="sm" className="h-8 text-green-700 border-green-200 bg-green-50 hover:bg-green-100 shadow-sm">
                              <MessageCircle className="h-3.5 w-3.5 mr-1.5" /> Send Receipt
                            </Button>
                            <Button onClick={() => handleDownloadReceipt(p)} variant="outline" size="sm" className="h-8 text-slate-700 bg-white shadow-sm border-slate-200">
                              <Download className="h-3.5 w-3.5 mr-1.5" /> Download
                            </Button>
                          </>
                        ) : p.paymentStatus === 'Verification Pending' ? (
                          <Button 
                            disabled={isPending}
                            onClick={() => handleVerifyPaymentClick(p)} 
                            variant="outline" 
                            size="sm" 
                            className="h-8 text-purple-700 border-purple-200 bg-purple-50 hover:bg-purple-100 shadow-sm"
                          >
                            <CheckCircle className="h-3.5 w-3.5 mr-1.5" /> Verify
                          </Button>
                        ) : (
                          <button 
                            onClick={(e) => handleSendReminder(p, e)}
                            className="inline-flex items-center justify-center rounded-md text-xs font-medium transition-colors border shadow-sm h-8 px-3 text-green-700 border-green-200 bg-green-50 hover:bg-green-100"
                          >
                            <MessageCircle className="h-3.5 w-3.5 mr-1.5" />
                            Remind
                          </button>
                        )}
                        
                        <DropdownMenu>
                          <DropdownMenuTrigger render={
                            <Button variant="ghost" className="h-8 w-8 p-0" />
                          }>
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4 text-slate-600" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuGroup>
                              <DropdownMenuLabel>Payment Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              {p.paymentStatus === 'Paid' ? (
                                <>
                                  <DropdownMenuItem className="cursor-pointer" onClick={() => handleDownloadReceipt(p)}>
                                    <FileText className="mr-2 h-4 w-4 text-slate-600" /> Download Receipt
                                  </DropdownMenuItem>
                                  <DropdownMenuItem disabled={isPending} className="cursor-pointer text-orange-600 focus:text-orange-600" onClick={() => handleMarkUnpaid(p.id)}>
                                    <AlertCircle className="mr-2 h-4 w-4" /> Revert to Unpaid
                                  </DropdownMenuItem>
                                </>
                              ) : p.paymentStatus === 'Verification Pending' ? (
                                <>
                                  <DropdownMenuItem disabled={isPending} className="cursor-pointer text-purple-600 focus:text-purple-600" onClick={() => handleVerifyPaymentClick(p)}>
                                    <CheckCircle className="mr-2 h-4 w-4" /> Verify Payment
                                  </DropdownMenuItem>
                                  <DropdownMenuItem disabled={isPending} className="cursor-pointer text-green-600 focus:text-green-600" onClick={() => handleMarkPaidClick(p)}>
                                    <CheckCircle className="mr-2 h-4 w-4" /> Mark as Paid
                                  </DropdownMenuItem>
                                  <DropdownMenuItem className="cursor-pointer" onClick={() => window.open(`${window.location.origin}/pay/${p.id}`, '_blank')}>
                                    <Smartphone className="mr-2 h-4 w-4" /> View Payment Page
                                  </DropdownMenuItem>
                                </>
                              ) : (
                                <>
                                  <DropdownMenuItem disabled={isPending} className="cursor-pointer text-green-600 focus:text-green-600" onClick={() => handleMarkPaidClick(p)}>
                                    <CheckCircle className="mr-2 h-4 w-4" /> Mark as Paid
                                  </DropdownMenuItem>
                                  <DropdownMenuItem className="cursor-pointer" onClick={() => window.open(`${window.location.origin}/pay/${p.id}`, '_blank')}>
                                    <Smartphone className="mr-2 h-4 w-4" /> View Payment Page
                                  </DropdownMenuItem>
                                </>
                              )}
                              <DropdownMenuItem className="cursor-pointer" onClick={() => setViewHistoryMember(p)}>
                                <AlertCircle className="mr-2 h-4 w-4 text-slate-600" /> View Details
                              </DropdownMenuItem>
                            </DropdownMenuGroup>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredPayments.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                      No members found matching the current filter.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <BillingHistoryDialog 
        member={viewHistoryMember}
        open={!!viewHistoryMember}
        onOpenChange={(open) => !open && setViewHistoryMember(null)}
        onDownloadReceipt={handleDownloadReceipt}
      />

      {/* Verification Modal */}
      <Dialog open={!!verificationMember} onOpenChange={(open) => !open && setVerificationMember(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Verify Payment</DialogTitle>
            <DialogDescription>
              Review the payment details for {verificationMember?.name}.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-slate-500">Amount</Label>
                <div className="font-semibold text-lg text-slate-900">₹{verificationMember?.fee_amount}</div>
              </div>
              <div>
                <Label className="text-slate-500">Date & Time</Label>
                <div className="font-medium text-slate-900">
                  {verificationMember?.pendingPayment?.paid_at ? new Date(verificationMember.pendingPayment.paid_at).toLocaleString('en-IN') : 'N/A'}
                </div>
              </div>
            </div>
            
            <div>
              <Label className="text-slate-500">Transaction ID (UPI Ref)</Label>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 font-mono text-sm mt-1">
                {verificationMember?.pendingPayment?.razorpay_payment_id || 'Not provided'}
              </div>
            </div>
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2 mt-2">
            <Button 
              type="button" 
              variant="outline" 
              className="text-red-600 border-red-200 bg-red-50 hover:bg-red-100"
              onClick={handleRejectPayment}
              disabled={isPending}
            >
              Reject (Fake)
            </Button>
            <Button 
              type="button" 
              className="bg-purple-600 hover:bg-purple-700 text-white"
              onClick={handleApprovePayment}
              disabled={isPending}
            >
              Approve Payment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}
