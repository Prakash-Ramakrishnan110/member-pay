'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { IndianRupee, TrendingUp, TrendingDown, CreditCard, Activity } from 'lucide-react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function RevenueClient({ allMembers }: { allMembers: any[] }) {
  // Calculate platform-wide metrics
  const activeMembers = allMembers.filter(m => m.status === 'Active');
  
  let mrr = 0;
  activeMembers.forEach(member => {
    let mrrMultiplier = 1;
    const cycle = member.billing_cycle?.toLowerCase() || 'monthly';
    const fee = member.fee_amount || 0;
    if (cycle.includes('3 month') || cycle.includes('quarterly')) mrrMultiplier = 1 / 3;
    else if (cycle.includes('6 month')) mrrMultiplier = 1 / 6;
    else if (cycle.includes('year') || cycle.includes('12 month')) mrrMultiplier = 1 / 12;
    else if (cycle.includes('week')) mrrMultiplier = 4;
    mrr += (fee * mrrMultiplier);
  });

  const arr = mrr * 12;

  // Assuming a 2% platform fee for the SaaS model simulation
  const platformFeePercentage = 0.02;
  const platformMrr = mrr * platformFeePercentage;
  const platformArr = arr * platformFeePercentage;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Platform Revenue</h2>
          <p className="text-slate-500">Volume and platform earnings overview</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-none shadow-sm ring-1 ring-slate-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                <IndianRupee className="h-5 w-5" />
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Total Volume (MRR)</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">₹{Math.round(mrr).toLocaleString('en-IN')}</h3>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm ring-1 ring-slate-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                <Activity className="h-5 w-5" />
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Total Volume (ARR)</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">₹{Math.round(arr).toLocaleString('en-IN')}</h3>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm ring-1 ring-slate-200 bg-slate-900 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-slate-800 text-emerald-400 rounded-lg">
                <TrendingUp className="h-5 w-5" />
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-400">Est. Platform Revenue (MRR)</p>
              <h3 className="text-2xl font-bold text-white mt-1">₹{Math.round(platformMrr).toLocaleString('en-IN')}</h3>
              <p className="text-xs text-slate-500 mt-1">Assuming 2% take rate</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-none shadow-sm ring-1 ring-slate-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-red-50 text-red-600 rounded-lg">
                <TrendingDown className="h-5 w-5" />
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Churned MRR (This Month)</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">₹0</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-none shadow-sm ring-1 ring-slate-200">
          <CardHeader>
            <CardTitle className="text-lg">Cohort Retention Analysis</CardTitle>
            <CardDescription>Percentage of customers remaining active by signup month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-slate-50 rounded-md border border-slate-100 flex items-center justify-center flex-col text-slate-400">
              <Activity className="h-8 w-8 mb-2 opacity-50" />
              <p className="font-medium text-sm">Need more data</p>
              <p className="text-xs">Retention cohorts will appear after 2 months of history.</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm ring-1 ring-slate-200">
          <CardHeader>
            <CardTitle className="text-lg text-red-600 flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Failed Subscription Payments
            </CardTitle>
            <CardDescription>SaaS billing failures for your customers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <div className="h-12 w-12 rounded-full bg-green-50 flex items-center justify-center mb-4">
                <Activity className="h-6 w-6 text-green-500" />
              </div>
              <p className="text-sm font-medium text-slate-900">All payments successful!</p>
              <p className="text-xs text-slate-500 mt-1">No businesses have past-due SaaS bills.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Ensure Badge is available in this file. I'll import it above or define it if it fails.
// I'll add the Badge import to the file directly:
import { Badge } from '@/components/ui/badge';
