'use client';

import { useState, useActionState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { editMember } from '@/app/actions/member-actions';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function EditMemberDialog({ member, open, onOpenChange }: { member: any, open: boolean, onOpenChange: (open: boolean) => void }) {
  const [state, formAction, isPending] = useActionState(editMember, null);
  
  // Close dialog on success
  useEffect(() => {
    if (state?.success) {
      onOpenChange(false);
    }
  }, [state, onOpenChange]);

  if (!member) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Member</DialogTitle>
          <DialogDescription>
            Update details for {member.name}.
          </DialogDescription>
        </DialogHeader>
        
        <form action={formAction} className="space-y-4 pt-4">
          <input type="hidden" name="member_id" value={member.id} />
          
          {state?.error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md border border-red-200">
              {state.error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" name="name" defaultValue={member.name} required />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input id="phone" name="phone" type="tel" defaultValue={member.phone} required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="plan_name">Plan</Label>
              <Input id="plan_name" name="plan_name" defaultValue={member.plan_name} required />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="fee_amount">Fee (₹)</Label>
              <Input id="fee_amount" name="fee_amount" type="number" defaultValue={member.fee_amount} required />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="batch_timing">Batch Timing</Label>
              <Select name="batch_timing" defaultValue={member.batch_timing || "Any Time"}>
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
              <Select name="working_days" defaultValue={member.working_days || "All Days"}>
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
              <Label htmlFor="billing_cycle">Billing Cycle</Label>
              <Select name="billing_cycle" defaultValue={member.billing_cycle}>
                <SelectTrigger>
                  <SelectValue placeholder="Select cycle" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Monthly">Monthly</SelectItem>
                  <SelectItem value="Quarterly">Quarterly</SelectItem>
                  <SelectItem value="Yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="plan_start_date">Start Date</Label>
              <Input 
                id="plan_start_date" 
                name="plan_start_date" 
                type="date" 
                defaultValue={member.plan_start_date ? member.plan_start_date.split('T')[0] : (member.start_date ? member.start_date.split('T')[0] : '')}
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="plan_end_date">End / Due Date</Label>
              <Input 
                id="plan_end_date" 
                name="plan_end_date" 
                type="date" 
                defaultValue={member.plan_end_date ? member.plan_end_date.split('T')[0] : (member.next_due_date ? member.next_due_date.split('T')[0] : '')}
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="subscription_status">Status</Label>
            <Select name="subscription_status" defaultValue={member.subscription_status || member.status || 'Active'}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Trial">Free Trial</SelectItem>
                <SelectItem value="Expired">Expired</SelectItem>
                <SelectItem value="Paused">Paused</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
