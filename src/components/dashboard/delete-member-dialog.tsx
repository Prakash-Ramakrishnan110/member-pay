'use client';

import { useActionState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { deleteMember } from '@/app/actions/member-actions';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function DeleteMemberDialog({ member, open, onOpenChange }: { member: any, open: boolean, onOpenChange: (open: boolean) => void }) {
  const [state, formAction, isPending] = useActionState(deleteMember, null);
  
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
          <DialogTitle className="text-red-600">Delete Member</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete <strong>{member.name}</strong>? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        
        <form action={formAction} className="space-y-4 pt-2">
          <input type="hidden" name="member_id" value={member.id} />
          
          {state?.error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md border border-red-200">
              {state.error}
            </div>
          )}

          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
              Cancel
            </Button>
            <Button type="submit" variant="destructive" disabled={isPending} className="bg-red-600 hover:bg-red-700 text-white">
              {isPending ? "Deleting..." : "Delete Member"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
