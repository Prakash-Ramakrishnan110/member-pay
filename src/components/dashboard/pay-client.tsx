'use client';

import { ShieldCheck, Smartphone, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTransition, useState } from 'react';
import { markAsPaidByStudent } from '@/app/actions/member-actions';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function PayClient({ member, settings }: { member: any, settings: any }) {
  const [hasCopied, setHasCopied] = useState(false);
  const [hasConfirmed, setHasConfirmed] = useState(false);
  const [transactionId, setTransactionId] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Construct UPI URL
  // upi://pay?pa=UPI_ID&pn=NAME&am=AMOUNT&cu=INR
  const amount = member.fee_amount || 0;
  const upiId = settings.upi_id;
  const businessName = encodeURIComponent(settings.name || 'Gym');
  const upiString = `upi://pay?pa=${upiId}&pn=${businessName}&am=${amount}&cu=INR`;
  
  // Use a reliable free QR code generation API
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(upiString)}&margin=10`;

  const handleCopy = () => {
    navigator.clipboard.writeText(upiId);
    setHasCopied(true);
    setTimeout(() => setHasCopied(false), 2000);
  };

  const handleConfirmPayment = () => {
    startTransition(async () => {
      const res = await markAsPaidByStudent(member.id, transactionId);
      if (res.error) {
        alert(res.error);
      } else {
        setIsSuccess(true);
        
        try {
          await fetch('/api/whatsapp/send', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              phone: member.phone, 
              message: `Hello ${member.name},\n\nYour payment verification for ${settings.name || 'our gym'} is currently under process.\n\nWe will notify you once it is confirmed.` 
            })
          });
        } catch (e) {
          console.error("Failed to send verification processing message", e);
        }
      }
    });
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl shadow-xl text-center max-w-md w-full ring-1 ring-slate-100">
          <div className="h-20 w-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-10 w-10" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-3">Payment Confirmed!</h1>
          <p className="text-slate-500 mb-8">
            Thank you for your payment. Your gym membership has been successfully updated.
          </p>
          <div className="text-sm text-slate-400">
            You can safely close this window.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 py-10 font-sans">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-8 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
          <div className="relative z-10">
            <h1 className="text-2xl font-bold tracking-tight mb-1">{settings.name || 'MemberPay'}</h1>
            <p className="text-slate-400 text-sm">Membership Invoice</p>
          </div>
        </div>

        <div className="p-8">
          <div className="flex justify-between items-end border-b border-dashed border-slate-200 pb-6 mb-6">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Billed To</p>
              <p className="font-medium text-slate-900">{member.name}</p>
              <p className="text-sm text-slate-500">{member.plan_name || 'Custom Plan'}</p>
            </div>
            <div className="text-right">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Amount Due</p>
              <p className="text-3xl font-bold text-slate-900">₹{amount}</p>
            </div>
          </div>

          <div className="text-center">
            <p className="text-sm font-medium text-slate-700 mb-4">Scan with any UPI App to Pay</p>
            
            <div className="inline-block p-3 bg-white rounded-2xl shadow-sm border border-slate-200 mb-6 relative group">
              {/* Fallback to QR API */}
              <img 
                src={qrCodeUrl} 
                alt="UPI QR Code" 
                className="w-56 h-56 rounded-lg"
              />
              <div className="absolute inset-0 border-4 border-emerald-500 rounded-2xl opacity-0 scale-105 group-hover:scale-100 group-hover:opacity-10 transition-all duration-300"></div>
            </div>

            <div className="flex flex-col gap-3">
              {/* Deep links for mobile devices */}
              <div className="grid grid-cols-2 gap-3 mb-2">
                <a 
                  href={`tez://upi/pay?pa=${upiId}&pn=${businessName}&am=${amount}&cu=INR`}
                  className="flex flex-col items-center justify-center p-3 rounded-xl font-semibold text-slate-800 bg-white border border-slate-200 hover:bg-slate-50 shadow-sm transition-all"
                >
                  <img src="https://upload.wikimedia.org/wikipedia/commons/f/f2/Google_Pay_Logo.svg" alt="GPay" className="h-5 mb-1" />
                  <span className="text-xs">GPay</span>
                </a>
                
                <a 
                  href={`phonepe://pay?pa=${upiId}&pn=${businessName}&am=${amount}&cu=INR`}
                  className="flex flex-col items-center justify-center p-3 rounded-xl font-semibold text-slate-800 bg-white border border-slate-200 hover:bg-[#6739b7]/5 hover:border-[#6739b7]/30 shadow-sm transition-all"
                >
                  <img src="https://download.logo.wine/logo/PhonePe/PhonePe-Logo.wine.png" alt="PhonePe" className="h-6 object-contain -my-1" />
                  <span className="text-xs text-[#6739b7]">PhonePe</span>
                </a>
                
                <a 
                  href={`paytmmp://pay?pa=${upiId}&pn=${businessName}&am=${amount}&cu=INR`}
                  className="flex flex-col items-center justify-center p-3 rounded-xl font-semibold text-slate-800 bg-white border border-slate-200 hover:bg-[#00baf2]/5 hover:border-[#00baf2]/30 shadow-sm transition-all"
                >
                  <img src="https://upload.wikimedia.org/wikipedia/commons/2/24/Paytm_Logo_%28standalone%29.svg" alt="Paytm" className="h-4 mb-1.5 mt-0.5" />
                  <span className="text-xs text-[#00baf2]">Paytm</span>
                </a>
                
                <a 
                  href={upiString}
                  className="flex flex-col items-center justify-center p-3 rounded-xl font-semibold text-slate-800 bg-white border border-slate-200 hover:bg-slate-50 shadow-sm transition-all"
                >
                  <Smartphone className="h-5 w-5 mb-1 text-slate-500" />
                  <span className="text-xs text-slate-600">Other Apps</span>
                </a>
              </div>

              <Button 
                variant="outline" 
                onClick={handleCopy}
                className="w-full py-6 rounded-xl border-slate-200 text-slate-700 font-medium hover:bg-slate-50"
              >
                {hasCopied ? 'UPI ID Copied!' : `Copy UPI ID: ${upiId}`}
              </Button>
            </div>
            
            {/* The Honesty Button Section */}
            <div className="mt-10 border-t border-slate-100 pt-8 text-left">
              <label className="flex items-start gap-3 cursor-pointer group mb-4">
                <div className="mt-0.5">
                  <input 
                    type="checkbox" 
                    className="w-5 h-5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                    checked={hasConfirmed}
                    onChange={(e) => setHasConfirmed(e.target.checked)}
                  />
                </div>
                <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors">
                  I confirm that I have successfully transferred <strong>₹{amount}</strong> to the UPI ID above via my bank application.
                </span>
              </label>

              {hasConfirmed && (
                <div className="mb-4 animate-in fade-in slide-in-from-top-2 duration-300">
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Transaction / UPI Reference Number (Optional)
                  </label>
                  <input 
                    type="text" 
                    placeholder="e.g. 312345678901"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                  />
                </div>
              )}
              
              <Button 
                className="w-full mt-5 py-6 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                disabled={!hasConfirmed || isPending}
                onClick={handleConfirmPayment}
              >
                {isPending ? 'Confirming...' : 'I Have Paid'}
              </Button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 p-4 border-t border-slate-100 text-center flex items-center justify-center text-xs text-slate-500 font-medium">
          <ShieldCheck className="w-4 h-4 mr-1 text-emerald-500" />
          100% Secure & Direct UPI Payment
        </div>
      </div>
    </div>
  );
}
