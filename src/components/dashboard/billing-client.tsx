'use client';

import { CheckCircle2, Zap, Calendar, CreditCard, Clock, ShieldCheck } from 'lucide-react';
import { CheckoutButton } from './checkout-button';
import { motion } from 'framer-motion';

export function BillingClient({ business, userPhone }: { business: any, userPhone: string }) {
  
  // Subscription calculation logic
  const isPaid = !!business?.plan_id;
  let statusBadge = '';
  let statusColor = '';
  
  let startDate = new Date();
  let endDate = new Date();
  let daysRemaining = 0;
  let progressPercentage = 0;

  if (isPaid) {
    startDate = business?.subscription_starts_at ? new Date(business.subscription_starts_at) : new Date();
    endDate = business?.subscription_ends_at ? new Date(business.subscription_ends_at) : new Date();
    
    const today = new Date();
    const totalDuration = endDate.getTime() - startDate.getTime();
    const timePassed = today.getTime() - startDate.getTime();
    
    daysRemaining = Math.max(0, Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));
    const rawProgress = Math.min(100, Math.max(0, (timePassed / totalDuration) * 100));
    progressPercentage = Math.round(rawProgress);
    
    if (business.subscription_status === 'active') {
      statusBadge = 'Active';
      statusColor = 'bg-emerald-500 text-white';
    } else {
      statusBadge = 'Inactive / Expired';
      statusColor = 'bg-rose-500 text-white';
    }
  } else {
    // Free Trial Logic
    startDate = business?.created_at ? new Date(business.created_at) : new Date();
    endDate = new Date(startDate.getTime() + (7 * 24 * 60 * 60 * 1000));
    
    const today = new Date();
    const totalDuration = 7 * 24 * 60 * 60 * 1000;
    const timePassed = today.getTime() - startDate.getTime();
    
    daysRemaining = Math.max(0, Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));
    const rawProgress = Math.min(100, Math.max(0, (timePassed / totalDuration) * 100));
    progressPercentage = Math.round(rawProgress);
    
    if (daysRemaining > 0) {
      statusBadge = 'Trial Active';
      statusColor = 'bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.5)]';
    } else {
      statusBadge = 'Trial Expired';
      statusColor = 'bg-slate-500 text-white';
    }
  }

  const formatDate = (d: Date) => {
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-10">
      
      {/* Subscription Summary */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-6">
        <div className="flex flex-col lg:flex-row gap-8 justify-between items-start lg:items-center">
          
          {/* Page Title Section */}
          <div className="flex-1 space-y-1 lg:border-r border-slate-100 lg:pr-8">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Billing & Plans
            </h1>
            <p className="text-slate-500 font-medium text-sm">
              Manage your workspace access, active subscriptions, and upgrade preferences.
            </p>
          </div>

          {/* Current Plan Details */}
          <div className="flex-1 w-full space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Current Plan</span>
              <span className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full ${statusColor}`}>
                {statusBadge}
              </span>
            </div>
            
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                {isPaid ? 'Pro Plan' : 'Free Trial'}
              </h2>
            </div>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-slate-400" />
                <div>
                  <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Started</p>
                  <p className="text-sm font-bold text-slate-700">{formatDate(startDate)}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-400" />
                <div>
                  <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Ends On</p>
                  <p className="text-sm font-bold text-slate-700">{formatDate(endDate)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Progress Section */}
          <div className="w-full lg:w-64 bg-slate-50 border border-slate-200 rounded-xl p-4 shrink-0">
            <div className="flex justify-between items-end mb-2">
              <span className="text-2xl font-black text-slate-900">{daysRemaining}</span>
              <span className="text-xs font-medium text-slate-500 mb-1">days left</span>
            </div>
            <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden mb-2">
              <div 
                className="h-full bg-blue-500 rounded-full transition-all duration-1000"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <p className="text-[10px] font-medium text-slate-500 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-500" />
              Secure, uninterrupted access
            </p>
          </div>
        </div>
      </div>

      {/* Pricing Grids */}
      <div className="pt-2">
        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {/* Pro Plan Monthly */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col relative overflow-hidden"
          >
            <h3 className="text-lg font-bold text-slate-900 mb-1 relative z-10">Pro Plan <span className="text-sm font-normal text-slate-500">(Monthly)</span></h3>
            <p className="text-xs text-slate-500 font-medium mb-4 relative z-10">Pay as you go.</p>
            <div className="text-3xl font-extrabold text-slate-900 mb-6 flex items-baseline relative z-10">
              ₹499<span className="text-sm text-slate-500 font-medium ml-1">/mo</span>
            </div>
            <ul className="space-y-3 mb-6 flex-1 text-sm relative z-10">
              <li className="flex items-start font-medium text-slate-700"><CheckCircle2 className="h-4 w-4 text-indigo-500 mr-2 shrink-0 mt-0.5" /> Unlimited members</li>
              <li className="flex items-start font-medium text-slate-700"><CheckCircle2 className="h-4 w-4 text-indigo-500 mr-2 shrink-0 mt-0.5" /> Automated WhatsApp reminders</li>
              <li className="flex items-start font-medium text-slate-700"><CheckCircle2 className="h-4 w-4 text-indigo-500 mr-2 shrink-0 mt-0.5" /> Smart payment verifications</li>
              <li className="flex items-start font-medium text-slate-700"><Zap className="h-4 w-4 text-indigo-500 mr-2 shrink-0 mt-0.5" /> Priority Support</li>
            </ul>
            <div className="mt-auto relative z-10">
              <CheckoutButton 
                planName="Pro" 
                planAmount={499} 
                businessName={business?.name || 'MemberPay User'} 
                userPhone={userPhone} 
              />
            </div>
          </motion.div>

          {/* Pro Plan Yearly */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-indigo-50 rounded-2xl border-2 border-indigo-200 shadow-md p-6 flex flex-col relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 bg-indigo-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg uppercase tracking-wider">
              Save ₹989
            </div>
            
            <h3 className="text-lg font-bold text-indigo-950 mb-1 relative z-10">Pro Plan <span className="text-sm font-normal text-indigo-700/70">(Yearly)</span></h3>
            <p className="text-xs text-indigo-700/70 font-medium mb-4 relative z-10">2 Months Free.</p>
            <div className="text-3xl font-extrabold text-indigo-950 mb-6 flex items-baseline relative z-10">
              ₹4,999<span className="text-sm text-indigo-700/70 font-medium ml-1">/yr</span>
            </div>
            <ul className="space-y-3 mb-6 flex-1 text-sm relative z-10">
              <li className="flex items-start font-medium text-indigo-900"><CheckCircle2 className="h-4 w-4 text-indigo-500 mr-2 shrink-0 mt-0.5" /> Everything in Monthly, plus:</li>
              <li className="flex items-start font-medium text-indigo-900"><CheckCircle2 className="h-4 w-4 text-emerald-500 mr-2 shrink-0 mt-0.5" /> 2 Months Free</li>
              <li className="flex items-start font-medium text-indigo-900"><CheckCircle2 className="h-4 w-4 text-emerald-500 mr-2 shrink-0 mt-0.5" /> Priority Onboarding</li>
            </ul>
            <div className="mt-auto relative z-10">
              <CheckoutButton 
                planName="Pro Plan (Annual)" 
                planAmount={4999} 
                businessName={business?.name || 'MemberPay User'} 
                userPhone={userPhone} 
              />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
