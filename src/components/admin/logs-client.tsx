'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Building2, UserPlus, Clock, Activity, AlertCircle } from 'lucide-react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function LogsClient({ logs, dbOperational, apiErrors }: { logs: any[], dbOperational: boolean, apiErrors: any[] }) {

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Platform Activity Logs</h2>
          <p className="text-slate-500">Real-time system events across all customers</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <Card className="border-none shadow-sm ring-1 ring-slate-200">
            <CardHeader className="bg-slate-50 border-b border-slate-100 pb-4">
              <CardTitle className="text-lg">Event Feed</CardTitle>
              <CardDescription>Synthesized from database records</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-slate-100">
                {logs.length > 0 ? (
                  logs.map((log) => (
                    <div key={log.id} className="p-4 hover:bg-slate-50 flex gap-4 transition-colors">
                      <div className="mt-1 flex-shrink-0">
                        {log.type === 'business_signup' ? (
                          <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                            <Building2 className="h-4 w-4 text-blue-600" />
                          </div>
                        ) : (
                          <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center">
                            <UserPlus className="h-4 w-4 text-emerald-600" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-900">{log.title}</p>
                        <p className="text-sm text-slate-600 mt-0.5">{log.description}</p>
                        <div className="flex items-center gap-1 mt-2 text-xs text-slate-400 font-mono">
                          <Clock className="h-3 w-3" />
                          {new Date(log.timestamp).toLocaleString('en-IN')}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-slate-500">
                    No recent activity found.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-none shadow-sm ring-1 ring-slate-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Activity className="h-4 w-4 text-slate-400" />
                System Health
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Database (Supabase)</span>
                {dbOperational ? (
                  <span className="text-xs font-semibold px-2 py-1 bg-green-100 text-green-700 rounded-full">Operational</span>
                ) : (
                  <span className="text-xs font-semibold px-2 py-1 bg-red-100 text-red-700 rounded-full">Outage</span>
                )}
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Cron Jobs</span>
                <span className="text-xs font-semibold px-2 py-1 bg-green-100 text-green-700 rounded-full">Operational</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Razorpay Webhooks</span>
                <span className="text-xs font-semibold px-2 py-1 bg-slate-100 text-slate-500 rounded-full">Not Configured</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm ring-1 border-red-200 bg-red-50/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2 text-red-700">
                <AlertCircle className="h-4 w-4" />
                API Error Monitor
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="py-2">
                {apiErrors && apiErrors.length > 0 ? (
                  <div className="space-y-3">
                    {apiErrors.map(err => (
                      <div key={err.id} className="text-sm border border-red-100 bg-white p-3 rounded-md">
                        <div className="flex justify-between font-mono text-xs mb-1">
                          <span className="text-red-700 font-bold">{err.status_code || '500'}</span>
                          <span className="text-slate-400">{new Date(err.created_at).toLocaleTimeString('en-IN')}</span>
                        </div>
                        <p className="text-slate-800 font-medium truncate">{err.endpoint}</p>
                        <p className="text-slate-500 text-xs mt-1 break-words">{err.error_message}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-600 text-center py-4">No 5xx errors recorded in the last 24 hours.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
