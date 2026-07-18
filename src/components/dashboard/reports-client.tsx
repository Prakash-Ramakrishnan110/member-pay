'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, TrendingUp, IndianRupee, Users } from 'lucide-react';

interface ReportsClientProps {
  metrics: {
    totalRevenueYTD: number;
    newMembersYTD: number;
    avgRevenuePerUser: number;
  };
  chartData: {
    month: string;
    revenue: number;
  }[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  members: any[];
}

export function ReportsClient({ metrics, chartData, members }: ReportsClientProps) {
  const maxRevenue = Math.max(...chartData.map(d => d.revenue), 1); // Avoid division by zero

  const handleExportCSV = () => {
    if (members.length === 0) return;

    // Build CSV header
    const headers = ['Name', 'Phone', 'Plan Name', 'Fee Amount', 'Billing Cycle', 'Status', 'Next Due Date', 'Start Date'];
    
    // Map members to CSV rows
    const rows = members.map(member => [
      `"${member.name || ''}"`,
      `"${member.phone || ''}"`,
      `"${member.plan_name || 'Custom'}"`,
      member.fee_amount || 0,
      `"${member.billing_cycle || ''}"`,
      `"${member.status || 'Active'}"`,
      `"${member.next_due_date ? new Date(member.next_due_date).toLocaleDateString() : ''}"`,
      `"${member.start_date ? new Date(member.start_date).toLocaleDateString() : ''}"`
    ]);

    // Combine header and rows
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    // Create a Blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `members_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-10">
      
      {/* Reports Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Reports & Analytics
          </h1>
          <p className="text-slate-500 font-medium text-sm mt-1">
            Detailed insights into your business performance based on real data.
          </p>
        </div>
        <div className="flex gap-2 shrink-0 items-center">
          <Button onClick={handleExportCSV} className="bg-white text-slate-700 border-slate-200 hover:bg-slate-50 font-semibold h-9 px-4 rounded-md shadow-sm border">
            <Download className="mr-2 h-4 w-4" /> Export Members (CSV)
          </Button>
        </div>
      </div>

      {/* KPI Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-none shadow-sm ring-1 ring-slate-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Estimated Revenue (YTD)</CardTitle>
            <IndianRupee className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">₹{metrics.totalRevenueYTD.toLocaleString('en-IN')}</div>
            <p className="text-xs text-slate-500 font-medium flex items-center mt-1">
              Based on active member cycles
            </p>
          </CardContent>
        </Card>
        
        <Card className="border-none shadow-sm ring-1 ring-slate-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">New Members (YTD)</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">{metrics.newMembersYTD}</div>
            <p className="text-xs text-slate-500 font-medium flex items-center mt-1">
              Joined this year
            </p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm ring-1 ring-slate-200 bg-gradient-to-br from-slate-900 to-slate-800 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Avg. Revenue Per User</CardTitle>
            <TrendingUp className="h-4 w-4 text-slate-300" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">₹{metrics.avgRevenuePerUser.toLocaleString('en-IN')}</div>
            <p className="text-xs text-slate-400 font-medium mt-1">
              Monthly Recurring Revenue per active member
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <Card className="border-none shadow-sm ring-1 ring-slate-200">
        <CardHeader>
          <CardTitle>MRR Growth Over Time</CardTitle>
          <CardDescription>Estimated Monthly Recurring Revenue (MRR) based on member join dates over the last 6 months.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] mt-4 flex items-end gap-2 sm:gap-6 pt-10">
            {chartData.map((data) => {
              const heightPercent = maxRevenue > 0 ? (data.revenue / maxRevenue) * 100 : 0;
              return (
                <div key={data.month} className="flex-1 flex flex-col items-center justify-end gap-2 group">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity text-xs font-semibold text-slate-700 bg-slate-100 px-2 py-1 rounded-md mb-2 whitespace-nowrap">
                    ₹{data.revenue.toLocaleString('en-IN')}
                  </div>
                  <div 
                    className="w-full bg-blue-500 rounded-t-sm transition-all duration-500 hover:bg-blue-600 relative"
                    style={{ height: `${heightPercent}%`, minHeight: data.revenue > 0 ? '4px' : '0' }}
                  />
                  <div className="text-xs text-slate-500 font-medium">{data.month}</div>
                </div>
              );
            })}
          </div>
          {chartData.every(d => d.revenue === 0) && (
            <div className="text-center text-slate-400 text-sm mt-4">
              No revenue data available yet. Add members to see your chart grow!
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
