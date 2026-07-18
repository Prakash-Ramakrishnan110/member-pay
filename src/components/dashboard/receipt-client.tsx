'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, CheckCircle2 } from 'lucide-react';
import { useRef, useState, useEffect } from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function ReceiptClient({ member, settings }: { member: any, settings: any }) {
  const receiptRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const businessName = settings?.business_name || 'Gym Name';
  const city = settings?.city || 'City';
  
  // Calculate the "last paid date" (rough estimate based on due date)
  const paidDate = member.next_due_date 
    ? new Date(new Date(member.next_due_date).setMonth(new Date(member.next_due_date).getMonth() - 1))
    : new Date();

  const handlePrint = () => {
    window.print();
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-4">
        {/* Actions Bar (Hidden on print) */}
        <div className="print:hidden flex justify-end">
          <Button onClick={handlePrint} className="bg-slate-900 hover:bg-slate-800 shadow-sm">
            <Download className="mr-2 h-4 w-4" /> Download PDF
          </Button>
        </div>

        {/* Receipt Paper */}
        <Card className="border-none shadow-lg overflow-hidden rounded-xl print:shadow-none print:rounded-none">
          {/* Green success banner */}
          <div className="bg-green-600 p-8 text-center print:bg-green-600 print:text-white text-white">
            <div className="flex justify-center mb-4">
              <CheckCircle2 className="h-16 w-16 text-white" />
            </div>
            <h2 className="text-3xl font-bold tracking-tight">Payment Successful</h2>
            <p className="text-green-100 mt-2">Thank you for your payment</p>
          </div>

          <CardContent className="p-8 md:p-12" ref={receiptRef}>
            {/* Header */}
            <div className="flex justify-between items-start border-b border-slate-100 pb-8 mb-8">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">{businessName}</h1>
                <p className="text-slate-500 mt-1">{city}</p>
              </div>
              <div className="text-right">
                <div className="text-sm font-semibold text-slate-400 tracking-wider uppercase mb-1">Receipt No.</div>
                <div className="text-lg font-medium text-slate-900">
                  #RCPT-{Math.floor(1000 + Math.random() * 9000)}-{new Date().getFullYear()}
                </div>
              </div>
            </div>

            {/* Billing Details */}
            <div className="grid grid-cols-2 gap-8 mb-12">
              <div>
                <div className="text-sm font-semibold text-slate-400 tracking-wider uppercase mb-2">Billed To</div>
                <div className="text-lg font-medium text-slate-900">{member.name}</div>
                <div className="text-slate-500">{member.phone}</div>
              </div>
              <div className="text-right">
                <div className="text-sm font-semibold text-slate-400 tracking-wider uppercase mb-2">Payment Date</div>
                <div className="text-lg font-medium text-slate-900">
                  {paidDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="mb-8">
              <div className="flex border-b border-slate-200 pb-3 mb-4">
                <div className="flex-1 font-semibold text-slate-500 uppercase text-sm tracking-wider">Description</div>
                <div className="font-semibold text-slate-500 uppercase text-sm tracking-wider text-right">Amount</div>
              </div>
              
              <div className="flex justify-between py-3">
                <div className="text-slate-900">
                  <div className="font-medium">{member.plan_name} Membership</div>
                  <div className="text-slate-500 text-sm mt-1">1 Month Cycle</div>
                </div>
                <div className="font-medium text-slate-900">₹{member.fee_amount.toLocaleString('en-IN')}</div>
              </div>
              
              <div className="flex justify-between py-6 mt-4 border-t border-slate-100">
                <div className="text-lg font-bold text-slate-900">Total Paid</div>
                <div className="text-2xl font-bold text-green-600">₹{member.fee_amount.toLocaleString('en-IN')}</div>
              </div>
            </div>

            <div className="text-center text-slate-500 text-sm pt-8 border-t border-slate-100 mt-12">
              This is a computer-generated receipt and does not require a physical signature.
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Print Styles */}
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body * {
            visibility: hidden;
          }
          .min-h-screen {
            min-height: auto;
            background: white !important;
          }
          .max-w-2xl {
            max-width: 100% !important;
          }
          .Card {
            border: none !important;
            box-shadow: none !important;
          }
          .CardContent, .CardContent * {
            visibility: visible;
          }
          .bg-green-600 {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
            background-color: #16a34a !important;
            color: white !important;
          }
          .text-green-600 {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
            color: #16a34a !important;
          }
          .CardContent {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
        }
      `}} />
    </div>
  );
}
