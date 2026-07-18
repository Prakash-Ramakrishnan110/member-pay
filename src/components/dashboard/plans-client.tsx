'use client';

import { useState } from 'react';
import { useActionState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Edit2, Trash2, CheckCircle2, Users } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { addPlan, archivePlan } from '@/app/actions/plan-actions';
import { useFormStatus } from 'react-dom';

interface PlanMember {
  id: string;
  name: string;
  phone: string;
  next_due_date: string;
}

interface Plan {
  id: string;
  name: string;
  price: number;
  duration: string;
  status: string;
  membersCount: number;
  members: PlanMember[];
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="bg-blue-600 hover:bg-blue-700">
      {pending ? 'Saving...' : 'Save Plan'}
    </Button>
  );
}

export function PlansClient({ initialPlans }: { initialPlans: Plan[] }) {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  
  const [state, formAction] = useActionState(async (prevState: any, formData: FormData) => {
    const result = await addPlan(prevState, formData);
    if (result.success) {
      setIsAddOpen(false);
    }
    return result;
  }, { success: false, error: undefined });

  const handleArchive = async (id: string) => {
    if (confirm('Are you sure you want to archive this plan? It will no longer be available for new members.')) {
      try {
        await archivePlan(id);
      } catch (err: any) {
        alert(err.message);
      }
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-10">
      
      {/* Plans Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Plans & Pricing
          </h1>
          <p className="text-slate-500 font-medium text-sm mt-1">
            Manage your membership packages and pricing tiers.
          </p>
        </div>
        <div className="shrink-0">
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger className="inline-flex items-center justify-center whitespace-nowrap bg-blue-600 hover:bg-blue-700 text-white font-semibold h-9 px-4 rounded-md transition-all w-full sm:w-auto shadow-sm text-sm">
              <Plus className="mr-2 h-4 w-4" /> Create New Plan
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Plan</DialogTitle>
                <DialogDescription>
                  Add a new membership plan for your customers to subscribe to.
                </DialogDescription>
              </DialogHeader>
              <form action={formAction}>
                <div className="space-y-4 py-4">
                  {state.error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm border border-red-100 font-medium">
                      {state.error}
                    </div>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-slate-700 font-semibold text-xs uppercase tracking-wider">Plan Name</Label>
                    <Input id="name" name="name" placeholder="e.g. Platinum Membership" required className="bg-slate-50 border-slate-200 rounded-xl font-medium" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="price" className="text-slate-700 font-semibold text-xs uppercase tracking-wider">Price (₹)</Label>
                      <Input id="price" name="price" type="number" placeholder="1500" required className="bg-slate-50 border-slate-200 rounded-xl font-medium" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="duration" className="text-slate-700 font-semibold text-xs uppercase tracking-wider">Duration</Label>
                      <select 
                        id="duration"
                        name="duration"
                        className="flex h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
                        required
                      >
                        <option value="1 Month">1 Month</option>
                        <option value="3 Months">3 Months</option>
                        <option value="6 Months">6 Months</option>
                        <option value="12 Months">12 Months</option>
                      </select>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)} className="rounded-xl font-bold">Cancel</Button>
                  <SubmitButton />
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-blue-50/50 border-blue-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-800">Active Plans</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">{initialPlans.filter(p => p.status === 'Active').length}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead>Plan Name</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Subscribers</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {initialPlans.map(p => (
                  <TableRow key={p.id} className="cursor-pointer hover:bg-slate-50 transition-colors" onClick={() => setSelectedPlan(p)}>
                    <TableCell className="font-medium text-gray-900">{p.name}</TableCell>
                    <TableCell>₹{p.price.toLocaleString('en-IN')}</TableCell>
                    <TableCell className="text-gray-500">{p.duration}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200">
                        <Users className="w-3 h-3 mr-1" />
                        {p.membersCount} members
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {p.status === 'Active' 
                        ? <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Active</Badge> 
                        : <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-100">Archived</Badge>
                      }
                    </TableCell>
                    <TableCell className="text-right">
                      {p.status === 'Active' && (
                        <div className="flex justify-end gap-2" onClick={e => e.stopPropagation()}>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600 hover:bg-blue-50">
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleArchive(p.id)} className="h-8 w-8 text-red-600 hover:bg-red-50">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
                {initialPlans.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-slate-500">
                      No plans created yet. Click "Create New Plan" to get started.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* View Plan Members Modal */}
      <Dialog open={!!selectedPlan} onOpenChange={(open) => !open && setSelectedPlan(null)}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{selectedPlan?.name} Subscribers</DialogTitle>
            <DialogDescription>
              {selectedPlan?.membersCount} members are currently subscribed to this plan.
            </DialogDescription>
          </DialogHeader>
          <div className="border rounded-md max-h-[400px] overflow-y-auto mt-4">
            <Table>
              <TableHeader className="bg-slate-50 sticky top-0">
                <TableRow>
                  <TableHead>Member Name</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Next Due</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {selectedPlan?.members && selectedPlan.members.length > 0 ? (
                  selectedPlan.members.map(member => (
                    <TableRow key={member.id}>
                      <TableCell className="font-medium text-slate-800">{member.name}</TableCell>
                      <TableCell className="text-slate-600">{member.phone}</TableCell>
                      <TableCell>
                        {member.next_due_date ? new Date(member.next_due_date).toLocaleDateString('en-IN') : 'N/A'}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-6 text-slate-500">
                      No members are subscribed to this plan yet.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <DialogFooter className="mt-4">
            <Button onClick={() => setSelectedPlan(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
