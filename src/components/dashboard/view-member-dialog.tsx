'use client';

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function ViewMemberDialog({ member, open, onOpenChange }: { member: any, open: boolean, onOpenChange: (open: boolean) => void }) {
  if (!member) return null;

  const startDate = member.plan_start_date ? new Date(member.plan_start_date) : (member.start_date ? new Date(member.start_date) : new Date());
  const endDate = member.plan_end_date ? new Date(member.plan_end_date) : (member.next_due_date ? new Date(member.next_due_date) : new Date());
  const today = new Date();
  
  // Calculate Progress
  const totalMs = endDate.getTime() - startDate.getTime();
  const passedMs = today.getTime() - startDate.getTime();
  let rawProgress = totalMs > 0 ? (passedMs / totalMs) * 100 : 100;
  rawProgress = Math.max(0, Math.min(100, rawProgress));
  const progress = Math.round(rawProgress);
  
  const daysRemaining = Math.max(0, Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));
  
  const isExpired = daysRemaining === 0;
  const isTrial = member.subscription_status === 'Trial';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px] p-0 overflow-hidden border-0 shadow-2xl rounded-2xl">
        <div className="bg-slate-900 px-6 py-8 text-white relative">
          <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-500/20 rounded-full blur-[50px]" />
          
          <div className="flex justify-between items-start relative z-10">
            <div>
              <h2 className="text-2xl font-bold tracking-tight mb-1">{member.name}</h2>
              <p className="text-slate-400 font-medium text-sm flex items-center">
                <span className="w-2 h-2 rounded-full mr-2 bg-slate-400" />
                {member.phone}
              </p>
            </div>
            <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${isExpired ? 'bg-red-500/20 text-red-400' : isTrial ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
              {isExpired ? 'Expired' : isTrial ? 'Free Trial' : 'Active'}
            </div>
          </div>
        </div>
        
        <div className="p-6 bg-white space-y-8">
          
          {/* Subscription Card */}
          <div className="bg-slate-50 rounded-xl border border-slate-200 p-5 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center">
              Current Plan
            </h3>
            
            <div className="flex justify-between items-end mb-2">
              <div>
                <div className="text-lg font-bold text-indigo-600">{member.plan_name}</div>
                <div className="text-sm font-medium text-slate-500">₹{member.fee_amount} / {member.billing_cycle}</div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-extrabold text-slate-900">{daysRemaining}</div>
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Days Left</div>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="h-2.5 w-full bg-slate-200 rounded-full overflow-hidden mb-3">
              <div 
                className={`h-full rounded-full transition-all duration-1000 ${isExpired ? 'bg-red-500' : isTrial ? 'bg-amber-500' : 'bg-indigo-600'}`}
                style={{ width: `${progress}%` }}
              />
            </div>
            
            <div className="flex justify-between text-xs font-medium text-slate-500">
              <span>Started: {startDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
              <span>Ends: {endDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
            </div>
          </div>
          
          {/* Additional Details */}
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Schedule Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white border border-slate-100 shadow-sm rounded-lg p-3">
                <div className="text-xs text-slate-500 font-medium mb-1">Batch Timing</div>
                <div className="text-sm font-bold text-slate-900">{member.batch_timing || 'Any Time'}</div>
              </div>
              <div className="bg-white border border-slate-100 shadow-sm rounded-lg p-3">
                <div className="text-xs text-slate-500 font-medium mb-1">Working Days</div>
                <div className="text-sm font-bold text-slate-900">{member.working_days || 'All Days'}</div>
              </div>
            </div>
          </div>
          
        </div>
        
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Close Profile
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
