'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function AddMemberPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    plan: 'Gold Plan',
    fee: '',
    cycle: 'Monthly',
    startDate: new Date().toISOString().split('T')[0],
    notes: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent, action: 'save' | 'save_and_add') => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Mock API call
      console.log('Saving member:', formData);
      await new Promise(res => setTimeout(res, 800));

      if (action === 'save') {
        router.push('/dashboard');
      } else {
        // Reset form for next member
        setFormData({
          ...formData,
          name: '',
          phone: '',
          notes: '',
        });
        window.scrollTo(0, 0);
      }
    } catch (err) {
      console.error('Error saving member', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard" className="flex h-10 w-10 items-center justify-center rounded-md hover:bg-gray-100">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Add New Member</h1>
      </div>

      <Card>
        <form onSubmit={(e) => handleSubmit(e, 'save')}>
          <CardHeader>
            <CardTitle>Member Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input 
                  id="name" 
                  placeholder="e.g. Rahul Sharma" 
                  required 
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <div className="flex">
                  <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-100 px-3 text-sm text-gray-500">
                    +91
                  </span>
                  <Input 
                    id="phone" 
                    type="tel" 
                    placeholder="9999999999" 
                    className="rounded-l-none" 
                    required 
                    maxLength={10}
                    value={formData.phone}
                    onChange={e => setFormData({...formData, phone: e.target.value.replace(/\D/g, '')})}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="plan">Membership Plan</Label>
                <select 
                  id="plan" 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  value={formData.plan}
                  onChange={e => setFormData({...formData, plan: e.target.value})}
                >
                  <option>Gold Plan</option>
                  <option>Silver Plan</option>
                  <option>Student Plan</option>
                  <option>Yoga Monthly</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fee">Fee Amount (₹) *</Label>
                <Input 
                  id="fee" 
                  type="number" 
                  placeholder="e.g. 1500" 
                  required 
                  min="1"
                  value={formData.fee}
                  onChange={e => setFormData({...formData, fee: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cycle">Billing Cycle</Label>
                <select 
                  id="cycle" 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  value={formData.cycle}
                  onChange={e => setFormData({...formData, cycle: e.target.value})}
                >
                  <option>Monthly</option>
                  <option>Quarterly</option>
                  <option>Yearly</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input 
                  id="startDate" 
                  type="date" 
                  required 
                  value={formData.startDate}
                  onChange={e => setFormData({...formData, startDate: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nextDue">Next Due Date (Auto-calculated)</Label>
                <Input id="nextDue" type="date" disabled value={formData.startDate} />
                <p className="text-xs text-gray-500">Calculated based on start date + cycle</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Input 
                id="notes" 
                placeholder="e.g. Prefers evening batch, referred by Amit" 
                value={formData.notes}
                onChange={e => setFormData({...formData, notes: e.target.value})}
              />
            </div>

          </CardContent>
          <CardFooter className="flex justify-between border-t p-6 bg-gray-50 rounded-b-xl">
            <Button variant="ghost" type="button" onClick={() => router.push('/dashboard')}>Cancel</Button>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                type="button" 
                disabled={isLoading}
                onClick={(e) => handleSubmit(e, 'save_and_add')}
              >
                Save & Add Another
              </Button>
              <Button type="submit" disabled={isLoading} className="bg-blue-600 hover:bg-blue-700">
                {isLoading ? 'Saving...' : 'Save Member'}
              </Button>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
