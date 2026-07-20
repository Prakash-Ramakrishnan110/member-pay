'use client';

import { useState, useEffect } from 'react';
import { useActionState } from 'react';
import { addMember } from '@/app/actions/member-actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Plus, Loader2 } from 'lucide-react';
import { useFormStatus } from 'react-dom';

const initialState: { error?: string; success?: boolean } = {
  error: undefined,
  success: false
};

// Submit Button with loading state
function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending} className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Adding...
        </>
      ) : (
        'Add Member'
      )}
    </Button>
  );
}

export function AddMemberDialog({ plans = [] }: { plans?: any[] }) {
  const [open, setOpen] = useState(false);
  const [state, formAction] = useActionState(addMember, initialState);

  // Auto-fill state for when a plan is selected
  const [selectedFee, setSelectedFee] = useState<string>('');
  const [selectedCycle, setSelectedCycle] = useState<string>('Monthly');
  const [isCustomPlan, setIsCustomPlan] = useState(false);

  const activePlans = plans.filter(p => p.status === 'Active');

  const handlePlanChange = (planName: string | null) => {
    if (!planName) return;
    const plan = activePlans.find(p => p.name === planName);
    if (plan) {
      setSelectedFee(plan.price.toString());
      setSelectedCycle(plan.duration);
    }
  };

  // Close dialog on success
  useEffect(() => {
    if (state.success) {
      setTimeout(() => setOpen(false), 0);
    }
  }, [state.success]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger 
        render={
          <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/20" />
        }
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Member
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Member</DialogTitle>
          <DialogDescription>
            Enter the details of the new member. Their next due date will be calculated automatically.
          </DialogDescription>
        </DialogHeader>

        <form action={formAction} className="space-y-6 py-4">
          
          {state.error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm font-medium border border-red-100">
              {state.error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" name="name" placeholder="Rahul Sharma" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" name="phone" type="tel" placeholder="9876543210" required />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="plan_name">Plan Name</Label>
              {activePlans.length > 0 && (
                <button 
                  type="button" 
                  onClick={() => setIsCustomPlan(!isCustomPlan)} 
                  className="text-xs font-medium text-blue-600 hover:text-blue-700 hover:underline"
                >
                  {isCustomPlan ? 'Choose an existing plan' : 'Enter a custom plan'}
                </button>
              )}
            </div>
            
            {activePlans.length > 0 && !isCustomPlan ? (
              <Select name="plan_name" onValueChange={handlePlanChange} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select a plan" />
                </SelectTrigger>
                <SelectContent>
                  {activePlans.map(plan => (
                    <SelectItem key={plan.id} value={plan.name}>
                      {plan.name} (₹{plan.price} / {plan.duration})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <Input id="plan_name" name="plan_name" placeholder="e.g. Custom Corporate Rate" required />
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fee_amount">Fee Amount (₹)</Label>
              <Input 
                id="fee_amount" 
                name="fee_amount" 
                type="number" 
                min="0" 
                step="0.01" 
                placeholder="1500"
                value={selectedFee}
                onChange={(e) => setSelectedFee(e.target.value)}
                required 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="billing_cycle">Billing Cycle</Label>
              <Select 
                name="billing_cycle" 
                value={selectedCycle} 
                onValueChange={(val) => val && setSelectedCycle(val)} 
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select cycle" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1 Month">1 Month</SelectItem>
                  <SelectItem value="Monthly">Monthly</SelectItem>
                  <SelectItem value="3 Months">3 Months</SelectItem>
                  <SelectItem value="Quarterly">Quarterly</SelectItem>
                  <SelectItem value="6 Months">6 Months</SelectItem>
                  <SelectItem value="12 Months">12 Months</SelectItem>
                  <SelectItem value="Yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="batch_timing">Batch Timing</Label>
              <Select name="batch_timing" defaultValue="Any Time">
                <SelectTrigger>
                  <SelectValue placeholder="Select timing" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Morning">Morning Batch</SelectItem>
                  <SelectItem value="Evening">Evening Batch</SelectItem>
                  <SelectItem value="Any Time">Any Time</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="working_days">Working Days</Label>
              <Select name="working_days" defaultValue="All Days">
                <SelectTrigger>
                  <SelectValue placeholder="Select days" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All Days">All Days</SelectItem>
                  <SelectItem value="Mon-Fri">Mon-Fri</SelectItem>
                  <SelectItem value="Mon-Sat">Mon-Sat</SelectItem>
                  <SelectItem value="Alternate Days">Alternate Days</SelectItem>
                  <SelectItem value="Weekends">Weekends Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dob">Date of Birth</Label>
              <Input 
                id="dob" 
                name="dob" 
                type="date" 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="start_date">Start Date</Label>
              <Input 
                id="start_date" 
                name="start_date" 
                type="date" 
                defaultValue={new Date().toISOString().split('T')[0]} 
                required 
              />
            </div>
          </div>

          <div className="space-y-2 flex flex-col justify-end pb-2 pt-2">
            <label className="flex items-center space-x-2 cursor-pointer group">
              <input 
                type="checkbox" 
                name="is_trial" 
                className="rounded border-slate-300 text-blue-600 focus:ring-blue-600 h-4 w-4"
              />
              <span className="text-sm font-bold text-slate-700 group-hover:text-blue-700 transition-colors">Start 7-Day Free Trial</span>
            </label>
            <p className="text-[10px] text-slate-500 leading-tight">Automatically ends in 7 days without charging.</p>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <SubmitButton />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
